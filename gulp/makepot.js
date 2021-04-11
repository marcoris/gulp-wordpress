import {src, dest} from 'gulp';
import wpPot from 'gulp-wp-pot';
import pkg from '../package.json';

// Generate POT
const makepot = () => {
    return src('src/php/**/*.php')
        .pipe(
            wpPot({
                domain: pkg.name,
                package: pkg.name
            })
        )
        .pipe(dest(`src/languages/${pkg.name}.pot`));
};

module.exports = makepot;
