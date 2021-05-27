#!/bin/bash
if [ "$1" == "prod" ]
then
	gulp setup --prod && cp ./node_modules/apache-server-configs/dist/.htaccess ./wwwroot && sh ./shells/dbexport.sh local && gulp replaceDBStrings --local=prod && gulp images --prod && gulp scripts --prod && gulp styles --prod && gulp deploy --prod && sh ./shells/dbimport.sh prod
elif [ "$1" == "stage" ]
then
	gulp setup --stage && cp ./node_modules/apache-server-configs/dist/.htaccess ./wwwroot && sh ./shells/dbexport.sh local && gulp replaceDBStrings --local=stage && gulp images --stage && gulp scripts --stage && gulp styles --stage && gulp deploy --stage && sh ./shells/dbimport.sh stage
else
	echo "You have to pass at least one parameter!"
	echo "npm run deploy stage"
	echo "npm run deploy prod"
fi
