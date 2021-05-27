import {src, dest} from 'gulp';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import yargs from 'yargs';

require('dotenv').config();

var urlFrom, urlTo, sqlFrom, sqlTo;
var tableprefixFrom = process.env.LOCAL_DB_PREFIX;
var tableprefixTo = process.env.LOCAL_DB_PREFIX;

// Check if the argument is production or staging
if (typeof yargs.argv.prod !== 'undefined') {
    // prod => local
    if (yargs.argv.prod == 'local') {
        urlFrom = process.env.PRODUCTION_URL;
        urlTo = process.env.LOCAL_URL;
        sqlFrom = 'prod';
        sqlTo = 'local';
        tableprefixTo = process.env.LOCAL_DB_PREFIX;
    } else {
        // prod => stage
        urlFrom = process.env.PRODUCTION_URL;
        urlTo = process.env.STAGING_URL;
        sqlFrom = 'prod';
        sqlTo = 'stage';
        tableprefixTo = process.env.STAGING_DB_PREFIX;
    }
    tableprefixFrom = process.env.PRODUCTION_DB_PREFIX;
} else if (typeof yargs.argv.stage !== 'undefined') {
    // stage => local
    if (yargs.argv.stage == 'local') {
        urlFrom = process.env.STAGING_URL;
        urlTo = process.env.LOCAL_URL;
        sqlFrom = 'stage';
        sqlTo = 'local';
        tableprefixTo = process.env.LOCAL_DB_PREFIX;
    } else {
        // stage => prod
        urlFrom = process.env.STAGING_URL;
        urlTo = process.env.PRODUCTION_URL;
        sqlFrom = 'stage';
        sqlTo = 'prod';
        tableprefixTo = process.env.PRODUCTION_DB_PREFIX;
    }
    tableprefixFrom = process.env.STAGING_DB_PREFIX;
} else if (typeof yargs.argv.local !== 'undefined') {
    // local => prod
    if (yargs.argv.local == 'prod') {
        urlFrom = process.env.LOCAL_URL;
        urlTo = process.env.PRODUCTION_URL;
        sqlFrom = 'local';
        sqlTo = 'prod';
        tableprefixTo = process.env.PRODUCTION_DB_PREFIX;
    } else {
        // local => stage
        urlFrom = process.env.LOCAL_URL;
        urlTo = process.env.STAGING_URL;
        sqlFrom = 'local';
        sqlTo = 'stage';
        tableprefixTo = process.env.STAGING_DB_PREFIX;
    }
}

// Replace production or staging urlFrom to local urlFrom
const replaceDBStrings = (done) => {
    if (typeof sqlFrom !== 'undefined' && typeof urlFrom !== 'undefined' && process.env.LOCAL_URL !== '') {
        return src(`./sql/${sqlFrom}.sql`)
            .pipe(replace(tableprefixFrom, tableprefixTo))
            .pipe(replace(urlFrom, urlTo))
            .pipe(rename(`${sqlTo}.sql`))
            .pipe(dest('./sql'));
    } else {
        console.log(`
        Wrong parameter!\n
        --prod=local --table=wp_ for production to local\n
        --prod=stage --table=wp_ for production to stage\n
        --stage=local --table=wp_ for stage to local\n
        --stage=prod --table=wp_ for stage to production\n
        --local=prod --table=wp_ for local to productin\n
        --local=stage --table=wp_ for local to stage
        `);
    }

    done();
};

module.exports = replaceDBStrings;
