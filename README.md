# gulp-wordpress version 0.0.6
<p align="center">
    <img height="150" src="gulp.png">
    <img height="150" src="wordpress.png">
</p>

Development environment with gulp and docker for developing WordPress themes.

## Prerequirements
>Create a new repository on github.

Make a file called `createproject.sh` with the content above:

```
#!/bin/bash
echo -n "Enter new project name: "
read -e projectname

if [ -z "$projectname" ]
then
    echo "You must enter a project name..."
    exit 1
else
    # Clone gulp wordpress repo
    git clone https://github.com/marcoris/gulp-wordpress.git $projectname
    cd $projectname
    # Remove origin to make it independent
    git remote rm origin
    git remote add origin https://github.com/marcoris/$projectname.git
    # Delete README.md and CHANGELOG.md
    rm README.md
    rm CHANGELOG.md
    # Create new README.md and CHANGELOG.md
    touch README.md
    touch CHANGELOG.md
    # Delete local tags.
    git tag -d $(git tag -l)
    # Fetch remote tags.
    git fetch
    # Delete remote tags.
    git push origin --delete $(git tag -l)
    # Delete local tags.
    git tag -d $(git tag -l)
    # Reset commits
    git checkout --orphan temp_branch
    git add -A
    git commit -am "Initial commit"
    git branch -D master
    git branch -m master
    git push -f -u origin master
    code .
fi
```

## Getting started
- cd into the directory of that file
- run `sh createproject.sh`
- enter your new WordPress theme project name
- cd into your new WordPress theme project directory
- install docker desktop
  - Windows (https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe)
  - Mac (https://desktop.docker.com/mac/stable/Docker.dmg)
- run `sh installer.sh`


## Daily developing commands
- run `docker-compose up -d` to start the docker containers
- run `gulp` to start de watchers and browser
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
On the wordpress site go to Tools > Migrate DB. Fill in the required fields like: `https://hostname.ch -> http://localhost:8080` and export it. Copy the exported database dump file (*.gz) into the `sql` folder and run `npm run dbimport`.

## Updating WordPress
Set the new Versionnumber in the `.env` file under `NEW_WP_VERSION`. Then run `gulp WPUpdate`. This can take several minutes!

## Translation
First run the following command to make the *.pot file: `gulp makepot`. Then translate it with poedit and save the *.po file. After saving run `gulp potomo` to generate the binary file in the wwwroot directory.

## TODOs
* Add rsync functionality for pushing and pulling files
* Put gulp tasks in separate files to keep it clean

### Done
* Gulp task to update WordPress
* DB migrating script
* Remove the Vagrant stuff and add docker stuff
