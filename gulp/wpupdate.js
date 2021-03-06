import run from 'gulp-run';

require('dotenv').config();

// Checks WP version
const WPUpdate = () => {
    return run(`sh ./shells/wp-version-check.sh ${process.env.WP_VERSION} wwwroot/wp-includes/version.php ${process.env.WP_LOCALE} ${process.env.DOCKER_NAME}`).exec();
};

module.exports = WPUpdate;
