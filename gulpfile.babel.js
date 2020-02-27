// Initialize modules
import {src, dest, watch, series, parallel} from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import imagemin from 'gulp-imagemin';
import del from 'del';
import webpack from 'webpack-stream';
import named from 'vinyl-named';
import browserSync from 'browser-sync';
import zip from 'gulp-zip';
import pkg from './package.json';
import replace from 'gulp-replace';
import wpPot from 'gulp-wp-pot';
import banner from 'gulp-banner';

const PRODUCTION = yargs.argv.prod;
const server = browserSync.create();

// Browsersync
const serve = done => {
    server.init({
        proxy: 'http://localhost'
    });
    done();
};
const reload = done => {
    server.reload();
    done();
};

// WordPress banner
const comment = '/*\n' +
' * Theme Name: <%= pkg.name %>\n' +
' * Author: <%= pkg.author %>\n' +
' * Author URI: <%= pkg.website %>\n' +
' * Description: <%= pkg.description %>\n' +
' * Version: <%= pkg.version %>\n' +
' * License: <%= pkg.license %>\n' +
' * License URI: <%= pkg.license_uri %>\n' +
' * Text Domain: <%= pkg.name %>\n' +
' * Tags: <%= pkg.keywords %>\n' +
'*/\n\n';

// Clean
export const clean = () => del(['dist', 'build']);

// Styles
export const styles = () => {
    return src('src/scss/style.scss')
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(PRODUCTION, postcss([autoprefixer])))
        .pipe(gulpif(PRODUCTION, cleanCss({
            compatibility: 'ie8'
        })))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(banner(comment, {
            pkg
        }))
        .pipe(dest('dist/php'))
        .pipe(server.stream());
};

// Images
export const images = () => {
    return src('src/images/**/*.{jpg,jpeg,png,svg,gif}')
        .pipe(gulpif(PRODUCTION, imagemin()))
        .pipe(dest('dist/images'));
};

// Copy
export const copy = () => {
    return src('src/**/*.php')
        .pipe(dest('dist'));
};

// Scripts
export const scripts = () => {
    return src(['src/js/main.js', 'src/js/admin.js'])
        .pipe(named())
        .pipe(webpack({
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }
                ]
            },
            mode: PRODUCTION ? 'production' : 'development',
            devtool: !PRODUCTION ? 'inline-source-map' : false, // eval
            output: {
                filename: !PRODUCTION ? '[name].js' : '[name].min.js'
            },
            externals: {
                jquery: 'jQuery'
            }
        }))
        .pipe(dest('dist/js'));
};

// Generate ZIP
export const compress = () => {
    return src('dist/**/*')
        .pipe(gulpif(
            file => file.relative.split('.').pop() !== 'zip',
            replace('_themename', pkg.name)
        ))
        .pipe(zip(`${pkg.name}.zip`))
        .pipe(dest('./build'));
};

// Generate POT
export const makePot = () => {
    return src('**/*.php')
        .pipe(
            wpPot({
                domain: '_themename',
                package: pkg.name
            })
        )
        .pipe(dest(`dist/languages/${pkg.name}.pot`));
};

// Watch
export const watchForChanges = () => {
    watch('src/scss/**/*.scss', styles);
    watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', series(images, reload));
    watch(['src/**/*', '!src/{images,js,scss}', '!src/{images,js,scss}/**/*'], series(copy, reload));
    watch('src/js/**/*.js', series(scripts, reload));
    watch('**/*.php', reload);
};

export const dev = series(clean, parallel(styles, images, copy, scripts), serve, watchForChanges);
export const build = series(clean, parallel(styles, images, copy, scripts), makePot, compress);
export default dev;
