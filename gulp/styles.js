import {src, dest} from 'gulp';
import sass from 'gulp-sass';
import sassLint from 'gulp-sass-lint';
import cleanCss from 'gulp-clean-css';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import gulpif from 'gulp-if';
import autoprefixer from 'autoprefixer';
import rename from 'gulp-rename';
import pkg from '../package.json';
import browserSync from 'browser-sync';
import yargs from 'yargs';

const PRODUCTION = yargs.argv.prod;
const server = browserSync.create();

// Styles
const styles = () => {
    return src('src/scss/style.scss')
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(PRODUCTION, postcss([autoprefixer(
            'last 2 versions',
            '> 1%',
            'safari 5',
            'ie 8',
            'ie 9',
            'opera 12.1',
            'ios 6',
            'android 4' )])))
        .pipe(gulpif(PRODUCTION, cleanCss({
            compatibility: 'ie8'
        })))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(rename('style.min.css'))
        .pipe(dest(`wwwroot/wp-content/themes/${pkg.name}/assets/css`))
        .pipe(server.stream());
};

module.exports = styles;
