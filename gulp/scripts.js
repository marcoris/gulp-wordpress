import {src, dest} from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';
import gulpif from 'gulp-if';
import pkg from '../package.json';
import yargs from 'yargs';

const PRODUCTION = yargs.argv.prod | yargs.argv.stage;

// Scripts
const scripts = () => {
    return src('src/js/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(concat('main.min.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulpif(PRODUCTION, uglify()))
        .pipe(dest(`wwwroot/wp-content/themes/${pkg.name}/assets/js`));
};

module.exports = scripts;
