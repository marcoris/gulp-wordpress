import {src, dest} from 'gulp';
import gulpif from 'gulp-if';
import imagemin from 'gulp-imagemin';
import pkg from '../package.json';
import yargs from 'yargs';

const PRODUCTION = yargs.argv.prod;

// Images
const images = () => {
    return src('src/images/**/*.{jpg,jpeg,png,svg,gif}')
        .pipe(gulpif(PRODUCTION, imagemin()))
        .pipe(dest(`wwwroot/wp-content/themes/${pkg.name}/assets/images`));
};

module.exports = images;
