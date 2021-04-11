import run from 'gulp-run';

// Import database dump
const dbimport = () => {
    return run('sh dbimport.sh').exec();
};

module.exports = dbimport;
