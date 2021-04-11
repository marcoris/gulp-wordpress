import {src, dest} from 'gulp';
import replace from 'gulp-replace';
import pkg from '../package.json';

// Rename textdomain in all php files
const renametextdomain = () => {
    return src('src/php/**/*.php')
        .pipe(replace('gulpwordpress', pkg.name))
        .pipe(dest(`wwwroot/wp-content/themes/${pkg.name}`));
};

module.exports = renametextdomain;
