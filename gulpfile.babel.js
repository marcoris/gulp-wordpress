// Gulp plugins
import {src, dest, watch, series, parallel} from 'gulp';
import babel from 'gulp-babel';
import banner from 'gulp-banner';
import bumpVersion from 'gulp-bump';
import concat from 'gulp-concat';
import cleanCss from 'gulp-clean-css';
import conventionalChangelog from 'gulp-conventional-changelog';
import eslint from 'gulp-eslint';
import gulpif from 'gulp-if';
import imagemin from 'gulp-imagemin';
import notify from 'gulp-notify';
import postcss from 'gulp-postcss';
import prompt from 'gulp-prompt';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import run from 'gulp-run';
import sass from 'gulp-sass';
import sassLint from 'gulp-sass-lint';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import wpPot from 'gulp-wp-pot';
import zip from 'gulp-zip';

// Other plugins
import Rsync from 'rsync';
import pkg from './package.json';
import autoprefixer from 'autoprefixer';
import del from 'del';
import browserSync from 'browser-sync';
import yargs from 'yargs';
import fs from 'fs';

// Configs
const PRODUCTION = yargs.argv.prod;
const server = browserSync.create();
require('dotenv').config();
const dist = `wwwroot/wp-content/themes/${pkg.name}`,
    root = 'src',
    wwwroot = 'wwwroot',
    buildDir = 'build';

// Browsersync
const serve = done => {
    server.init({
        proxy: 'http://localhost:8080',
        files: [`${root}/scss/**/*.scss`, `${root}/js/**/*.js`]
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
export const clean = () => del([dist, buildDir]);

// Clean all
export const cleanall = () => del([dist, buildDir, wwwroot]);

// Run vagrant up and install its dependencies to work with WordPress
const setupEnvironment = () => {
    src(`${root}/config/config.nucleus.json`)
        .pipe(replace('@@themename', pkg.name))
        .pipe(dest('.'));
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
                    name: 'hostinguser',
                    message: 'Hostinguser?',
                    default: pkg.name
                },
                {
                    type: 'input',
                    name: 'wpversion',
                    message: 'WordPress version?',
                    default: '5.3.2'
                },
                {
                    type: 'input',
                    name: 'acfversion',
                    message: 'ACF Pro version?',
                    default: '5.6.7'
                },
                {
                    type: 'input',
                    name: 'acfpro',
                    message: 'ACF Pro key?',
                    default: ''
                }], function(res) {
                    //value is in res.first and res.second
                    return src('.env')
                        .pipe(replace('hostinguser', res.hostinguser))
                        .pipe(replace('hosting', res.hosting))
                        .pipe(replace('acfpro', res.acfpro))
                        .pipe(replace('acfversion', res.acfversion))
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
    var keys = fs.readFileSync('keys.php', 'utf-8');

    return src(`${root}/config/wp-config.php`)
        .pipe(prompt.prompt({
            type: 'checkbox',
            name: 'config',
            message: 'Setup for?',
            choices: ['local', 'staging', 'production']
        }, function(res) {
            if (res.config[0] == 'staging') {
                src(`${root}/config/wp-config.php`)
                    .pipe(replace('@@db_name', process.env.STAGE_DB_NAME))
                    .pipe(replace('@@db_user', process.env.STAGE_DB_USER))
                    .pipe(replace('@@db_pass', process.env.STAGE_DB_PASS))
                    .pipe(replace('@@db_host', process.env.STAGE_DB_HOST))
                    .pipe(replace('@@db_prefix', process.env.DB_PREFIX))
                    .pipe(replace('@@wp_debug', process.env.STAGE_WP_DEBUG))
                    .pipe(replace('@@save_queries', process.env.STAGE_SAVEQUERIES))
                    .pipe(replace('@@disallow_file_mods', process.env.STAGE_DISALLOW_FILE_MODS))
                    .pipe(replace('@@wp_allow_multisite', process.env.STAGE_WP_ALLOW_MULTISITE))
                    .pipe(replace('@@include', keys))
                    .pipe(dest(wwwroot));
            } else if (res.config[0] == 'production') {
                src(`${root}/config/wp-config.php`)
                    .pipe(replace('@@db_name', process.env.PRODUCTION_DB_NAME))
                    .pipe(replace('@@db_user', process.env.PRODUCTION_DB_USER))
                    .pipe(replace('@@db_pass', process.env.PRODUCTION_DB_PASS))
                    .pipe(replace('@@db_host', process.env.PRODUCTION_DB_HOST))
                    .pipe(replace('@@db_prefix', process.env.DB_PREFIX))
                    .pipe(replace('@@wp_debug', process.env.PRODUCTION_WP_DEBUG))
                    .pipe(replace('@@save_queries', process.env.PRODUCTION_SAVEQUERIES))
                    .pipe(replace('@@disallow_file_mods', process.env.PRODUCTION_DISALLOW_FILE_MODS))
                    .pipe(replace('@@wp_allow_multisite', process.env.PRODUCTION_WP_ALLOW_MULTISITE))
                    .pipe(replace('@@include', keys))
                    .pipe(dest(wwwroot));
            } else {
                src(`${root}/config/wp-config.php`)
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
                    .pipe(dest(wwwroot));
            }
        }));
};

// Create composer.json with acf pro key to download wordpress plugins
const setComposerfile = () => {
    return src('composer_template.json')
        .pipe(replace('@@acf_version', process.env.ACF_VERSION))
        .pipe(replace('@@acf_pro_key', process.env.ACF_PRO_KEY))
        .pipe(rename('composer.json'))
        .pipe(dest('.'));
};

// Styles
export const styles = () => {
    return src(`${root}/scss/style.scss`)
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
        .pipe(dest(`${dist}/assets/css`))
        .pipe(server.stream());
};

// Add banner
const addBanner = () => {
    return src(`${root}/config/style.css`)
        .pipe(banner(comment, {
            pkg
        }))
        .pipe(dest(dist));
};

// Images
export const images = () => {
    return src(`${root}/images/**/*.{jpg,jpeg,png,svg,gif}`)
        .pipe(gulpif(PRODUCTION, imagemin()))
        .pipe(dest(`${dist}/assets/images`));
};

// Copy
export const copy = () => {
    return src(`${root}/**/*.{mo,po,htaccess}`)
        .pipe(dest(dist));
};

const copyphp = () => {
    return src(`${root}/php/**/*.php`)
        .pipe(dest(dist));
};

const copyLanguage = () => {
    return src(`${root}/languages/*.{mo,po}`)
        .pipe(dest(dist));
};

// Copy production htaccess
const copyHtaccessProduction = () => {
    return src('node_modules/apache-server-configs/dist/.htaccess')
        .pipe(dest(wwwroot));
};

// Copy glugins
export const copyplugins = () => {
    return src(`${root}/plugins/**/*`)
        .pipe(dest(`${wwwroot}/wp-content/plugins`));
};

// Scripts
export const scripts = () => {
    return src(`${root}/js/**/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(concat('main.min.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulpif(PRODUCTION, uglify()))
        .pipe(dest(`${dist}/assets/js`));
};

// Bump version x.x.1
const bumpPatch = () => {
    return src(['./package.json', './README.md'])
        .pipe(bumpVersion({
            type: 'patch'
        }))
        .pipe(dest('.'));
};

// Bump version x.1.x
const bumpMinor = () => {
    return src(['./package.json', './README.md'])
        .pipe(bumpVersion({
            type: 'minor'
        }))
        .pipe(dest('.'));
};

// Bump version 1.x.x
const bumpMajor = () => {
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
        .pipe(dest(buildDir));
};

// Generate POT
export const makepot = () => {
    return src(`${root}/php/**/*.php`)
        .pipe(
            wpPot({
                domain: 'gulpwordpress',
                package: pkg.name
            })
        )
        .pipe(dest(`${root}/languages/${pkg.name}.pot`));
};

// Rename textdomain in all php files
export const renameTextdomain = () => {
    return src(`${root}/php/**/*.php`)
        .pipe(replace('gulpwordpress', pkg.name))
        .pipe(dest(dist));
};

// Watch
export const watchForChanges = () => {
    watch(`${root}/scss/**/*.scss`, series(styles, reload));
    watch(`${root}/js/**/*.js`, series(scripts, reload));
    watch(`${root}/images/**/*.{jpg,jpeg,png,svg,gif}`, series(images));
    watch(`${root}/php/**/*.php`, series(copyphp, reload));
};

// Release to github
const addRelease = () => {
    return run(`git add CHANGELOG.md README.md package.json && git commit --amend --no-edit && git tag v${pkg.version} -m "Version ${pkg.version}" && git push && git push --tags`).exec();
};

// Build nucleus docs
export const docs = () => {
    return run(`nucleus --files ./${root}/scss/**/*.scss --target ./${wwwroot}/styleguide --template=${root}/config/nucleus/`).exec();
};

// Import database dump
export const dbimport = () => {
    return run('npm run dbimport').exec();
}

// Compile po to mo
export const translate = () => {
    return run(`msgfmt -o wwwroot/wp-content/languages/themes/${pkg.name}-de_CH_informal.mo src/languages/${pkg.name}.po`).exec();
}

// Get images from live server
const rsyncget = (done) => {
    // rsync -avu --delete --progress ${pkg.url}@ssh.ENTER_SERVER_NAME_HERE.com:/wp-content/uploads ./wwwroot/wp-content/uploads
    done();
}

export const rsyncpush = (done) => {
    var rsync = new Rsync()
        .shell('ssh')
        .flags('azv')
        .set('progress')
        .source('./wwwroot/wp-content/themes/ENTER_THEME_NAME_HERE')
        .destination('ENTER_USER_NAME_HERE@ssh.ENTER_SERVER_NAME_HERE.comserver:/public_htm');
    
    // Execute the command
    rsync.execute(function(error, code, cmd) {
        // we're done
        done();
    });
    // return gulpSSH
    // .exec(['uptime', 'ls -a', 'pwd'], {filePath: 'commands.log'})
    // .pipe(dest('logs'))
    // rsync [optionen] quelle ziel
    // rsync -avu --delete --progress  ./wwwroot/wp-content/themes/${pkg.name} ${pkg.url}@ssh.ENTER_SERVER_NAME_HERE.com:/wp-content/themes/${pkg.name}
    // rsync -avn quelle ziel (simulation)
    // https://www.shellbefehle.de/befehle/rsync/
    // https://www.npmjs.com/package/remote-sync
    // https://stackoverflow.com/questions/49708424/nodejs-gulp-download-files-from-sftp
}

export const setup = series(setupEnvironment, setConfig, setComposerfile);
export const dev = series(clean, parallel(styles, images, copy, copyphp, scripts), addBanner, copyplugins, docs, renameTextdomain, makepot, serve, watchForChanges);
export const build = series(clean, parallel(styles, images, copy, copyphp, scripts), addBanner, copyplugins, copyHtaccessProduction, docs, renameTextdomain, makepot);
export const buildzip = series(clean, parallel(styles, images, copy, copyphp, scripts), addBanner, copyHtaccessProduction, renameTextdomain, makepot, compress);
export const bump = bumpPrompt;
export const release = addRelease;
export const getimages = rsyncget;
export const pushfiles = rsyncpush;
export default dev;
