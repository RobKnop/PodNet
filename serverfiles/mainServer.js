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

app.get('/api/v1/users/:id', function (req, res) {
    MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
        if (err) {
            throw err;
        }
        db.collection("users").findOne({"_id": req.params.id}, function (err, requestedUser) {
            if (err) {
                throw err;
            }
            console.log("GET user: ");
            console.log(requestedUser);
            res.send(requestedUser);
            db.close();
        });
    });
});

app.get('/api/v1/users', function (req, res) {
    MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
        if (err) {
            throw err;
        }
        db.collection("users").find().limit(100).toArray(function (err, allUsers) {
            if (err) {
                throw err;
            }
            console.log("GET all users: ");
            console.log(allUsers);
            res.send(allUsers);
            db.close();
        });
    });
});

app.post('/api/v1/signup', jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    console.log("POST user: ");
    req.body.createdOn = new Date();
    console.log(req.body);      // your JSON
    MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
        if (err) {
            throw err;
        }
        db.collection("users").insert(req.body, function (err) {
            if (err) {
                console.log("ERROR: " + err.message);
                res.send({"message": "ERROR: User already exists!"});
                //throw err;
            } else {
                console.log("POST user: ");
                console.log(req.body);
                res.send({"message": "User added"});    // echo the result back
                db.close();
            }
        });

    });

});

var server = app.listen(8080, function () {
    var host = "54.183.235.161"; //Public IP of EC2 instance
    var port = server.address().port; //Give permission in AWS security group

    console.log('Example app listening at http://%s:%s', host, port);
});