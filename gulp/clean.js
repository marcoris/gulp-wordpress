import del from 'del';
import pkg from '../package.json';

// Clean
const clean = () => del(`wwwroot/wp-content/themes/${pkg.name}/**/*`);

module.exports = clean;
