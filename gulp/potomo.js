import run from 'gulp-run';
import pkg from '../package.json';
import fs from 'fs';

// Compile po to mo
const potomo = () => {
    if (fs.existsSync('src/languages/de_CH.po')) {
        if (!fs.existsSync(`wwwroot/wp-content/themes/${pkg.name}/languages`)) {
            fs.mkdirSync(`wwwroot/wp-content/themes/${pkg.name}/languages`);
        }

        return run(`msgfmt -o wwwroot/wp-content/themes/${pkg.name}/languages/de_CH.mo src/languages/de_CH.po`).exec();
    }

    return run('echo file under src/languages/de_CH.po not existing!').exec();
};

module.exports = potomo;
