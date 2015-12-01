'use strict';
var bodyParser = require('body-parser');
var multer  = require('multer');

module.exports = function (app) {
    // create application/json parser
    app.use(bodyParser.json({limit: 16000000}));


    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '/home/ubuntu/PodNet/uploads')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    });
    app.locals.upload = multer({storage: storage });
};