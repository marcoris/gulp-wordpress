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

// Setsup nucleus and the .env file
import setupEnvironment from './gulp/setupenvironment';

// Sets the wp-config.php file
import setConfig from './gulp/setconfig';

// Sets the composer.json file
import setComposerfile from './gulp/setcomposerfile';

// Updates composer packages
import composerUpdate from './gulp/updatecomposer';

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

// Pull images from server
import db from './gulp/db';
exports.db = db;

// Deploy theme to server
import deploy from './gulp/deploy';
exports.deploy = deploy;

export const setup = series(setupEnvironment, setConfig, setComposerfile);
export const dev = series(clean, styles, images, makepot, copyfiles, copyphp, scripts, addbanner, plugins, docs, serve, watchForChanges);
export const build = series(cleanall, styles, images, makepot, copyfiles, copyphp, scripts, addbanner, plugins, copyHtaccessProduction, docs);
export const buildzip = series(cleanall, styles, images, makepot, copyfiles, copyphp, scripts, addbanner, copyHtaccessProduction, generatezip);
export const bump = series(bumpPrompt, addRelease);
export const release = addRelease;
export const updateACFPro = series(setComposerfile, composerUpdate);

export default dev;
