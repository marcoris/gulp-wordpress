import {src, dest} from 'gulp';

// Copy
const copytranslations = () => {
    return src('src/languages/*.{po,mo}')
        .pipe(dest('wwwroot/wp-content/languages/themes'));
};

module.exports = copytranslations;
