'use strict';
var MongoClient = require('mongodb').MongoClient;

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

    app.post('/api/v1/signup', function (req, res) {
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

                    if (requestedUser.following.indexOf(newFollower) <= 0) {

                        db.collection("users").update({_id: newFollower}, {$addToSet: {"follower": currentUser}}, function (err, updatedFollower) {
                            if (err) {
                                throw err;
                            }
                            console.log("Add user as following: ");
                            console.log(updatedFollower);

                            if (updatedFollower.result.nModified != 0) {

                                db.collection("users").update({_id: currentUser}, {$addToSet: {"following": newFollower}}, function (err, update) {
                                    if (err) {
                                        throw err;
                                    }
                                    console.log("Add user as follower: ");
                                    console.log(update);

                                });

                                res.send({message: currentUser + " successfully follow " + newFollower});
                            } else {
                                res.send({message: newFollower + "does not exist!"});
                            }
                        });
                    } else {
                        res.send({message: currentUser + " already follows " + newFollower});
                    }
                } else {
                    res.send({message: "No user found!"});
                }
            });
        });
    });

    app.post('/api/v1/podcasts/upload', app.locals.upload.single('podcast'), function (req, res) {
        console.log(req.file);
        console.log(req.body);

        res.send(200, "Podcast uploaded:");     // your JSON
        /*MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
            if (err) {
                throw err;
            }
            db.collection("podcasts").insert(req.body, function (err) {
                if (err) {
                    throw err;
                } else {
                    console.log("Podcast uploaded: ");
                    console.log(req.body);
                    res.send({"message": "Podcast uploaded"});    // echo the result back
                    db.close();
                }
            });
        });*/
    });
};
