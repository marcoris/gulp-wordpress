import yargs from 'yargs';
require('dotenv').config();

var EasyFtp = require('easy-ftp');
var ftp = new EasyFtp();
var options;

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
} else {
    console.log('Wrong parameter! Use --prod for production or --stage for staging');
}

// Get the sql file from production or staging
const getSql = (done) => {
    ftp.connect(options);
    ftp.download('/sql', './sql', function(err) {
        if (err) {
            console.log(err);
        }
        ftp.close();
    });

    done();
};

module.exports = getSql;
