# gulpwordpress version 0.1.0
<p align="center">
    <img height="150" src=".github/gulp.png">
    <img height="150" src=".github/wordpress.png">
</p>

Development environment with gulp and docker for developing and deploying WordPress themes.

[![GitHub commit](https://img.shields.io/github/last-commit/marcoris/gulpwordpress)](https://github.com/marcoris/gulpwordpress/commits/master) ![GitHub commit activity](https://img.shields.io/github/commit-activity/4w/marcoris/gulpwordpress) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/marcoris/gulpwordpress) ![GitHub issues](https://img.shields.io/github/issues/marcoris/gulpwordpress) ![GitHub pull requests](https://img.shields.io/github/issues-pr/marcoris/gulpwordpress) ![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/marcoris/gulpwordpress/master) ![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/marcoris/gulpwordpress) ![GitHub](https://img.shields.io/github/license/marcoris/gulpwordpress)

# Prerequirements
## Installs
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

## Hosting
- Add domain.com
- Add stage.domain.com
- Add live database
- Add stage database
- Add live@domain.com ftp account => /public_html
- Add stage@domain.com ftp account => /public_html/stage
Make shure you have all accounts unlocked and remote mysql access activated (just for connecting with sql-client)

## SSH
Create an SSH key:
```bash
ssh-keygen -b 4096
eval `ssh-agent -s`
ssh-add ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub | clip
```

<hr>

# Getting started
## Set up Repo
```bash
git clone https://github.com/marcoris/gulpwordpress.git {projectname}
git remote rename origin {projectname}
```

## Wipe out boilerplate and its complete history
Just cd into the project directory and remove the .git folder (`rm -rf .git`). However make sure you are in the correct folder when running the above command!

Next you can initialize a new repo by running:

```bash
git init
```

**Important!**
Make sure to adjust the version number and concrete project information in all relevant files (`package.json`, `README.md`) then run:
```bash
sh ./shells/installer.sh
```
to install all npm dependencies, setting up the devEnv, installing composer packages and running gulp.

>WordPress plugins have to be installed separately after the installer did his job.

# And then...
- Fill in all your necessary data into the generated `.env` file
- Run `gulp` to start de watchers and browserSync
- Happy coding

<hr>

# NPM Commands
| command | description |
|---------|-------------|
| `npm run updater` | Runs `npm update` and `npm audit fix` and `composer update` |
| `npm run start` | Runs `gulp` |
| `npm run build` | Runs `gulp build --prod` => ***This is not done yet*** |
| `npm run gettableprefix` | Shows the productive table prefix (if wp is installed) |
| `npm run gettableprefix stage` | Shows the staging table prefix (if wp is installed) |
| `npm run dbexport local` | Exports the local database -> sql/local.sql (local) |
| `npm run dbexport stage` | Exports the staging database -> sql/stage.sql (remotly) |
| `npm run dbexport prod` | Exports the production database -> sql/prod.sql (remotly) |
| `npm run dbimport local` | Imports the local database -> sql/local.sql (local) |
| `npm run dbimport stage` | Imports the staging database -> sql/stage.sql (remotly) |
| `npm run dbimport prod` | Imports the production database -> sql/prod.sql (remotly) |
| `npm run deploy stage` | Deploys the `Uploads and theme` or `wwwroot` directories on stage |
| `npm run deploy prod` | Deploys the `Uploads and theme` or `wwwroot` directories on production |
| `npm run importRemoteDB-prod` | Imports the production database into local |
| `npm run importRemoteDB-stage` | Imports the staging database into local |

<hr>

# Gulp Commands
| command | description |
|---------|-------------|
| gulp firstSetup | Seting up for development |
| gulp | Default gulp command |
| gulp dev | Default gulp command, runs cleaner, docs, makepot, serve and watchers |
| gulp build | Builds the theme in cleared directories |
| gulp buildZip | Builds the theme in cleared directories and zip it |
| gulp bump | Gives a bump version prompt to choose between patch, minor and major and adds the bumped files (`CHANGELOG.md`, `README.md`, `package.json`), commit them with a release message, add a tag and push it to github |
| gulp push | Pushes the local `themes`, `uploads` or `both` directories to remote |
| gulp pull | Pulls the remote `themes`, `uploads` or `both` directories to local |
| gulp makepot | Makes the *.pot file |
| gulp potomo | Compiles the pot file to the *.mo binary |
| gulp docs | Runs the nucleus styleguide building script |
| gulp shot | Generates the screenshot.png - Cheeeeese :smile: |
| gulp setupWPConfig | Sets the `wp-config.php` file for local use |
| gulp setupWPConfig --stage | Sets the `wp-config.php` file for staging use |
| gulp setupWPConfig --prod | Sets the `wp-config.php` file for production use |
| gulp deploy --stage | Deploys the `Uploads and theme` or `wwwroot` directories to the staging server |
| gulp deploy --prod | Deploys the `Uploads and theme` or `wwwroot` directories to the production server |
| gulp updateACFPro | Updates the ACF Pro plugin (ACF Pro version has to be set in the `.env` file) |
| gulp WPUpdate | Checks the installed WordPress version and if it is not up to date install automatically the newest version (new WordPress version has to be set in the `.env` file). ***This can take several minutes!*** |

<hr>

# The thing with the database :crystal_ball:
## Remote to local
To import the remote database into the local database run:
```bash
npm run importRemoteDB-prod
or
npm run importRemoteDB-stage
```

## Local to Remote
To import the local sqldump to the staging database run:
```bash
npm run dbexport local
gulp replaceDBStrings --local=stage
npm run dbimport stage
```
To import the local sqldump to the production database run:
```bash
npm run dbexport local
gulp replaceDBStrings --local=prod
npm run dbimport prod
```

<hr>

# And what's with the files? :file_folder:
## Remote to local
To download all needed remote files (it will ask you in a prompt what you want to download) run:
```bash
gulp pull
```

## Local to remote
To upload all needed files (it will ask you in a prompt what you want to upload) run:
```bash
gulp push
```

<hr>

# Updating WordPress
Set the new Versionnumber in the `.env` file under `WP_VERSION`. Then run `gulp WPUpdate`. This can take several minutes!

<hr>

# Translation :book:
First run the following command to make the *.pot file: `gulp makepot`. Then translate it with poedit and save the *.po file. After saving run `gulp potomo` to generate the binary file in the wwwroot directory.

<hr>

# Deploying :rocket:
- Run `npm run gettableprefix-prod` or `npm run gettableprefix-stage` if there is an installation to fill the table prefix in the `.env` file
- Run `npm run deploy stage` or `npm run depoly prod`
- Then you have to choose between `wwwroot` or `uploads and theme`

<hr>

#### TODOs :pencil:
* Issues can be created under: <a href="https://github.com/marcoris/gulpwordpress/issues" target="_blank">https://github.com/marcoris/gulpwordpress/issues</a>

#### Done :white_check_mark:
* Gulp task to deploy from local to staging or production (`uploads`, `theme`, `database`)
* Gulp task to get data from stage or production (both `uploads` dir and `sql dump` at the same time)
* Put gulp tasks (setup, version bump, release) in separate files to keep it clean
* Gulp task to push `uploads` directory from local to remote (staging or production)
* Gulp task to pull `uploads` directory from remote (staging or production) to local
* Gulp task to deploying the theme on staging or production
* Gulp task to update WordPress
* DB migrating script
* Remove the Vagrant stuff and add docker stuff

Made with :heart: in Switzerland.