// Gulp plugins
import {src, dest, watch, series, parallel} from 'gulp';
import banner from 'gulp-banner';
import bumpVersion from 'gulp-bump';
import cleanCss from 'gulp-clean-css';
import conventionalChangelog from 'gulp-conventional-changelog';
import gulpif from 'gulp-if';
import imagemin from 'gulp-imagemin';
import notify from 'gulp-notify';
import postcss from 'gulp-postcss';
import prompt from 'gulp-prompt';
import replace from 'gulp-replace';
import run from 'gulp-run';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import wpPot from 'gulp-wp-pot';
import zip from 'gulp-zip';

// Other plugins
import pkg from './package.json';
import autoprefixer from 'autoprefixer';
import del from 'del';
import named from 'vinyl-named';
import browserSync from 'browser-sync';
import webpack from 'webpack-stream';
import yargs from 'yargs';
import fs from 'fs';

// Configs
const PRODUCTION = yargs.argv.prod;
const server = browserSync.create();
require('dotenv').config();
const dist = `wwwroot/wp-content/themes/${pkg.name}`;

// Browsersync
const serve = done => {
    server.init({
        proxy: 'http://localhost',
        port: '8080'
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
export const clean = () => del([dist, 'build']);

// Clean all
export const cleanall = () => del([dist, 'build', 'wwwroot']);

// Run vagrant up and install its dependencies to work with WordPress
const setupEnvironment = () => {
    if (fs.existsSync('.env_template')) {
        if (!fs.existsSync('.env')) {
            return src('.env_template')
                .pipe(run('cp .env_template .env'))
                .pipe(prompt.prompt([{
                    type: 'input',
                    name: 'hosting',
                    message: 'Hostname: 1ahosting?',
                    default: '1ahosting'
                },
                {
                    type: 'input',
                    name: 'user',
                    message: 'Hostinguser?',
                    default: 'risdesign'
                },
                {
                    type: 'input',
                    name: 'wpversion',
                    message: 'WordPress version?',
                    default: '5.3.2'
                },
                {
                    type: 'input',
                    name: 'acf',
                    message: 'ACF Pro key?',
                    default: ''
                }], function(res) {
                    //value is in res.first and res.second
                    return src('.env')
                        .pipe(replace('hostinguser', res.user))
                        .pipe(replace('hosting', res.hosting))
                        .pipe(replace('acfpro', res.acf))
                        .pipe(replace('wpversion', res.wpversion))
                        .pipe(dest('.'));
                }));
        }

        return src('.env')
            .pipe(run('echo .env already exists'));
    }

    return src('.env')
        .pipe(run('echo .env_template does not exist!'));
};

// Sets the configuration
const setConfig = () => {
    var cmd = new run.Command('sh getKeys.sh');
    cmd.exec();
    var keys = '';
    keys = fs.readFileSync('keys.php', 'utf-8');

    return src('src/config/wp-config.php')
        .pipe(replace('@@db_name', process.env.LOCAL_DB_NAME))
        .pipe(replace('@@db_user', process.env.LOCAL_DB_USER))
        .pipe(replace('@@db_pass', process.env.LOCAL_DB_PASS))
        .pipe(replace('@@db_host', process.env.LOCAL_DB_HOST))
        .pipe(replace('@@db_prefix', process.env.DB_PREFIX))
        .pipe(replace('@@wp_debug', process.env.LOCAL_WP_DEBUG))
        .pipe(replace('@@save_queries', process.env.LOCAL_SAVEQUERIES))
        .pipe(replace('@@disallow_file_mods', process.env.LOCAL_DISALLOW_FILE_MODS))
        .pipe(replace('@@wp_allow_multisite', process.env.LOCAL_WP_ALLOW_MULTISITE))
        .pipe(replace('@@include', keys))
        .pipe(dest('./wwwroot/'));
};

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
        .pipe(dest(dist + '/assets/css'))
        .pipe(server.stream());
};

// Add banner
const addBanner = () => {
    return src('src/php/style.css')
        .pipe(banner(comment, {
            pkg
        }))
        .pipe(dest(dist));
};

// Images
export const images = () => {
    return src('src/images/**/*.{jpg,jpeg,png,svg,gif}')
        .pipe(gulpif(PRODUCTION, imagemin()))
        .pipe(dest(dist + '/assets/images'));
};

// Copy
export const copy = () => {
    return src('src/**/*.{mo,po,htaccess}')
        .pipe(dest(dist));
};

const copyphp = () => {
    return src('src/php/**/*.php')
        .pipe(dest(dist));
};

// Copy production htaccess
export const copyHtaccessProduction = () => {
    return src('node_modules/apache-server-configs/dist/.htaccess')
        .pipe(dest('wwwroot'));
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
        .pipe(dest(dist + '/assets/js'));
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
    return src(dist)
        .pipe(gulpif(
            file => file.relative.split('.').pop() !== 'zip', replace('_themename', pkg.name)
        ))
        .pipe(zip(`${pkg.name}.zip`))
        .pipe(dest('./build'));
};

// Generate POT
export const makepot = () => {
    return src('src/php/**/*.php')
        .pipe(
            wpPot({
                domain: '_themename',
                package: pkg.name
            })
        )
        .pipe(dest(`${dist}/languages/${pkg.name}.pot`));
};

// Watch
export const watchForChanges = () => {
    watch('src/scss/**/*.scss', styles);
    watch('src/js/**/*.js', series(scripts, reload));
    watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', series(images, reload));
    watch('src/php/**/*.php', series(copyphp));
};

// Release to github
export const addRelease = () => {
    return run(`git add CHANGELOG.md README.md package.json && git commit --amend --no-edit && git tag v${pkg.version} -m "Version ${pkg.version}" && git push && git push --tags`).exec();
};

export const setup = series(setupEnvironment, setConfig);
export const dev = series(clean, parallel(styles, images, copy, copyphp, scripts), addBanner, serve, watchForChanges);
export const build = series(clean, parallel(styles, images, copy, copyphp, scripts), addBanner, copyHtaccessProduction);
export const buildzip = series(clean, parallel(styles, images, copy, copyphp, scripts), addBanner, copyHtaccessProduction, compress);
export const bump = series(bumpPrompt);
export const hint = series(showHint);
export const release = series(addRelease);
export default dev;
