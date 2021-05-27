import {src} from 'gulp';
import prompt from 'gulp-prompt';
import pkg from '../package.json';
var EasyFtp = require('easy-ftp');
var ftp = new EasyFtp();

require('dotenv').config();

var options = {
    host: process.env.PRODUCTION_FTP_HOST,
    username: process.env.PRODUCTION_FTP_USER,
    password: process.env.PRODUCTION_FTP_PASS
};

var dirArray = [];

const pull = () => {
    return src('.env')
        .pipe(prompt.prompt([{
            type: 'list',
            name: 'pushing',
            message: 'Pushing to?',
            choices: ['Staging', 'Production']
        },
        {
            type: 'list',
            name: 'data',
            message: 'What?',
            choices: [`Theme ${pkg.name}`, 'Uploads', `Theme ${pkg.name} and uploads`, 'Just the sql file']
        }], function(res) {
            if (res.pushing == 'Staging') {
                options = {
                    host: process.env.STAGING_FTP_HOST,
                    username: process.env.STAGING_FTP_USER,
                    password: process.env.STAGING_FTP_PASS
                };
            }

            var fails = 0;
            for (const [key, value] of Object.entries(options)) {
                if (`${value}` == '') {
                    fails++;
                }
            }

            switch (res.data) {
                case `Theme ${pkg.name}`:
                    dirArray.push({
                        local: `./${process.env.LOCAL_ROOT}/themes/${pkg.name}`,
                        remote: '/wp-content/themes'
                    });
                    break;
                case 'Uploads':
                    dirArray.push({
                        local: `./${process.env.LOCAL_ROOT}/uploads`,
                        remote: 'wp-content/uploads'
                    });
                    break;
                case `Theme ${pkg.name} and uploads`:
                    dirArray.push({
                        local: `./${process.env.LOCAL_ROOT}/themes/${pkg.name}`,
                        remote: '/wp-content/themes'
                    });
                    dirArray.push({
                        local: `./${process.env.LOCAL_ROOT}/uploads`,
                        remote: 'wp-content/uploads'
                    });
                    break;
                default:
                    if (res.from == 'Staging') {
                        // Add stage sql file
                        dirArray.push({
                            local: './sql/stage.sql',
                            remote: '/sql/stage.sql'
                        });
                    } else {
                        // Add production sql file
                        dirArray.push({
                            local: './sql/prod.sql',
                            remote: '/sql/prod.sql'
                        });
                    }
                    break;
            }

            // Check if it can be uploaded
            if (fails == 0) {
                ftp.connect(options);
                ftp.upload(dirArray, '/', function(err) {
                    if (err) {
                        console.log(err);
                    }
                    ftp.close();
                });
            } else {
                console.log(`\n>>> Credentials of ${res.config[0]} are missing!\n`);
            }
        }));
};

module.exports = pull;
