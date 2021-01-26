# gulp-wordpress version 0.0.5
<p align="center">
    <img height="150" src="gulp.png">
    <img height="150" src="wordpress.png">
</p>

Development environment with gulp, vagrant and virtualbox for developing WordPress themes.

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
- run `npm install`
- run `npm run installer`
- run `vagrant up`
    - This installs an ubuntu on a VirtualBox and all needed packages for an apache and a SQL webserver
- run `gulp setup`
- fill in all necessary data
- run `gulp`
- happy coding

## NPM Commands
| command | description |
|---------|-------------|
| run installer | Runs `vagrant up`, `npm install`, `gulp setup` and `composer install` |
| run updater | Runs `npm update` and `composer update` |
| run dbimport | Runs dbimport.sh file |

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
| gulp getimages | *This function is not yet defined* |
| gulp pushfiles | *This function is not yet defined* |

## TODOs
* Remove the Vagrant stuff and add docker stuff
* Add rsync functionality for pushing and pulling data

### Done
* DB migrating script
