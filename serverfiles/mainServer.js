'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes');
var app = express();
routes(app);

app.get('/', function (req, res) {
    res.send('Hello World! Podcast are the best thing on earth!');
});

var server = app.listen(8080, function () {
    var host = "54.183.235.161"; //Public IP of EC2 instance
    var port = server.address().port; //Give permission in AWS security group

    console.log('Example app listening at http://%s:%s', host, port);
});