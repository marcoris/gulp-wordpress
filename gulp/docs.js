import run from 'gulp-run';

// Build nucleus docs
const docs = () => {
    return run('nucleus --files ./src/scss/**/*.scss --target ./wwwroot/styleguide --template=./config/nucleus/').exec();
};

module.exports = docs;
