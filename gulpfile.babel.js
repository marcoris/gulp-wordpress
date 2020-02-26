// Initialize modules
import { src, dest, watch, series, parallel } from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import imagemin from 'gulp-imagemin';
import del from 'del';
const PRODUCTION = yargs.argv.prod;

export const styles = () => {
    return src('src/scss/style.scss')
      .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
      .pipe(sass().on('error', sass.logError))
      .pipe(gulpif(PRODUCTION, postcss([ autoprefixer ])))
      .pipe(gulpif(PRODUCTION, cleanCss({compatibility:'ie8'})))
      .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
      .pipe(dest('dist/css'));
}

export const images = () => {
    return src('src/images/**/*.{jpg,jpeg,png,svg,gif}')
      .pipe(gulpif(PRODUCTION, imagemin()))
      .pipe(dest('dist/images'));
}

export const copy = () => {
    return src(['src/**/*','!src/{images,js,scss}','!src/{images,js,scss}/**/*'])
      .pipe(dest('dist'));
}

export const clean = () => del(['dist']);

export const watchForChanges = () => {
    watch('src/scss/**/*.scss', styles);
    watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', images);
    watch(['src/**/*','!src/{images,js,scss}','!src/{images,js,scss}/**/*'], copy);
}

export const dev = series(clean, parallel(styles, images, copy), watchForChanges)
export const build = series(clean, parallel(styles, images, copy))
export default dev;
