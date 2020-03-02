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
import prompt from 'gulp-prompt';
import bumpVersion from 'gulp-bump';
import conventionalChangelog from 'gulp-conventional-changelog';
import notify from 'gulp-notify';
import run from 'gulp-run';

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
` * Theme Name: ${pkg.name}\n` +
` * Author: ${pkg.author}\n` +
` * Author URI: ${pkg.website}\n` +
` * Description: ${pkg.description}\n` +
` * Version: ${pkg.version}\n` +
` * License: ${pkg.license}\n` +
` * License URI: ${pkg.license_uri}\n` +
` * Text Domain: ${pkg.name}\n` +
` * Tags: ${pkg.keywords}\n` +
` * Copyright: ${pkg.year} ${pkg.author}\n` +
' * This stylesheet is not used by this WordPress site it only exists as reference for WordPress. The stylesheet in use can be found in this folder as style.min.{hash}.css\n' +
'*/\n';

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
        .pipe(dest('dist/css'))
        .pipe(server.stream());
};

// Add banner
const addBanner = () => {
    return src('src/php/style.css')
        .pipe(banner(comment, {
            pkg
        }))
        .pipe(dest('dist/php'));
};

// Images
export const images = () => {
    return src('src/images/**/*.{jpg,jpeg,png,svg,gif}')
        .pipe(gulpif(PRODUCTION, imagemin()))
        .pipe(dest('dist/images'));
};

// Copy
export const copy = () => {
    return src('src/**/*.{php,mo,po,htaccess}')
        .pipe(dest('dist'));
};

// Copy production htaccess
export const copyHtaccessProduction = () => {
    return src('node_modules/apache-server-configs/dist/.htaccess')
        .pipe(dest('dist/config'));
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

// Bump version x.x.1
export const bumpPatch = () => {
    return src(['./package.json', './README.md'])
        .pipe(bumpVersion({
            type: 'patch'
        }))
        .pipe(dest('.'));
};

// Bump version x.1.x
export const bumpMinor = () => {
    return src(['./package.json', './README.md'])
        .pipe(bumpVersion({
            type: 'minor'
        }))
        .pipe(dest('.'));
};

// Bump version 1.x.x
export const bumpMajor = () => {
    return src(['./package.json', './README.md'])
        .pipe(bumpVersion({
            type: 'major'
        }))
        .pipe(dest('.'));
};

// Changelog
export const changelog = () => {
    return src('CHANGELOG.md', {
        buffer: true
    })
        .pipe(conventionalChangelog({
            preset: 'angular',
            outputUnreleased: true
        }))
        .pipe(dest('.'));
};

// Show hint
export const showHint = () => {
    return src('./package.json')
        .pipe(notify({
            'title': 'Push release!',
            'message': 'npm run addRelease',
            'wait': true
        }));
};

// Bump up project version
export const bumpPrompt = () => {
    const runPatch = series(bumpPatch, changelog, showHint);
    const runMinor = series(bumpMinor, changelog, showHint);
    const runMajor = series(bumpMajor, changelog, showHint);

    return src('./gulpfile.babel.js')
        .pipe(prompt.prompt({
            type: 'checkbox',
            name: 'bump',
            message: 'What type of bump would you like to do?',
            choices: ['patch', 'minor', 'major']
        }, function(res) {
            if (res.bump[0] == 'major') {
                runMajor();
            } else if (res.bump[0] == 'minor') {
                runMinor();
            } else {
                runPatch();
            }
        }));
};

// Generate ZIP
export const compress = () => {
    return src('dist/**/*')
        .pipe(gulpif(
            file => file.relative.split('.').pop() !== 'zip', replace('_themename', pkg.name)
        ))
        .pipe(zip(`${pkg.name}.zip`))
        .pipe(dest('./build'));
};

// Generate POT
export const makePot = () => {
    return src('src/**/*.php')
        .pipe(
            wpPot({
                domain: '_themename',
                package: pkg.name
            })
        )
        .pipe(dest(`src/languages/${pkg.name}.pot`));
};

// Watch
export const watchForChanges = () => {
    watch('src/scss/**/*.scss', styles);
    watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', series(images, reload));
    watch(['src/**/*', '!src/{images,js,scss}', '!src/{images,js,scss}/**/*'], series(copy, reload));
    watch('src/js/**/*.js', series(scripts, reload));
    watch('**/*.php', reload);
};

// Release to github
export const addRelease = () => {
    return run(`git add CHANGELOG.md README.md package.json && git commit --amend --no-edit && git tag v${pkg.version} -m "Version ${pkg.version}" && git push && git push --tags`).exec();
};

export const dev = series(clean, parallel(styles, images, copy, scripts), addBanner, serve, watchForChanges);
export const build = series(clean, parallel(styles, images, copy, scripts), addBanner, copyHtaccessProduction, compress);
export const bump = series(bumpPrompt);
export const hint = series(showHint);
export const release = series(addRelease);
export default dev;
