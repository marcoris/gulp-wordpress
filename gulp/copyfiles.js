import {src, dest} from 'gulp';
import pkg from '../package.json';

// Copy
const copyfiles = () => {
    return src('src/**/*.{mo,po,htaccess}')
        .pipe(dest(`wwwroot/wp-content/themes/${pkg.name}`));
};

module.exports = copyfiles;
