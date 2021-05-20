var webshot = require('webshot');
require('dotenv').config();

const options = {
    screenSize: {
        width: 1200,
        height: 900
    },
    shotSize: {
        width: 1200,
        height: 900
    }
};

const shot = (done) => {
    webshot(`${process.env.LOCAL_URL}`, `./wwwroot/wp-content/themes/${process.env.DOCKER_NAME}/screenshot.png`, options, function(err) {
        if (err) {
            console.log(err);
        }
    });

    done();
};

module.exports = shot;
