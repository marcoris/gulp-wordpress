import {src, dest} from 'gulp';

// Copy glugins
const copyplugins = () => {
    return src('src/plugins/**/*')
        .pipe(dest('wwwroot/wp-content/plugins'));
};

module.exports = copyplugins;
