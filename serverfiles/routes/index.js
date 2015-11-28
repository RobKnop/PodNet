'use strict';
var MongoClient = require('mongodb').MongoClient;

// create application/json parser
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

module.exports = function (app) {

    app.get('/api/v1/users/:id', function (req, res) {
        MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
            if (err) {
                throw err;
            }
            db.collection("users").findOne({"_id": req.params.id}, function (err, requestedUser) {
                if (err) {
                    throw err;
                }
                if (requestedUser) {
                    console.log("GET user: ");
                    console.log(requestedUser);
                    res.send(requestedUser);
                } else {
                    res.send({message: "No user found!"});
                }
                db.close();
            });
        });
    });

    app.get('/api/v1/users/search/:query', function (req, res) {
        MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
            if (err) {
                throw err;
            }
            db.collection("users").find({
                $or: [
                    {_id: req.params.query},
                    {firstName: req.params.query},
                    {lastName: req.params.query}
                ]
            }).limit(20).toArray(function (err, requestedUsers) {
                if (err) {
                    throw err;
                }
                if (requestedUsers.length <= 0) {
                    res.send({message: "No user found!"});
                } else {
                    console.log("Search result: ");
                    console.log(requestedUsers);
                    res.send(requestedUsers);
                }
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

    app.get('/api/v1/addfollower', function (req, res) {
        MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
            if (err) {
                throw err;
            }
            var currentUser = req.param('current');
            var newFollower = req.param('newFollower');

            db.collection("users").findOne({"_id": currentUser}, function (err, requestedUser) {
                if (err) {
                    throw err;
                }
                console.log(requestedUser);
                if (requestedUser) {

                    db.collection("users").update( {_id : currentUser}, { $addToSet: { "following": newFollower }} ,function (err, updatedFollower) {
                        if (err) {
                            throw err;
                        }
                        console.log("Add user as follower: ");
                        console.log(updatedFollower);

                    });
                    db.collection("users").update( {_id : newFollower}, { $addToSet: { "follower": currentUser }} ,function (err, updatedFollower) {
                        if (err) {
                            throw err;
                        }
                        console.log("Add user as following: ");
                        console.log(updatedFollower);

                    });
                    res.send({message: currentUser + " successfully follow " + newFollower});

                } else {
                    res.send({message: "No user found!"});
                }
            });
        });
    });
};
