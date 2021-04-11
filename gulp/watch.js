import {series, watch} from 'gulp';
import browserSync from 'browser-sync';
import styles from './styles';
import scripts from './scripts';
import images from './images';
import copyphp from './copyphp';

const server = browserSync.create();
const reload = done => {
    server.reload();
    done();
};

// Watch
const watchForChanges = () => {
    watch('src/scss/**/*.scss', series(styles, reload));
    watch('src/js/**/*.js', series(scripts, reload));
    watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', series(images));
    watch('src/php/**/*.php', series(copyphp, reload));
};

module.exports = watchForChanges;
