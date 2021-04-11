import {src, dest} from 'gulp';
import pkg from '../package.json';

const copyphp = () => {
    return src('src/php/**/*.php')
        .pipe(dest(`wwwroot/wp-content/themes/${pkg.name}`));
};

module.exports = copyphp;
