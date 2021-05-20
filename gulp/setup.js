import {src, dest} from 'gulp';
import replace from 'gulp-replace';
import run from 'gulp-run';

import yargs from 'yargs';
import fs from 'fs';

require('dotenv').config();

// Setup the wp-config.php for local, stage or production
const setup = (done) => {
    if (fs.existsSync('.env')) {
        var dbname = process.env.LOCAL_DB_NAME;
        var dbuser = process.env.LOCAL_DB_USER;
        var dbpass = process.env.LOCAL_DB_PASS;
        var dbhost = process.env.LOCAL_DB_HOST;
        var prefix = process.env.DB_PREFIX;
        var debug = process.env.LOCAL_WP_DEBUG;
        var savequ = process.env.LOCAL_SAVEQUERIES;
        var disfmo = process.env.LOCAL_DISALLOW_FILE_MODS;
        var almult = process.env.LOCAL_WP_ALLOW_MULTISITE;

        if (typeof yargs.argv.prod !== 'undefined') {
            dbname = process.env.PRODUCTION_DB_NAME;
            dbuser = process.env.PRODUCTION_DB_USER;
            dbpass = process.env.PRODUCTION_DB_PASS;
            dbhost = '';
            prefix = process.env.DB_PREFIX;
            debug = process.env.PRODUCTION_WP_DEBUG;
            savequ = process.env.PRODUCTION_SAVEQUERIES;
            disfmo = process.env.PRODUCTION_DISALLOW_FILE_MODS;
            almult = process.env.PRODUCTION_WP_ALLOW_MULTISITE;
        } else if (typeof yargs.argv.stage !== 'undefined') {
            dbname = process.env.STAGING_DB_NAME;
            dbuser = process.env.STAGING_DB_USER;
            dbpass = process.env.STAGING_DB_PASS;
            dbhost = '';
            prefix = process.env.DB_PREFIX;
            debug = process.env.STAGING_WP_DEBUG;
            savequ = process.env.STAGING_SAVEQUERIES;
            disfmo = process.env.STAGING_DISALLOW_FILE_MODS;
            almult = process.env.STAGING_WP_ALLOW_MULTISITE;
        }

        var cmd = new run.Command('sh ./shells/getKeys.sh').exec();
        var keys = fs.readFileSync('keys.php', 'utf-8');

        src('./config/wp-config.php')
            .pipe(replace('@@db_name', dbname))
            .pipe(replace('@@db_user', dbuser))
            .pipe(replace('@@db_pass', dbpass))
            .pipe(replace('@@db_host', dbhost))
            .pipe(replace('@@include', keys))
            .pipe(replace('@@db_prefix', prefix))
            .pipe(replace('@@wp_debug', debug))
            .pipe(replace('@@save_queries', savequ))
            .pipe(replace('@@disallow_file_mods', disfmo))
            .pipe(replace('@@wp_allow_multisite', almult))
            .pipe(dest('wwwroot'));
    } else {
        console.log('.env file does not exist.\nRun gulp setupFirst');
    }

    done();
};

module.exports = setup;
