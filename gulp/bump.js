import {src, dest, series} from 'gulp';
import bumpVersion from 'gulp-bump';
import conventionalChangelog from 'gulp-conventional-changelog';
import prompt from 'gulp-prompt';
import run from 'gulp-run';
import pkg from '../package.json';

var semver = require('semver');

// Bump version x.x.1
const bumpPatch = () => {
    return src(['./package.json', './README.md'])
        .pipe(bumpVersion())
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
const changelog = () => {
    return src('CHANGELOG.md', {
        buffer: true
    })
        .pipe(conventionalChangelog({
            preset: 'angular',
            outputUnreleased: true
        }))
        .pipe(dest('.'));
};

// Github release patch
const githubreleasePatch = (done) => {
    // increment version
    var newVer = semver.inc(pkg.version, 'patch');
    run(`sh ./shells/githubrelease.sh ${newVer}`).exec();

    done();
};

// Github release patch
const githubreleaseMinor = (done) => {
    // increment version
    var newVer = semver.inc(pkg.version, 'minor');
    run(`sh ./shells/githubrelease.sh ${newVer}`).exec();

    done();
};

// Github release major
const githubreleaseMajor = (done) => {
    // increment version
    var newVer = semver.inc(pkg.version, 'major');
    run(`sh ./shells/githubrelease.sh ${newVer}`).exec();

    done();
};

// Bump up project version
const bumpPrompt = () => {
    const runPatch = series(bumpPatch, changelog, githubreleasePatch);
    const runMinor = series(bumpMinor, changelog, githubreleaseMinor);
    const runMajor = series(bumpMajor, changelog, githubreleaseMajor);

    return src('./gulpfile.babel.js')
        .pipe(prompt.prompt({
            type: 'list',
            name: 'bump',
            message: `Bumping v${pkg.version} up`,
            choices: ['patch', 'minor', 'major']
        }, function(res) {
            if (res.bump == 'major') {
                runMajor();
            } else if (res.bump == 'minor') {
                runMinor();
            } else {
                runPatch();
            }
        }));
};

module.exports = bumpPrompt;
