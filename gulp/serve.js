import browserSync from 'browser-sync';

const server = browserSync.create();

// Browsersync
const serve = done => {
    server.init({
        proxy: 'http://localhost:8080',
        files: ['src/scss/**/*.scss', 'src/js/**/*.js']
    });
    done();
};

module.exports = serve;
