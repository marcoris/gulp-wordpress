import {src, dest} from 'gulp';

// Copy glugins
const plugins = () => {
    return src('src/plugins/**/*')
        .pipe(dest('wwwroot/wp-content/plugins'));
};

module.exports = plugins;
