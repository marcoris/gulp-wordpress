import {src} from 'gulp';
import prompt from 'gulp-prompt';
var EasyFtp = require('easy-ftp');
var ftp = new EasyFtp();

require('dotenv').config();

var options = {
    host: process.env.PRODUCTION_FTP_HOST,
    username: process.env.PRODUCTION_FTP_USER,
    password: process.env.PRODUCTION_FTP_PASS
};
var remotePath = '/public_html/wp-content/uploads';

const push = () => {
    return src('.env')
        .pipe(prompt.prompt({
            type: 'checkbox',
            name: 'config',
            message: 'Pushing to?',
            choices: ['staging', 'production']
        }, function(res) {
            if (res.config[0] == 'staging') {
                options = {
                    host: process.env.STAGING_FTP_HOST,
                    username: process.env.STAGING_FTP_USER,
                    password: process.env.STAGING_FTP_PASS
                };
                remotePath = '/public_html/stage/wp-content/uploads';
            }

            var fails = 0;
            for (const [key, value] of Object.entries(options)) {
                if (`${value}` == '') {
                    fails++;
                }
            }

            // Check if it can be deployed
            if (fails == 0) {
                ftp.connect(options);
                ftp.upload('./wwwroot/wp-content/uploads', remotePath, function(err) {
                    ftp.close();
                });
            } else {
                console.log(`\n>>> Credentials of ${res.config[0]} are missing!\n`);
            }
        }));
};

module.exports = push;
