import {src, dest} from 'gulp';

// Copy
const copyhtaccess = () => {
    return src('config/.htaccess')
        .pipe(dest('wwwroot'));
};

module.exports = copyhtaccess;
