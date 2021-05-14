// Gulp plugins
import {src, dest, series} from 'gulp';
import bumpVersion from 'gulp-bump';
import conventionalChangelog from 'gulp-conventional-changelog';
import prompt from 'gulp-prompt';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import run from 'gulp-run';

// Other plugins
import pkg from './package.json';
import fs from 'fs';

require('dotenv').config();

// Set nucleus styleguide config and .env file
const setupEnvironment = () => {
    src('./config/config.nucleus.json')
        .pipe(replace('@@themename', pkg.name))
        .pipe(dest('.'));
    if (fs.existsSync('.env_template')) {
        if (!fs.existsSync('.env')) {
            return src('.env_template')
                .pipe(run('cp .env_template .env'))
                .pipe(prompt.prompt([{
                    type: 'input',
                    name: 'hosting',
                    message: 'Hostname: 1ahosting?',
                    default: '1ahosting'
                },
                {
                    type: 'input',
                    name: 'hostinguser',
                    message: 'Hostinguser?',
                    default: pkg.name
                },
                {
                    type: 'input',
                    name: 'wpversion',
                    message: 'WordPress version?',
                    default: '5.3.2'
                },
                {
                    type: 'input',
                    name: 'locale',
                    message: 'WordPress locale?',
                    default: 'de_CH'
                },
                {
                    type: 'input',
                    name: 'dockername',
                    message: 'Dockername?',
                    default: 'gulpwordpress'
                },
                {
                    type: 'input',
                    name: 'acfversion',
                    message: 'ACF Pro version?',
                    default: '5.6.7'
                },
                {
                    type: 'input',
                    name: 'acfpro',
                    message: 'ACF Pro key?',
                    default: ''
                }], function(res) {
                    //value is in res.name
                    return src('.env')
                        .pipe(replace('hostinguser', res.hostinguser))
                        .pipe(replace('hosting', res.hosting))
                        .pipe(replace('acfpro', res.acfpro))
                        .pipe(replace('acfversion', res.acfversion))
                        .pipe(replace('wpversion', res.wpversion))
                        .pipe(replace('locale', res.locale))
                        .pipe(replace('dockername', res.dockername))
                        .pipe(dest('.'));
                }));
        }

        return src('.env')
            .pipe(run('echo .env already exists'));
    }

    return src('.env')
        .pipe(run('echo .env_template does not exist!'));
};

// Sets the configuration
const setConfig = () => {
    var cmd = new run.Command('sh getKeys.sh');
    cmd.exec();
    var keys = fs.readFileSync('keys.php', 'utf-8');

    return src('./config/wp-config.php')
        .pipe(prompt.prompt({
            type: 'checkbox',
            name: 'config',
            message: 'Setup for?',
            choices: ['local', 'staging', 'production']
        }, function(res) {
            if (res.config[0] == 'staging') {
                src('./config/wp-config.php')
                    .pipe(replace('@@db_name', process.env.STAGING_DB_NAME))
                    .pipe(replace('@@db_user', process.env.STAGING_DB_USER))
                    .pipe(replace('@@db_pass', process.env.STAGING_DB_PASS))
                    .pipe(replace('@@db_host', process.env.STAGING_DB_HOST))
                    .pipe(replace('@@db_prefix', process.env.DB_PREFIX))
                    .pipe(replace('@@wp_debug', process.env.STAGING_WP_DEBUG))
                    .pipe(replace('@@save_queries', process.env.STAGING_SAVEQUERIES))
                    .pipe(replace('@@disallow_file_mods', process.env.STAGING_DISALLOW_FILE_MODS))
                    .pipe(replace('@@wp_allow_multisite', process.env.STAGING_WP_ALLOW_MULTISITE))
                    .pipe(replace('@@include', keys))
                    .pipe(dest('wwwroot'));
            } else if (res.config[0] == 'production') {
                src('./config/wp-config.php')
                    .pipe(replace('@@db_name', process.env.PRODUCTION_DB_NAME))
                    .pipe(replace('@@db_user', process.env.PRODUCTION_DB_USER))
                    .pipe(replace('@@db_pass', process.env.PRODUCTION_DB_PASS))
                    .pipe(replace('@@db_host', process.env.PRODUCTION_DB_HOST))
                    .pipe(replace('@@db_prefix', process.env.DB_PREFIX))
                    .pipe(replace('@@wp_debug', process.env.PRODUCTION_WP_DEBUG))
                    .pipe(replace('@@save_queries', process.env.PRODUCTION_SAVEQUERIES))
                    .pipe(replace('@@disallow_file_mods', process.env.PRODUCTION_DISALLOW_FILE_MODS))
                    .pipe(replace('@@wp_allow_multisite', process.env.PRODUCTION_WP_ALLOW_MULTISITE))
                    .pipe(replace('@@include', keys))
                    .pipe(dest('wwwroot'));
            } else {
                src('./config/wp-config.php')
                    .pipe(replace('@@db_name', process.env.LOCAL_DB_NAME))
                    .pipe(replace('@@db_user', process.env.LOCAL_DB_USER))
                    .pipe(replace('@@db_pass', process.env.LOCAL_DB_PASS))
                    .pipe(replace('@@db_host', process.env.LOCAL_DB_HOST))
                    .pipe(replace('@@db_prefix', process.env.DB_PREFIX))
                    .pipe(replace('@@wp_debug', process.env.LOCAL_WP_DEBUG))
                    .pipe(replace('@@save_queries', process.env.LOCAL_SAVEQUERIES))
                    .pipe(replace('@@disallow_file_mods', process.env.LOCAL_DISALLOW_FILE_MODS))
                    .pipe(replace('@@wp_allow_multisite', process.env.LOCAL_WP_ALLOW_MULTISITE))
                    .pipe(replace('@@include', keys))
                    .pipe(dest('wwwroot'));
            }
        }));
};

// Create composer.json with acf pro key to download wordpress plugins
const setComposerfile = () => {
    return src('composer_template.json')
        .pipe(replace('@@acf_version', process.env.ACF_VERSION))
        .pipe(replace('@@acf_pro_key', process.env.ACF_PRO_KEY))
        .pipe(rename('composer.json'))
        .pipe(dest('.'));
};

// Copy production htaccess
const copyHtaccessProduction = () => {
    return src('node_modules/apache-server-configs/dist/.htaccess')
        .pipe(dest('wwwroot'));
};

// Bump version x.x.1
const bumpPatch = () => {
    return src(['./package.json', './README.md'])
        .pipe(bumpVersion({
            type: 'patch'
        }))
        .pipe(dest('.'));
};

// Bump version x.1.x
const bumpMinor = () => {
    return src(['./package.json', './README.md'])
        .pipe(bumpVersion({
            type: 'minor'
        }))
        .pipe(dest('.'));
};

// Bump version 1.x.x
const bumpMajor = () => {
    return src(['./package.json', './README.md'])
        .pipe(bumpVersion({
            type: 'major'
        }))
        .pipe(dest('.'));
};

// Changelog
export const changelog = () => {
    return src('CHANGELOG.md', {
        buffer: true
    })
        .pipe(conventionalChangelog({
            preset: 'angular',
            outputUnreleased: true
        }))
        .pipe(dest('.'));
};

// Bump up project version
export const bumpPrompt = () => {
    const runPatch = series(bumpPatch, changelog);
    const runMinor = series(bumpMinor, changelog);
    const runMajor = series(bumpMajor, changelog);

    return src('./gulpfile.babel.js')
        .pipe(prompt.prompt({
            type: 'checkbox',
            name: 'bump',
            message: 'What type of bump would you like to do?',
            choices: ['patch', 'minor', 'major']
        }, function(res) {
            if (res.bump[0] == 'major') {
                runMajor();
            } else if (res.bump[0] == 'minor') {
                runMinor();
            } else {
                runPatch();
            }
        }));
};

// Release to github
const addRelease = () => {
    return run(`git add CHANGELOG.md README.md package.json && git commit --amend --no-edit && git tag v${pkg.version} -m "Version ${pkg.version}" && git push -f && git push --tags`).exec();
};

// Checks and updates WP version
import WPUpdate from './gulp/wpupdate';
exports.WPUpdate = WPUpdate;

// DB import
import dbimport from './gulp/dbimport';
exports.dbimport = dbimport;

// Rename textdomain
import renametextdomain from './gulp/renametextdomain';

// Makes *.pot file
import makepot from './gulp/makepot';
exports.makepot = series(renametextdomain, makepot);

// PO to MO
import potomo from './gulp/potomo';
exports.potomo = potomo;

// Compiles the styleguide
import docs from './gulp/docs';
exports.docs = docs;

// Adds the necessary template style.css with the information
import addbanner from './gulp/addbanner';

// Watch task
import watchForChanges from './gulp/watch';

// Serve task
import serve from './gulp/serve';

// Styles task
import styles from './gulp/styles';

// Scripts task
import scripts from './gulp/scripts';

// Cleans the themes directory
import clean from './gulp/clean';

// Cleans the themes and build directory
import cleanall from './gulp/cleanall';

// Images task
import images from './gulp/images';

// Plugins task
import plugins from './gulp/plugins';

// PHP task
import copyphp from './gulp/copyphp';

// Copy files (mo,po,htaccess)
import copyfiles from './gulp/copyfiles';

// Generate theme as zip to upload
import generatezip from './gulp/generatezip';

// Push images to server
import push from './gulp/push';
exports.push = push;

// Pull images from server
import pull from './gulp/pull';
exports.pull = pull;

// Deploy theme to server
import deploy from './gulp/deploy';
exports.deploy = deploy;

export const setup = series(setupEnvironment, setConfig, setComposerfile);
export const dev = series(clean, styles, images, makepot, copyfiles, copyphp, scripts, addbanner, plugins, docs, serve, watchForChanges);
export const build = series(cleanall, styles, images, makepot, copyfiles, copyphp, scripts, addbanner, plugins, copyHtaccessProduction, docs);
export const buildzip = series(cleanall, styles, images, makepot, copyfiles, copyphp, scripts, addbanner, copyHtaccessProduction, generatezip);
export const bump = series(bumpPrompt, addRelease);
export const release = addRelease;
export default dev;
