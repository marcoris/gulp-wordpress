var EasyFtp = require('easy-ftp');
import {src} from 'gulp';
import prompt from 'gulp-prompt';
var ftp = new EasyFtp();

import yargs from 'yargs';
require('dotenv').config();

var options = {
    type: 'sftp'
};
var dirArray = [];

const deploy = (done) => {
    if (typeof yargs.argv.prod === 'undefined' && typeof yargs.argv.stage === 'undefined') {
        console.log('Wrong parameter!');
        console.log('gulp deploy --stage for deploying to stage');
        console.log('gulp deploy --prod for deploying to production');
    } else {
        src('./wwwroot')
            .pipe(prompt.prompt({
                type: 'list',
                name: 'deploying',
                message: 'What to deploy?',
                choices: [`Uploads and ${process.env.DOCKER_NAME} theme`, 'wwwroot']
            }, function(res) {
                // If deploying is wwwroot
                if (res.deploying == 'wwwroot') {
                    // Add wwwroot
                    dirArray.push({
                        local: './wwwroot',
                        remote: '/'
                    });
                } else if (res.deploying == `Uploads and ${process.env.DOCKER_NAME} theme`) {
                    // Add uploads and theme
                    dirArray.push({
                        local: `./${process.env.LOCAL_ROOT}/uploads`,
                        remote: 'wp-content/uploads'
                    },
                    {
                        local: `./${process.env.LOCAL_ROOT}/themes/${process.env.DOCKER_NAME}`,
                        remote: '/wp-content/themes'
                    });
                }

                var fails = 0;
                if (typeof yargs.argv.stage !== 'undefined') {
                    // Set stage ftp options
                    options = {
                        host: process.env.STAGING_FTP_HOST,
                        username: process.env.STAGING_FTP_USER,
                        password: process.env.STAGING_FTP_PASS
                    };

                    // Add stage sql file
                    dirArray.push({
                        local: './sql/stage.sql',
                        remote: '/sql/stage.sql'
                    });
                } else {
                    // Set production ftp options
                    options = {
                        host: process.env.PRODUCTION_FTP_HOST,
                        username: process.env.PRODUCTION_FTP_USER,
                        password: process.env.PRODUCTION_FTP_PASS
                    };

                    // Add production sql file
                    dirArray.push({
                        local: './sql/prod.sql',
                        remote: '/sql/prod.sql'
                    });
                }

                // Check credentials
                for (const [key, value] of Object.entries(options)) {
                    if (`${value}` == '') {
                        fails++;
                    }
                }

                // Check if it can be deployed
                if (fails == 0) {
                    ftp.connect(options);
                    ftp.upload(dirArray, '/', function(err) {
                        if (err) {
                            console.log(err);
                        }
                        ftp.close();
                    });
                } else {
                    console.log(`\n>>> Credentials of ${yargs.argv} are missing!\n`);
                }
            }));
    }

    done();
};

module.exports = deploy;
