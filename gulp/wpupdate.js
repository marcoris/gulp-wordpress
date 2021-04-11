import run from 'gulp-run';

// Checks WP version
const WPUpdate = () => {
    return run(`sh wp-version-check.sh ${process.env.NEW_WP_VERSION} wwwroot/wp-includes/version.php ${process.env.WP_LOCALE} ${process.env.DOCKER_NAME}`).exec();
};

module.exports = WPUpdate;
