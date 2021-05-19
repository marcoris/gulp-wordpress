import {src, dest} from 'gulp';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import yargs from 'yargs';

require('dotenv').config();

var urlFrom, urlTo, sqlFrom, sqlTo;

// Check if the argument is production or staging
if (typeof yargs.argv.prod !== 'undefined') {
    // prod => local
    if (yargs.argv.prod == 'local') {
        urlFrom = process.env.PRODUCTION_URL;
        urlTo = process.env.LOCAL_URL;
        sqlFrom = 'prod';
        sqlTo = 'local';
    } else {
        // prod => stage
        urlFrom = process.env.PRODUCTION_URL;
        urlTo = process.env.STAGING_URL;
        sqlFrom = 'prod';
        sqlTo = 'stage';
    }
} else if (typeof yargs.argv.stage !== 'undefined') {
    // stage => local
    if (yargs.argv.stage == 'local') {
        urlFrom = process.env.STAGING_URL;
        urlTo = process.env.LOCAL_URL;
        sqlFrom = 'stage';
        sqlTo = 'local';
    } else {
        // stage => prod
        urlFrom = process.env.STAGING_URL;
        urlTo = process.env.PRODUCTION_URL;
        sqlFrom = 'stage';
        sqlTo = 'prod';
    }
} else if (typeof yargs.argv.local !== 'undefined') {
    // local => prod
    if (yargs.argv.local == 'prod') {
        urlFrom = process.env.LOCAL_URL;
        urlTo = process.env.PRODUCTION_URL;
        sqlFrom = 'local';
        sqlTo = 'prod';
    } else {
        // local => stage
        urlFrom = process.env.LOCAL_URL;
        urlTo = process.env.STAGING_URL;
        sqlFrom = 'local';
        sqlTo = 'stage';
    }
}

// Replace production or staging urlFrom to local urlFrom
const replaceDBLocal = (done) => {
    if (typeof sqlFrom !== 'undefined' && typeof urlFrom !== 'undefined' && process.env.LOCAL_URL !== '') {
        return src(`./sql/${sqlFrom}.sql`)
            .pipe(replace(`${urlFrom}`, `${urlTo}`))
            .pipe(rename(`${sqlTo}.sql`))
            .pipe(dest('./sql'));
    } else {
        console.log(`
        Wrong parameter!\n
        --prod=local for production to local\n
        --prod=stage for production to stage\n
        --stage=local for stage to local\n
        --stage=prod for stage to production\n
        --local=prod for local to productin\n
        --local=stage for local to stage
        `);
    }

    done();
};

module.exports = replaceDBLocal;
