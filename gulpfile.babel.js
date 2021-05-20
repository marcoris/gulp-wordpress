// Gulp plugins
import {src, dest, series} from 'gulp';

// Copy production htaccess
const copyHtaccessProduction = () => {
    return src('node_modules/apache-server-configs/dist/.htaccess')
        .pipe(dest('wwwroot'));
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

// Get the generated remote sql file
import getSql from './gulp/getsql';
exports.getSql = getSql;

// Replace productive or staging urls to localhost
import replaceDBUrls from './gulp/replaceDBUrls';
exports.replaceDBUrls = replaceDBUrls;

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

// Generates the screenshot.png - Cheeeeese
import shot from './gulp/shot';
exports.shot = shot;

// Deploy theme to server
import deploy from './gulp/deploy';
exports.deploy = deploy;

// Bumps version
import bumpPrompt from './gulp/bump';

// Release to github with tags
import githubrelease from './gulp/githubrelease';

export const setup = series(setupEnvironment, setConfig, setComposerfile);
export const dev = series(clean, styles, images, makepot, copyfiles, copyphp, scripts, addbanner, plugins, docs, serve, watchForChanges);
export const build = series(cleanall, styles, images, makepot, copyfiles, copyphp, scripts, addbanner, plugins, copyHtaccessProduction, docs);
export const buildzip = series(cleanall, styles, images, makepot, copyfiles, copyphp, scripts, addbanner, copyHtaccessProduction, generatezip);
export const bump = series(bumpPrompt, githubrelease);
export const release = githubrelease;
export const updateACFPro = series(setComposerfile, composerUpdate);

export default dev;
