import run from 'gulp-run';
import pkg from '../package.json';

// Release to github
const githubrelease = () => {
    return run(`sh release.sh ${pkg.version}`).exec();
};

module.exports = githubrelease;
