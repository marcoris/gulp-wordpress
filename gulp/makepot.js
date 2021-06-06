import {src, dest} from 'gulp';
import replace from 'gulp-replace';
import wpPot from 'gulp-wp-pot';
import pkg from '../package.json';

// Generate POT
const makepot = () => {
    src('src/php/**/*.php')
        .pipe(replace('gulpwordpress', pkg.name))
        .pipe(dest('src/php'));

    return src('src/php/**/*.php')
        .pipe(
            wpPot({
                domain: 'gulpwordpress',
                package: pkg.name
            })
        )
        .pipe(dest(`src/languages/${pkg.name}.pot`));
};

module.exports = makepot;
