# gulp-wordpress version 0.0.7
<p align="center">
    <img height="150" src="gulp.png">
    <img height="150" src="wordpress.png">
</p>

Development environment with gulp and docker for developing WordPress themes.

## Prerequirements
### Installs
- Node.js: https://nodejs.org/en
- Docker Desktop: https://desktop.docker.com
- Composer: https://getcomposer.org/download

### Hosting
- Add stage.domain.com
- Add live database
- Add staging database
- Add live@domain.com ftp account => /public_html
- Add stage@domain.com ftp account => /public_html/stage
Make shure you have all accounts unlocked and remote mysql access activated (OR MAYBE NOT)

### SSH
Create an SSH connection:
```bash
ssh-keygen -o -a 256 -t ed25519 -f ~/.ssh/id_rsa -C "Call it whatever you want"
eval `ssh-agent -s`
ssh-agent -L
ssh-add ~/.ssh/id_rsa

cat ~/.ssh/id_rsa.pub | clip
```

## Getting started
- Run `sh installer.sh` to install all npm dependencies, setting up the devEnv, installing composer packages and running gulp.

## Daily developing commands
- Run `docker-compose up -d` to start the docker containers (if not already started)
- Run `gulp` to start de watchers and browserSync
- Run `docker-compose stop` to stop the docker containers

## NPM Commands
| command | description |
|---------|-------------|
| `npm run installer` | Runs `docker-compose up -d`, `npm install`, `gulp setup`, `composer self-update`, `composer install` and `gulp` |
| `npm run updater` | Runs `npm update` and `npm audit fix` and `composer update` |
| `npm run start` | Runs `gulp` |
| `npm run build` | Runs `gulp build --prod` => This has to be adjusted in the gulpfile |
| `npm run dbimport` | Runs `dbimport.sh` file for importing database ./sql/local.sql dump |
| `npm run importRemoteDB-prod` | Runs `sh ./shells/dbmigration.sh prod && gulp getSql --prod && gulp replaceLocal --prod && sh ./shells/dbimport.sh` to generate db dump on remote productive and get db dump to local and import it |
| `npm run importRemoteDB-stage` | Runs `sh ./shells/dbmigration.sh stage && gulp getSql --stage && gulp replaceLocal --stage && sh ./shells/dbimport.sh` to generate db dump on remote staging and get db dump to local and import it |

## Gulp Commands
| command | description |
|---------|-------------|
| gulp    | Default gulp command |
| gulp setup | Runs the setup tasks (setting .env and composer.json) |
| gulp dev | Default gulp command, runs cleaner, docs, makepot, serve and watchers |
| gulp build | Clens direcory, run styles, images, copy, scripts, addBanner copyplugins, copyHtaccessProduction, generates nucleus styleguide docs |
| gulp buildZip | Cleans directory, run styles, images, copy, scripts, addBanner, and zipt the project for ulpoad |
| gulp bump | Gives a bump version prompt to choose between patch, minor and major |
| gulp release | Adds the bumped files, commit them with a release message, add a tag and push it to github |
| gulp dbimport | Runs the `dbimport.sh` script. A *.sql.gz file from wordpress plugin db migrations has to be in the sql directory |
| gulp docs | Runs the nucleus styleguide building script |
| gulp translate | Compiles .po to .mo file |
| gulp WPUpdate | Checks the installed WordPress version and if it is not up to date install automatically the newest version. This can take several minutes! |
| gulp pull | Pulls the remote `uploads` directory to local |
| gulp push | Pushes the local `uploads` directory to remote |
| gulp updateACFPro | Updates the ACF Pro plugin (ACF Pro version has to be set in `.env` file) |

## DB migration
On the wordpress site go to Tools > Migrate DB. Fill in the required fields like: `https://hostname.ch -> http://localhost:8080` and export it (e.x. live2local). Just put the exported database dump file (*.gz) into the `sql` folder and run `npm run dbimport`.

## Updating WordPress
Set the new Versionnumber in the `.env` file under `NEW_WP_VERSION`. Then run `gulp WPUpdate`. This can take several minutes!

## Translation
First run the following command to make the *.pot file: `gulp makepot`. Then translate it with poedit and save the *.po file. After saving run `gulp potomo` to generate the binary file in the wwwroot directory.

## TODOs
* Gulp task to deploy from local to staging or production (`uploads`, `theme`, `database`)
* Gulp task to get data from stage or production (both `uploads` dir and `sql dump` at the same time)
* WP-Translations

### Done
* Put gulp tasks (setup, version bump, release) in separate files to keep it clean
* Gulp task to push `uploads` directory from local to remote (staging or production)
* Gulp task to pull `uploads` directory from remote (staging or production) to local
* Gulp task to deploying the theme on staging or production
* Gulp task to update WordPress
* DB migrating script
* Remove the Vagrant stuff and add docker stuff
