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
var destinationPath = process.env.PRODUCTION_FTP_DEST;

const deploy = () => {
    return src('.env')
        .pipe(prompt.prompt({
            type: 'checkbox',
            name: 'config',
            message: 'Deploying for?',
            choices: ['staging', 'production']
        }, function(res) {
            if (res.config[0] == 'staging') {
                options = {
                    host: process.env.STAGING_FTP_HOST,
                    username: process.env.STAGING_FTP_USER,
                    password: process.env.STAGING_FTP_PASS
                };
                destinationPath = process.env.STAGING_FTP_DEST;
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
                ftp.upload(`./wwwroot/wp-content/themes/${pkg.name}`, destinationPath, function(err) {
                    ftp.close();
                });
            } else {
                console.log(`\n>>> Credentials of ${res.config[0]} are missing!\n`);
            }
        }));
};

module.exports = deploy;
