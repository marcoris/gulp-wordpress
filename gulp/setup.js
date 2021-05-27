import {src, dest} from 'gulp';
import replace from 'gulp-replace';
import prompt from 'gulp-prompt';
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
        var prefix = process.env.LOCAL_DB_PREFIX;
        var debug = process.env.LOCAL_WP_DEBUG;
        var savequeries = process.env.LOCAL_SAVEQUERIES;
        var disallowfilemods = process.env.LOCAL_DISALLOW_FILE_MODS;
        var wpallowmultisite = process.env.LOCAL_WP_ALLOW_MULTISITE;

        if (typeof yargs.argv.prod !== 'undefined') {
            dbname = process.env.PRODUCTION_DB_NAME;
            dbuser = process.env.PRODUCTION_DB_USER;
            dbpass = process.env.PRODUCTION_DB_PASS;
            dbhost = '';
            prefix = process.env.PRODUCTION_DB_PREFIX;
            debug = process.env.PRODUCTION_WP_DEBUG;
            savequeries = process.env.PRODUCTION_SAVEQUERIES;
            disallowfilemods = process.env.PRODUCTION_DISALLOW_FILE_MODS;
            wpallowmultisite = process.env.PRODUCTION_WP_ALLOW_MULTISITE;
        } else if (typeof yargs.argv.stage !== 'undefined') {
            dbname = process.env.STAGING_DB_NAME;
            dbuser = process.env.STAGING_DB_USER;
            dbpass = process.env.STAGING_DB_PASS;
            dbhost = '';
            prefix = process.env.STAGING_DB_PREFIX;
            debug = process.env.STAGING_WP_DEBUG;
            savequeries = process.env.STAGING_SAVEQUERIES;
            disallowfilemods = process.env.STAGING_DISALLOW_FILE_MODS;
            wpallowmultisite = process.env.STAGING_WP_ALLOW_MULTISITE;
        }

        var cmd = new run.Command('sh ./shells/getKeys.sh && cp ./config/.htaccess ./wwwroot/.htaccess').exec();
        var keys = fs.readFileSync('keys.php', 'utf-8');

        src('./config/wp-config.php')
            .pipe(replace('@@db_name', dbname))
            .pipe(replace('@@db_user', dbuser))
            .pipe(replace('@@db_pass', dbpass))
            .pipe(replace('@@db_host', dbhost))
            .pipe(replace('@@include', keys))
            .pipe(replace('@@db_prefix', prefix))
            .pipe(replace('@@wp_debug', debug))
            .pipe(replace('@@save_queries', savequeries))
            .pipe(replace('@@disallow_file_mods', disallowfilemods))
            .pipe(replace('@@wp_allow_multisite', wpallowmultisite))
            .pipe(dest('wwwroot'));
    } else {
        src('.env_template')
            .pipe(prompt.prompt({
                type: 'list',
                name: 'settingup',
                message: '.env file does not exist. Copy from template for local use?',
                choices: ['yes', 'no']
            }, function(res) {
                if (res.settingup == 'yes') {
                    run('cp .env_template .env').exec();
                }
            }));
    }

    done();
};

module.exports = setup;
