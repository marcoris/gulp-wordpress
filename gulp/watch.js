import {series, watch} from 'gulp';
import browserSync from 'browser-sync';
import styles from './styles';
import scripts from './scripts';
import images from './images';
import copyphp from './copyphp';
import copyplugins from './copyplugins';
import copytranslations from './copytranslations';
import copypot from './copypot';

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
    watch(['src/plugins/**/*', '!src/plugins/**/*.md'], series(copyplugins, reload));
    watch('src/**/*.pot', series(copypot, reload));
    watch('src/languages/*.{po,mo}', series(copytranslations, reload));
};

module.exports = watchForChanges;
