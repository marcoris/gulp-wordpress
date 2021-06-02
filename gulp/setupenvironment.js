import {src, dest} from 'gulp';
import prompt from 'gulp-prompt';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import run from 'gulp-run';

import pkg from '../package.json';
import fs from 'fs';

// Set nucleus styleguide config and .env file
const setupEnvironment = () => {
    var cwdp = process.cwd();
    var cwd = cwdp.split('\\');
    if (cwd.length > 0) {
        cwd = cwd[cwd.length - 1];
    }

    src('./config/nucleus_template.json')
        .pipe(replace('@@themename', pkg.name))
        .pipe(rename('config.nucleus.json'))
        .pipe(dest('.'));

    if (fs.existsSync('./config/.env_template')) {
        if (!fs.existsSync('.env')) {
            return src('./config/.env_template')
                .pipe(run('cp ./config/.env_template .env'))
                .pipe(prompt.prompt([{
                    type: 'input',
                    name: 'hostinguser',
                    message: 'Hostinguser?',
                    default: `${pkg.name}.com`
                },
                {
                    type: 'input',
                    name: 'sshhost',
                    message: 'SSH Host?',
                    default: 'ssh.stackcp.com'
                },
                {
                    type: 'input',
                    name: 'dbhost',
                    message: 'DB Host?',
                    default: 'mysql.stackcp.com'
                },
                {
                    type: 'input',
                    name: 'wpversion',
                    message: 'WordPress version?',
                    default: '5.7.2'
                },
                {
                    type: 'input',
                    name: 'locale',
                    message: 'WordPress locale?',
                    default: 'de_CH'
                },
                {
                    type: 'input',
                    name: 'dockername',
                    message: 'Dockername?',
                    default: cwd
                },
                {
                    type: 'input',
                    name: 'acfversion',
                    message: 'ACF Pro version?',
                    default: '5.9.5'
                },
                {
                    type: 'input',
                    name: 'acfpro',
                    message: 'ACF Pro key?',
                    default: ''
                }], function(res) {
                    //value is in res.name
                    src('.env')
                        .pipe(replace('hostinguser', res.hostinguser))
                        .pipe(replace('sshhost', res.sshhost))
                        .pipe(replace('dbhost', res.dbhost))
                        .pipe(replace('wpversion', res.wpversion))
                        .pipe(replace('locale', res.locale))
                        .pipe(replace('dockername', res.dockername))
                        .pipe(replace('acfversion', res.acfversion))
                        .pipe(replace('acfpro', res.acfpro))
                        .pipe(dest('.'));
                }));
        }

        return src('.env')
            .pipe(run('echo .env already exists'));
    }

    return src('.env')
        .pipe(run('echo ./config/.env_template does not exist!'));
};

module.exports = setupEnvironment;
