var express = require('express');
var app = express();

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

var server = app.listen(8080, function () {
    var host = "54.183.248.71"; //Public IP of EC2 instance
    var port = server.address().port; //Give permission in AWS security group

    console.log('Example app listening at http://%s:%s', host, port);
});


