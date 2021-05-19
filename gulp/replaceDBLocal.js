import {src, dest} from 'gulp';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import yargs from 'yargs';

require('dotenv').config();

var url, sqlName;

// Check if the argument is production or staging
if (typeof yargs.argv.prod !== 'undefined') {
    url = process.env.PRODUCTION_URL;
    sqlName = 'prod';
} else if (typeof yargs.argv.stage !== 'undefined') {
    url = process.env.STAGING_URL;
    sqlName = 'stage';
} else {
    console.log('Wrong parameter! Use --prod for production or --stage for staging');
}

// Replace production or staging url to local url
const replaceDBLocal = (done) => {
    if (typeof sqlName !== 'undefined' && typeof url !== 'undefined' && process.env.LOCAL_URL !== '') {
        return src(`./sql/${sqlName}.sql`)
            .pipe(replace(`${url}`, `${process.env.LOCAL_URL}`))
            .pipe(rename('local.sql'))
            .pipe(dest('./sql'));
    }

    done();
};

module.exports = replaceDBLocal;
