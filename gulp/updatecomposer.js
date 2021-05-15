import run from 'gulp-run';

const composerUpdate = () => {
    return run('composer update').exec();
};

module.exports = composerUpdate;
