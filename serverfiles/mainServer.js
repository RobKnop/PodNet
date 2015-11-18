'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var app = express();

// create application/json parser
var jsonParser = bodyParser.json();

app.get('/', function (req, res) {
    res.send('Hello World! Podcast are the best thing on earth!');
});

app.get('/api/v1/robknop', function (req, res) {
    res.send({
        username : "robknop",
        firstname : "Robert",
        lastname : "Knop",
        followers : ["username1", "username2"],
        following : ["username1", "username2"],
        publishedPodcasts : ["podcast1_id", "podcast2_id"],
        subscriptionList : ["topic1", "topic2"]
    });
});

app.post('/api/v1/signup', jsonParser, function(req, res){
    if (!req.body) return res.sendStatus(400);
    console.log(req.body);      // your JSON
    MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
        if (err) {
            throw err;
        }
        console.log("Connection to database successful");
        db.collection("users").insert(req.body);
        db.close();
    });

    res.send(req.body);    // echo the result back

});

var server = app.listen(8080, function () {
    var host = "54.183.248.71"; //Public IP of EC2 instance
    var port = server.address().port; //Give permission in AWS security group

    console.log('Example app listening at http://%s:%s', host, port);
});


