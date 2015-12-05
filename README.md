# PodNet
##Podcast Network
by Andrew Zhang, Robert Knop <br />
working in a class group project @ CSULB

###Objectives
PodNet is a social network, where user can upload own podcast to share them with their followers. Uploading own podcasts is optional.
The network bases like Twitter on the "Follower Principle". User can recommend podcast series, podcast episodes by creating posts. A post includes the actual podcast file and comment. Every follower receives this post in his newsfeed and can immediately start listening to the recommended podcast episode.<br />
The problem, which the current podcast community has, is that the users consume it in podcast catcher, which is providing a list based structure. Podcast listener only listens to a self subscribed podcast list. <br />
If you wish to share the podcast, you have to post the link in your social network. This post may receive your desired target audience in a mixed newsfeed with post from other friends, pictures and news. Friends who are not interested in podcasts also may see your post.
PodNet gives their users a place to share their podcasts with their desired audience with 100% guaranteed organic reach. There are not any mix-ups with non-podcast related content. The newsfeed makes it easier to explore new podcasts, because every post is a recommendation of a friend. That’s why you can expect a certain quality.<br />

Technical Implementation:<br />
To deliver a reasonable performance with scalability in PodNet is powered by an Express.Js server with a MongoDB NoSQL database as the backend. Clients are Android and iOS smart phones running the social network application, which is developed with the Ionic framework. In this client-server architecture, the clients use the RESTful API provided by the Express.Js application. The documentation of the RESTful API is located in this Readme.md. <br />

##User stories

1. User can sign up for an account
2. User can upload own podcasts
3. User can follow other Users
4. User can search for uploaded podcast
5. User can search for other users
6. User can write a post to share podcasts with followers
7. Each User have their own profile with timeline
8. Each User has a podcast feed, depending on whom they follow
9. User can like/fav podcasts

##All Software Components and Services

###Back End Components for MVP

#### User account (Object)
1. Real name
2. unique network name
3. image (? as a placeholder first)
4. followers
5. following
6. own podcast (self published)
7. newsfeed (other podcast in the community)
8. own created posts


####Podcast episode (Object)
has following attributes

1. Title
2. Image (?)
3. Topic (name of the podcast series)
4. Content description
5. Link to Podcast (actual file)
6. Date
7. Author
8. Meta data (Length, size, created)
9. Tags (?)

####Post (Object)
Posts contain a podcast episode with a own initial comment from the PostWriter. <br />
Podcast episode will be select form the PostWriters own library (subscription list and self published ones) <br />
Posts have the following functionality:

1. podcast object
3. Like
4. Favorite (?) (safe in Listening Later list)
5. Comment
6. Share/Retweet(?)

##RESTful API definition

####Defintion JSON-Object "User": </br>
```
{
"_id" : "robknop",
"firstName" : "Robert",
"lastName" : "Knop",
"followers" : ["username1", "username2"],
"following" : ["username1", "username2"],
"publishedPodcasts" : [podcast1_id, podcast2_id],
"publishedPosts" : [ post_id ],
"newsfeed" : [post_id1, post_id2],
"signedUpOn" : Date
}
```
####SignUp: </br>
Post Userdata for SignUp only:</br>
POST http://localhost:8080/api/v1/signup </br>
Response: ```{"message": "User added"} ``` </br>
Duplicated: ``` {"message": "ERROR: User already exists!"} ``` </br>

####Get Userdata of one user:</br>
GET http://localhost:8080/api/v1/users/username</br>
No User found: ``` {message: "No user found!"} ``` </br>

####Search for User</br>
GET http://localhost:8080/api/v1/users</br>
Response: Array with all users, limited of 20 items</br>
```
[  
   {  
      "_id":"robknop",
      "firstName":"Robert",
      "lastName":"Knop",
      "followers":[  
         "username1",
         "username2"
      ],
      "following":[  
         "username1",
         "username2"
      ],
      "publishedPodcasts":[  
         "podcast1_id",
         "podcast2_id"
      ],
      "neesfeed":[  
         "Post_id",
         "Post_id2"
      ]
   },
   {  
      "_id":"maxmustermann",
      "firstName":"Max",
      "lastName":"Mustermann",
      "followers":[  
         "username1",
         "username2"
      ],
      "following":[  
         "username1",
         "username2"
      ],
      "publishedPodcasts":[  
         "podcast1_id",
         "podcast2_id"
      ],
      "neesfeed":[  
         "Post_id",
         "Post_id2"
      ]
   }
] 
```
</br>

####Search for User by username or first and last name </br>
GET http://localhost:8080/api/v1/users/search/query </br>
Response: Array with all matched users (same syntax like "Search for User") </br>
No User found: ```{message: "No user found!"} ```</br>

####Follow new user (by username)  </br>
GET  http://localhost:8080/api/v1/addfollower?current=robknop&newFollower=andrew </br>
Response: ``` {"message":"robknop successfully follow Andrew2"} ``` </br>
If already added: ```{message: currentUser + " already follows " + newFollower}``` </br>
If user not exist, whom want to follow: ``` {message: newFollower + "does not exist!"}  ```</br>

####Defintion JSON-Object "Podcast": </br>
```
{
"_id" : Object(25a2345bf324re34c342),
"title" : "The Pitch 5: New Story - w/Brad Field",
"topic" : "The Pitch",
"fileName" : "thepitch005.mp3",
"path" : "home/ubuntu/Podcast/uploads/thepitch005.mp3",
"description" : "Startups pitche their ideas",
"uploadedON" : Date,
"owner" : "robknop",
"metaData" : {
"duration" : 3000
}
} 
``` 
</br>
####Definition Client-Request for Uploading Podcast: </br>
```
<form action="localhost:8080/api/v1/podcasts/upload" method="post" enctype="multipart/form-data">
<label>
<p>title</p>
<input name="title" type="text"/>
</label>
<label>
<p>topic</p>
<input name="topic" type="text"/>
</label>
<label>
<p>description</p>
<input name="description" type="text"/>
</label>
<label>
<p>owner</p>
<input name="owner" type="text"/>
</label>
<br/>
<input type="file" name='podcast' placeholder="Select file"/>
<br/>
<button>Upload</button>
</form>
```
####Search for Podcast by title, topic, filename or owner</br>
GET http://localhost:8080/api/v1/podcasts/search/query</br>
Response: Array with all podcast episodes, limited of 50 items</br>
No Podcast episode found: ```{message: "No Podcast found!"}```</br>
Attention: The json comes without the raw mp3 file</br>
```
[  
   {  
      "_id":"565e9f8324367a56064aa26d",
      "title":"The Pith 234",
      "topic":"Pitch",
      "fileName":"Apieu (1).mp3",
      "path":"/home/ubuntu/PodNet/uploads/Apieu (1).mp3",
      "description":"asflaksfjlk",
      "uploadedON":"2015-12-02T07:36:35.231Z",
      "owner":"robknop",
      "metaData":{  
         "size":12955,
         "mimetype":"audio/mpeg"
      }
   },
   {  
      "_id":"565e9fe842cbdca806987d84",
      "title":"The Pith 234",
      "topic":"Pitch",
      "fileName":"Apieu (1).mp3",
      "path":"/home/ubuntu/PodNet/uploads/Apieu (1).mp3",
      "description":"asflaksfjlk",
      "uploadedON":"2015-12-02T07:38:16.505Z",
      "owner":"robknop",
      "metaData":{  
         "size":12955,
         "mimetype":"audio/mpeg"
      }
   },
   {  
      "_id":"565ea00542cbdca806987d85",
      "title":"The Pith 234",
      "topic":"Pitch",
      "fileName":"Apieu (1).mp3",
      "path":"/home/ubuntu/PodNet/uploads/Apieu (1).mp3",
      "description":"asflaksfjlk",
      "uploadedON":"2015-12-02T07:38:45.096Z",
      "owner":"robknop",
      "metaData":{  
         "size":12955,
         "mimetype":"audio/mpeg"
      }
   }
]
```

####Get request for receiving all podcast episodes for a podcast series </br>
GET http://localhost:8080/api/v1/podcasts/series/seriesname </br>
Response: Array with all podcasts episodes </br>
No Podcast series found: ```{message: "No Podcast series found!"}``` </br>
Attention: The json comes without the raw mp3 file </br>
```
[  
   {  
      "_id":"565e9f8324367a56064aa26d",
      "title":"The Pith 234",
      "topic":"Pitch",
      "fileName":"Apieu (1).mp3",
      "path":"/home/ubuntu/PodNet/uploads/Apieu (1).mp3",
      "description":"asflaksfjlk",
      "uploadedON":"2015-12-02T07:36:35.231Z",
      "owner":"robknop",
      "metaData":{  
         "size":12955,
         "mimetype":"audio/mpeg"
      }
   }
]
```
####Search for Podcast by title, topic, filename or owner </br>
GET http://localhost:8080/api/v1/podcasts/id </br>
Response: raw file of podcast </br>

####Download podcast file </br>
_id is requirerd! </br>
GET http://localhost:8080/api/v1/podcasts/565d4998b8b0a97d501730 </br>
Response: raw mp3 file </br>

####Defintion JSON-Object "Post request": </br>
```
{
"author" : "robknop",
"comment" : "highly recommended",
"podcast" : {
PODCASTOBJECT
},
"likes" : 2
}
```
#####Stored in the database:  </br>
```
{
"_id" : ObjectId("5660a24550538dd0709927c8"),
"author" : "robknop",
"comment" : "highly recommended",
"podcast" : {

},
"likes" : 2,
"createdOn" : ISODate("2015-12-03T20:12:53.488Z")
}
```
####Create Post: </br>
POST http://localhost:8080/api/v1/posts/creation </br>
Request Body: </br> 
```
{
"author" : "robknop",
"comment" : "highly recommended",
"podcast" : {
PODCASTOBJECT
},
"likes" : 2
}
```
Result: add post to user.newsfeed of followers, add post to user.publishedPost of author </br>
Response: ```{message: "Post successfully published"}``` </br>

####Get post json </br>
_id is requirerd! </br>
GET http://localhost:8080/api/v1//api/v1/posts/784r8z873245sdf
Response: Post-json-object </br>
