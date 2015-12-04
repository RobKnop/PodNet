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

    app.get('/api/v1/podcasts/search/:query', function (req, res) {
        MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
            if (err) {
                throw err;
            }
            db.collection("podcasts").find({
                $or: [
                    {title: req.params.query},
                    {topic: req.params.query},
                    {fileName: req.params.query},
                    {owner: req.params.query}
                ]
            }).limit(20).toArray(function (err, requestedPodcast) {
                if (err) {
                    throw err;
                }
                if (requestedPodcast.length <= 0) {
                    res.send({message: "No Podcast episode found!"});
                } else {
                    console.log("Search result: ");
                    console.log(requestedPodcast);
                    res.send(requestedPodcast);
                }
                db.close();
            });
        });
    });
    app.get('/api/v1/podcasts/series/:query', function (req, res) {
        MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
            if (err) {
                throw err;
            }
            db.collection("podcasts").find({
                $or: [
                    {topic: req.params.query}
                ]
            }).limit(50).toArray(function (err, requestedSeries) {
                if (err) {
                    throw err;
                }
                if (requestedSeries.length <= 0) {
                    res.send({message: "No Podcast series found!"});
                } else {
                    console.log("Series array send: ");
                    console.log(requestedSeries);
                    res.send(requestedSeries);
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

                    if (requestedUser.following.indexOf(newFollower) < 0) {

                        db.collection("users").update({_id: newFollower}, {$addToSet: {"followers": currentUser}}, function (err, updatedFollower) {
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
        //noinspection JSUnresolvedVariable
        console.log(req.file);
        console.log(req.body);

        //noinspection JSUnresolvedVariable
        var podJson = {
            "title": req.body.title,
            "topic": req.body.topic,
            "fileName": req.file.filename,
            "path": req.file.path,
            "description": req.body.description,
            "uploadedON": new Date(),
            "owner": req.body.owner,
            "metaData": {
                "size": req.file.size,
                "mimetype": req.file.mimetype
            }
        };
        MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
            if (err) {
                throw err;
            }
            db.collection("podcasts").insert(podJson, function (err) {
                if (err) {
                    throw err;
                } else {
                    console.log("Podcast uploaded: ");
                    console.log(podJson);
                    res.send("Podcast successfully uploaded");
                    db.close();
                }
            });
        });
        MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
            db.collection("users").update({_id: podJson.owner}, {$addToSet: {"publishedPodcasts": podJson.topic}}, function (err) {
                if (err) {
                    throw err;
                }
                console.log("Add podcast " + podJson.topic + " to publishedPodcasts of " + podJson.owner);
            })
        });
    });

    app.get('/api/v1/podcasts/:id', function (req, res) {

        MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
            if (err) {
                throw err;
            }

            var ObjectID = require('mongodb').ObjectID;
            var o_id = new ObjectID(req.params.id);

            db.collection("podcasts").findOne({_id: o_id}, function (err, requestedUser) {
                if (err) {
                    throw err;
                }
                if (requestedUser) {
                    console.log("GET single podcast: ");
                    console.log(requestedUser);


                    res.download(requestedUser.path);
                } else {
                    res.send({message: "No podcast found!"});
                }
                db.close();
            });
        });
    });

    app.get('/api/v1/posts/:id', function (req, res) {

        MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
            if (err) {
                throw err;
            }

            var ObjectID = require('mongodb').ObjectID;
            var o_id = new ObjectID(req.params.id);

            db.collection("posts").findOne({_id: o_id}, function (err, requestedUser) {
                if (err) {
                    throw err;
                }
                if (requestedUser) {
                    console.log("GET single post: ");
                    console.log(requestedUser);


                    res.send(requestedUser);
                } else {
                    res.send({message: "No post found!"});
                }
                db.close();
            });
        });
    });

    app.post('/api/v1/posts/creation', function (req, res) {
        if (!req.body) return res.sendStatus(400);
        console.log("User posted: ");
        req.body.createdOn = new Date();
        console.log(req.body);      // your JSON
        MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
            if (err) {
                throw err;
            }
            db.collection("posts").insert(req.body, function (err, insertedPost) {
                if (err) {
                    console.log("ERROR: " + err.message);
                    res.send(err.message);
                    //throw err;
                } else {
                    console.log(insertedPost);
                    db.collection("users").update(
                        {following: {$in: [req.body.author]}}, //
                        {$addToSet: {"newsfeed": insertedPost.ops[0]}},
                        function (err) {
                            if (err) {
                                console.log("ERROR: " + err.message);
                                res.send(err.message);
                                //throw err;
                            } else {
                                console.log("Newsfeed of followers updated");
                                db.collection("users").update(
                                    {_id:  req.body.author}, //
                                    {$addToSet: {"publishedPosts": insertedPost.ops[0]}},
                                    function (err) {
                                        if (err) {
                                            console.log("ERROR: " + err.message);
                                            res.send(err.message);
                                            //throw err;
                                        } else {
                                            res.send({message: "Post successfully published"});
                                            console.log("publishedPost array of author updated");
                                            db.close();

                                        }
                                    });
                            }
                        });
                }
            });
        });
    });
};
