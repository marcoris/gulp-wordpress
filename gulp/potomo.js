import run from 'gulp-run';
import pkg from '../package.json';
import fs from 'fs';

// Compile po to mo
const potomo = () => {
    if (fs.existsSync(`src/languages/${pkg.name}.po`)) {
        return run(`msgfmt -o wwwroot/wp-content/languages/themes/${pkg.name}-de_CH_informal.mo src/languages/${pkg.name}.po`).exec();
    }

    return run(`echo file under src/languages/${pkg.name}.po not existing!`).exec();
};

module.exports = potomo;
