import {src, dest} from 'gulp';
import gulpif from 'gulp-if';
import imagemin from 'gulp-imagemin';
import pkg from '../package.json';
import yargs from 'yargs';
import del from 'del';

const DEPLOYING = yargs.argv.prod | yargs.argv.stage;

// Images
const images = () => {
    // Cleanup directory
    del(`./wwwroot/wp-content/themes/${pkg.name}/assets/images/**/*`);

    // Minimize the images
    return src('./src/images/**/*.{jpg,jpeg,png,svg,gif}')
        .pipe(gulpif(DEPLOYING, imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 65, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ], {
            verbose: true
        })))
        .pipe(dest(`./wwwroot/wp-content/themes/${pkg.name}/assets/images`));
};

module.exports = images;
