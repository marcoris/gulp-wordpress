import {src, dest} from 'gulp';
import zip from 'gulp-zip';
import pkg from '../package.json';

// Generate ZIP
const generatezip = () => {
    return src(`wwwroot/wp-content/themes/${pkg.name}/**`)
        .pipe(zip(`${pkg.name}.zip`))
        .pipe(dest('build'));
};

module.exports = generatezip;
