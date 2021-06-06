// Gulp plugins
import {series} from 'gulp';

// Setsup nucleus and the .env file
import setupEnvironment from './gulp/setupenvironment';

// Sets the composer.json file
import setComposerfile from './gulp/setcomposerfile';

// Updates composer packages
import composerUpdate from './gulp/updatecomposer';

// Checks and updates WP version
import WPUpdate from './gulp/wpupdate';
exports.WPUpdate = WPUpdate;

// Get the generated remote sql file
import getSql from './gulp/getsql';
exports.getSql = getSql;

// Replace productive or staging urls to localhost
import replaceDBStrings from './gulp/replaceDBStrings';
exports.replaceDBStrings = replaceDBStrings;

// Rename textdomain
import renametextdomain from './gulp/renametextdomain';

// Makes *.pot file
import makepot from './gulp/makepot';
exports.makepot = series(renametextdomain, makepot);

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
exports.styles = styles;

// Scripts task
import scripts from './gulp/scripts';
exports.scripts = scripts;

// Cleans the themes directory
import clean from './gulp/clean';

// Cleans the themes and build directory
import cleanall from './gulp/cleanall';

// Images task to minimize
import images from './gulp/images';
exports.images = images;

// Plugins task
import copyplugins from './gulp/copyplugins';

// PHP task
import copyphp from './gulp/copyphp';

// Copy .htaccess file
import copyhtaccess from './gulp/copyhtaccess';

// Copy translation files (mo,po)
import copytranslations from './gulp/copytranslations';

// Copy translation file *.pot
import copypot from './gulp/copypot';

// Generate theme as zip to upload
import generatezip from './gulp/generatezip';

// Push files to server
import push from './gulp/push';
exports.push = push;

// Pull files from server
import pull from './gulp/pull';
exports.pull = pull;

// Generates the screenshot.png - Cheeeeese
import shot from './gulp/shot';
exports.shot = shot;

// Deploy theme to server
import deploy from './gulp/deploy';
exports.deploy = deploy;

// Setup wp-config.php
import setupWPConfig from './gulp/setupwpconfig';
exports.setupWPConfig = setupWPConfig;

// Bumps version
import bumpPrompt from './gulp/bump';

export const firstSetup = series(setupEnvironment, setupWPConfig, setComposerfile);
export const dev = series(clean, styles, images, makepot, copyhtaccess, copypot, copytranslations, copyphp, copyplugins, scripts, addbanner, docs, serve, watchForChanges);
export const build = series(cleanall, styles, images, makepot, copyhtaccess, copypot, copytranslations, copyphp, copyplugins, scripts, addbanner, docs, shot);
export const buildzip = series(cleanall, styles, images, makepot, copyhtaccess, copypot, copytranslations, copyphp, copyplugins, scripts, addbanner, shot, generatezip);
export const bump = series(bumpPrompt);
export const updateACFPro = series(setComposerfile, composerUpdate);

export default dev;
