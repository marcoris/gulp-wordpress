import yargs from 'yargs';

var EasyFtp = require('easy-ftp');
var ftp = new EasyFtp();

require('dotenv').config();

var options = {};

// Check if the argument is production or staging
if (typeof yargs.argv.prod !== 'undefined') {
    options = {
        host: process.env.PRODUCTION_FTP_HOST,
        username: process.env.PRODUCTION_FTP_USER,
        password: process.env.PRODUCTION_FTP_PASS
    };
} else if (typeof yargs.argv.stage !== 'undefined') {
    options = {
        host: process.env.STAGING_FTP_HOST,
        username: process.env.STAGING_FTP_USER,
        password: process.env.STAGING_FTP_PASS
    };
}

// Get the sql file from production or staging
const getSql = (done) => {
    if (Object.keys(options).length > 0) {
        ftp.connect(options);
        ftp.download('/sql', './sql', function(err) {
            if (err) {
                console.log(err);
            }
            ftp.close();
        });
    } else {
        console.log('Wrong parameter! Use --prod for production or --stage for staging');
    }

    done();
};

module.exports = getSql;
