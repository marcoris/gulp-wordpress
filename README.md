# gulp-wordpress version 0.0.7
<p align="center">
    <img height="150" src="gulp.png">
    <img height="150" src="wordpress.png">
</p>

Development environment with gulp and docker for developing WordPress themes.

## Prerequirements
- Installation of Node.js: https://nodejs.org/en
- Install docker desktop: https://desktop.docker.com
- Install composer: https://getcomposer.org/download

### Hosting
- Add stage.domain.com
- Add live database
- Add staging database
- Add live@domain.com ftp account
- Add stage@domain.com ftp account
Make shure you have all accounts unlocked and remote mysql access activated

## Getting started
- run `sh installer.sh` or `npm run installer`

## Daily developing commands
- run `docker-compose up -d` to start the docker containers (if not already started)
- run `gulp` to start de watchers and browserSync
- run `docker-compose stop` to stop the docker containers

## NPM Commands
| command | description |
|---------|-------------|
| `npm run installer` | Runs `docker-compose up -d`, `npm install`, `gulp setup`, `composer self-update`, `composer install` and `gulp` |
| `npm run updater` | Runs `npm update` and `composer update` |
| `npm run dbimport` | Runs `dbimport.sh` file for importing database dump |

## Gulp Commands
| command | description |
|---------|-------------|
| gulp    | Default gulp command |
| gulp dev | Default gulp command, runs cleaner, docs, makepot, serve and watchers |
| gulp build | Clens direcory, run styles, images, copy, scripts, addBanner copyplugins, copyHtaccessProduction, generates nucleus styleguide docs |
| gulp buildZip | Cleans directory, run styles, images, copy, scripts, addBanner, and zipt the project for ulpoad |
| gulp bump | Gives a bump version prompt to choose between patch, minor and major |
| gulp release | Adds the bumped files, commit them with a release message and push them to github |
| gulp dbimport | Runs the db import script. ().sql.gz file from wordpress plugin db migrations has to be in the sql directory |
| gulp docs | Runs the nucleus styleguide building script |
| gulp translate | Compiles .po to .mo file |
| gulp WPUpdate | Checks the installed WordPress version and if it is not up to date install automatically the newest version. This can take several minutes! |
| gulp pushfiles | *This function is not yet defined* |
| gulp pushfiles | *This function is not yet defined* |

## DB migration
On the wordpress site go to Tools > Migrate DB. Fill in the required fields like: `https://hostname.ch -> http://localhost:8080` and export it (e.x. live2local). Just put the exported database dump file (*.gz) into the `sql` folder and run `npm run dbimport`.

## Updating WordPress
Set the new Versionnumber in the `.env` file under `NEW_WP_VERSION`. Then run `gulp WPUpdate`. This can take several minutes!

## Translation
First run the following command to make the *.pot file: `gulp makepot`. Then translate it with poedit and save the *.po file. After saving run `gulp potomo` to generate the binary file in the wwwroot directory.

## TODOs
* Put gulp tasks (setup, version bump, release) in separate files to keep it clean
* Gulp task to get data from stage or production (both `uploads` dir and `sql dump` at the same time)
* WP-Translations

### Done
* Gulp task to push `uploads` directory from local to remote (staging or production)
* Gulp task to pull `uploads` directory from remote (staging or production) to local
* Gulp task to deploying the theme on staging or production
* Gulp task to update WordPress
* DB migrating script
* Remove the Vagrant stuff and add docker stuff
