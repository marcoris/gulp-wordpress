import {src, dest} from 'gulp';
import prompt from 'gulp-prompt';
import replace from 'gulp-replace';
import run from 'gulp-run';

import fs from 'fs';

require('dotenv').config();

// Sets the configuration
const setConfig = () => {
    var cmd = new run.Command('sh ./shells/getKeys.sh');
    cmd.exec();
    var keys = fs.readFileSync('keys.php', 'utf-8');

    return src('./config/wp-config.php')
        .pipe(prompt.prompt({
            type: 'list',
            name: 'config',
            message: 'Setup for?',
            choices: ['local', 'staging', 'production']
        }, function(res) {
            if (res.config == 'staging') {
                src('./config/wp-config.php')
                    .pipe(replace('@@db_name', process.env.STAGING_DB_NAME))
                    .pipe(replace('@@db_user', process.env.STAGING_DB_USER))
                    .pipe(replace('@@db_pass', process.env.STAGING_DB_PASS))
                    .pipe(replace('@@db_host', 'localhost'))
                    .pipe(replace('@@include', keys))
                    .pipe(replace('@@db_prefix', process.env.DB_PREFIX))
                    .pipe(replace('@@wp_debug', process.env.STAGING_WP_DEBUG))
                    .pipe(replace('@@save_queries', process.env.STAGING_SAVEQUERIES))
                    .pipe(replace('@@disallow_file_mods', process.env.STAGING_DISALLOW_FILE_MODS))
                    .pipe(replace('@@wp_allow_multisite', process.env.STAGING_WP_ALLOW_MULTISITE))
                    .pipe(dest('wwwroot'));
            } else if (res.config == 'production') {
                src('./config/wp-config.php')
                    .pipe(replace('@@db_name', process.env.PRODUCTION_DB_NAME))
                    .pipe(replace('@@db_user', process.env.PRODUCTION_DB_USER))
                    .pipe(replace('@@db_pass', process.env.PRODUCTION_DB_PASS))
                    .pipe(replace('@@db_host', 'localhost'))
                    .pipe(replace('@@include', keys))
                    .pipe(replace('@@db_prefix', process.env.DB_PREFIX))
                    .pipe(replace('@@wp_debug', process.env.PRODUCTION_WP_DEBUG))
                    .pipe(replace('@@save_queries', process.env.PRODUCTION_SAVEQUERIES))
                    .pipe(replace('@@disallow_file_mods', process.env.PRODUCTION_DISALLOW_FILE_MODS))
                    .pipe(replace('@@wp_allow_multisite', process.env.PRODUCTION_WP_ALLOW_MULTISITE))
                    .pipe(dest('wwwroot'));
            } else {
                src('./config/wp-config.php')
                    .pipe(replace('@@db_name', process.env.LOCAL_DB_NAME))
                    .pipe(replace('@@db_user', process.env.LOCAL_DB_USER))
                    .pipe(replace('@@db_pass', process.env.LOCAL_DB_PASS))
                    .pipe(replace('@@db_host', process.env.LOCAL_DB_HOST))
                    .pipe(replace('@@include', keys))
                    .pipe(replace('@@db_prefix', process.env.DB_PREFIX))
                    .pipe(replace('@@wp_debug', process.env.LOCAL_WP_DEBUG))
                    .pipe(replace('@@save_queries', process.env.LOCAL_SAVEQUERIES))
                    .pipe(replace('@@disallow_file_mods', process.env.LOCAL_DISALLOW_FILE_MODS))
                    .pipe(replace('@@wp_allow_multisite', process.env.LOCAL_WP_ALLOW_MULTISITE))
                    .pipe(dest('wwwroot'));
            }
        }));
};

module.exports = setConfig;
