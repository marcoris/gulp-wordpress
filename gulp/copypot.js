import {src, dest} from 'gulp';
import pkg from '../package.json';

// Copy
const copypot = () => {
    return src('src/**/*.pot')
        .pipe(dest(`wwwroot/wp-content/themes/${pkg.name}`));
};

module.exports = copypot;
