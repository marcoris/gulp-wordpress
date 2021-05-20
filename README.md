# gulpwordpress version 0.0.8
<p align="center">
    <img height="150" src="gulp.png">
    <img height="150" src="wordpress.png">
</p>

Development environment with gulp and docker for developing WordPress themes.

## Prerequirements
### Installs
Node.js: <a href="https://nodejs.org/en" target="_blank">https://nodejs.org/en</a>
```
$ node -v
v10.16.3
```

Docker Desktop: <a href="https://www.docker.com/products/docker-desktop" target="_blank">https://www.docker.com/products/docker-desktop</a>
```
$ docker -v
Docker version 20.10.6, build 370c289
```
Composer: <a href="https://getcomposer.org/download" target="_blank">https://getcomposer.org/download</a>
```
$ composer -v
Composer version 2.0.13 2021-04-27 13:11:08
```

### Hosting
- Add stage.domain.com
- Add live database
- Add staging database
- Add live@domain.com ftp account => /public_html
- Add stage@domain.com ftp account => /public_html/stage
Make shure you have all accounts unlocked and remote mysql access activated (for connecting with sql-client)

### SSH
Create an SSH connection:
```bash
ssh-keygen -b 4096
eval `ssh-agent -s`
ssh-add ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub | clip
```

<hr>

## Getting started
- Run `sh installer.sh` to install all npm dependencies, setting up the devEnv, installing composer packages and running gulp.

>WordPress plugins have to be installed separately after the installer did his job.

## And then...
- Fill in all your necessary data into the generated `.env` file
- Run `docker-compose up -d` to start the docker containers (if not already started)
- Run `gulp setupFirst` to set up the devenvironment
- Run `gulp` to start de watchers and browserSync (happy coding)
- Run `docker-compose stop` to stop the docker containers

<hr>

## NPM Commands
| command | description |
|---------|-------------|
| `npm run updater` | Runs `npm update` and `npm audit fix` and `composer update` |
| `npm run start` | Runs `gulp` |
| `npm run build` | Runs `gulp build --prod` => This has to be adjusted in the gulpfile |
| `npm run importRemoteDB-prod` | Runs `sh ./shells/dbmigration.sh prod && gulp getSql --prod && gulp replaceDB --prod && sh ./shells/dbimport.sh` to generate db dump on remote productive and get db dump to local and import it |
| `npm run importRemoteDB-stage` | Runs `sh ./shells/dbmigration.sh stage && gulp getSql --stage && gulp replaceDB --stage && sh ./shells/dbimport.sh` to generate db dump on remote staging and get db dump to local and import it |

<hr>

## Gulp Commands
| command | description |
|---------|-------------|
| gulp setupFirst | Seting up for development |
| gulp | Default gulp command |
| gulp dev | Default gulp command, runs cleaner, docs, makepot, serve and watchers |
| gulp build | Builds the theme in cleared directories |
| gulp buildZip | Builds the theme in cleared directories and zip it |
| gulp bump | Gives a bump version prompt to choose between patch, minor and major |
| gulp githubrelease | Adds the bumped files (`CHANGELOG.md`, `README.md`, `package.json`), commit them with a release message, add a tag and push it to github |
| gulp WPUpdate | Checks the installed WordPress version and if it is not up to date install automatically the newest version. This can take several minutes! |
| gulp push | Pushes the local `themes`, `uploads` or `both` directories to remote |
| gulp pull | Pulls the remote `themes`, `uploads` or `both` directories to local |
| gulp makepot | Makes the *.pot file |
| gulp potomo | Compiles the pot file to the *.mo binary |
| gulp docs | Runs the nucleus styleguide building script |
| gulp shot | Generates the screenshot.png - Cheeeeese |
| gulp setup -- | Sets the `wp-config.php` file (--local, --stage, --prod) |
| gulp deploy | Deploys the theme to the remote server |
| gulp updateACFPro | Updates the ACF Pro plugin (ACF Pro version has to be set in `.env` file) |

<hr>
## The thing with the database :crystal_ball:
To import the remote database into the local database run:
```bash
npm run importRemoteDB-prod
or
npm run importRemoteDB-stage
```

## And what's with the files? :file_folder:
To download all needed remote files (it will ask you in a prompt what you want to download) run:
```bash
gulp pull
```

## Updating WordPress :arrow_up:
Set the new Versionnumber in the `.env` file under `WP_VERSION`. Then run `gulp WPUpdate`. This can take several minutes!

## Translation :book:
First run the following command to make the *.pot file: `gulp makepot`. Then translate it with poedit and save the *.po file. After saving run `gulp potomo` to generate the binary file in the wwwroot directory.

## Deploying :rocket:
xxx

## TODOs :pencil:
* Gulp task to deploy from local to staging or production (`uploads`, `theme`, `database`)
* Gulp task to get data from stage or production (both `uploads` dir and `sql dump` at the same time)
* Correct WP-Translations (*.mo *.po)

### Done :white_check_mark:
* Put gulp tasks (setup, version bump, release) in separate files to keep it clean
* Gulp task to push `uploads` directory from local to remote (staging or production)
* Gulp task to pull `uploads` directory from remote (staging or production) to local
* Gulp task to deploying the theme on staging or production
* Gulp task to update WordPress
* DB migrating script
* Remove the Vagrant stuff and add docker stuff

Made with :heart: in Switzerland.