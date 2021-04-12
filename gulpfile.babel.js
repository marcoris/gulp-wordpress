// Gulp plugins
import {src, dest, series} from 'gulp';
import bumpVersion from 'gulp-bump';
import conventionalChangelog from 'gulp-conventional-changelog';
import prompt from 'gulp-prompt';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import run from 'gulp-run';

// Other plugins
import Rsync from 'rsync';
import pkg from './package.json';
import fs from 'fs';

require('dotenv').config();

// Run vagrant up and install its dependencies to work with WordPress
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
                    default: 'gulp-wordpress'
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
                    .pipe(replace('@@db_name', process.env.STAGE_DB_NAME))
                    .pipe(replace('@@db_user', process.env.STAGE_DB_USER))
                    .pipe(replace('@@db_pass', process.env.STAGE_DB_PASS))
                    .pipe(replace('@@db_host', process.env.STAGE_DB_HOST))
                    .pipe(replace('@@db_prefix', process.env.DB_PREFIX))
                    .pipe(replace('@@wp_debug', process.env.STAGE_WP_DEBUG))
                    .pipe(replace('@@save_queries', process.env.STAGE_SAVEQUERIES))
                    .pipe(replace('@@disallow_file_mods', process.env.STAGE_DISALLOW_FILE_MODS))
                    .pipe(replace('@@wp_allow_multisite', process.env.STAGE_WP_ALLOW_MULTISITE))
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

// Get images from live server
const rsyncget = (done) => {
    // rsync -avu --delete --progress ${pkg.url}@ssh.ENTER_SERVER_NAME_HERE.com:/wp-content/uploads ./'wwwroot'/wp-content/uploads
    done();
};

export const rsyncpush = (done) => {
    var rsync = new Rsync()
        .shell('ssh')
        .flags('azv')
        .set('progress')
        .source('./wwwroot/wp-content/themes/ENTER_THEME_NAME_HERE')
        .destination('ENTER_USER_NAME_HERE@ssh.ENTER_SERVER_NAME_HERE.comserver:/public_htm');

    // Execute the command
    rsync.execute(function(error, code, cmd) {
        // we're done
        done();
    });

    // return gulpSSH
    // .exec(['uptime', 'ls -a', 'pwd'], {filePath: 'commands.log'})
    // .pipe(dest('logs'))
    // rsync [optionen] quelle ziel
    // rsync -avu --delete --progress  ./'wwwroot'/wp-content/themes/${pkg.name} ${pkg.url}@ssh.ENTER_SERVER_NAME_HERE.com:/wp-content/themes/${pkg.name}
    // rsync -avn quelle ziel (simulation)
    // https://www.shellbefehle.de/befehle/rsync/
    // https://www.npmjs.com/package/remote-sync
    // https://stackoverflow.com/questions/49708424/nodejs-gulp-download-files-from-sftp
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

// Compile the styleguide
import docs from './gulp/docs';

// Adds the necessary template style.css with the information
import addbanner from './gulp/addbanner';

// Adds the necessary template style.css with the information
import watchForChanges from './gulp/watch';

// serve
import serve from './gulp/serve';

// Styles
import styles from './gulp/styles';

// Scripts
import scripts from './gulp/scripts';

// Clean
import clean from './gulp/clean';

// Clean all
import cleanall from './gulp/cleanall';

// Images
import images from './gulp/images';

// Plugins
import plugins from './gulp/plugins';

// Copy php
import copyphp from './gulp/copyphp';

// Copy files
import copyfiles from './gulp/copyfiles';

// Copy files
import generatezip from './gulp/generatezip';

export const setup = series(setupEnvironment, setConfig, setComposerfile);
export const dev = series(clean, styles, images, copyfiles, copyphp, scripts, addbanner, plugins, docs, makepot, serve, watchForChanges);
export const build = series(cleanall, styles, images, copyfiles, copyphp, scripts, addbanner, plugins, copyHtaccessProduction, docs, makepot);
export const buildzip = series(cleanall, styles, images, copyfiles, copyphp, scripts, addbanner, copyHtaccessProduction, makepot, generatezip);
export const bump = series(bumpPrompt, addRelease);
export const release = addRelease;
export const getimages = rsyncget;
export const pushfiles = rsyncpush;
export default dev;
