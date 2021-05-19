import {src, dest} from 'gulp';
import rename from 'gulp-rename';
import replace from 'gulp-replace';

require('dotenv').config();

// Create composer.json with acf pro key to download wordpress plugins
const setComposerfile = () => {
    return src('composer_template.json')
        .pipe(replace('@@acf_version', process.env.ACF_VERSION))
        .pipe(replace('@@acf_pro_key', process.env.ACF_PRO_KEY))
        .pipe(rename('composer.json'))
        .pipe(dest('.'));
};

module.exports = setComposerfile;
