import {src, dest} from 'gulp';
import banner from 'gulp-banner';
import pkg from '../package.json';

// WordPress banner
const comment = '/*\n' +
` * Theme Name: ${pkg.name}\n` +
` * Author: ${pkg.author}\n` +
` * Author URI: ${pkg.website}\n` +
` * Description: ${pkg.description}\n` +
` * Version: ${pkg.version}\n` +
` * License: ${pkg.license}\n` +
` * Text Domain: ${pkg.name}\n` +
` * Tags: ${pkg.keywords}\n` +
` * Copyright: ${pkg.year} ${pkg.author}\n` +
' * This stylesheet is not used by this WordPress site it only exists as reference for WordPress. The stylesheet in use can be found in this folder as style.min.{hash}.css\n' +
'*/\n';

// Add banner
const addbanner = () => {
    return src('./config/style.css')
        .pipe(banner(comment, {
            pkg
        }))
        .pipe(dest(`wwwroot/wp-content/themes/${pkg.name}`));
};

module.exports = addbanner;
