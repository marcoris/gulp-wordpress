import del from 'del';
import pkg from '../package.json';

// Clean
const cleanall = () => del([`wwwroot/wp-content/themes/${pkg.name}/**/*`, 'build']);

module.exports = cleanall;
