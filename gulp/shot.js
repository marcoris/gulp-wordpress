var webshot = require('webshot');
require('dotenv').config();

const shot = (done) => {
    webshot(`${process.env.LOCAL_URL}`, `./wwwroot/wp-content/themes/${process.env.DOCKER_NAME}/screenshot.png`, function(err) {
        if (err) {
            console.log(err);
        }
    });

    done();
};

module.exports = shot;
