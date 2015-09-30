# PodNet
##Podcast Network
by Andrew Zhang, Robert Knop
- class group project @ CSULB

###Objectives
The application connects Podcast Producer and Podcast Consumer in a social networking way.
The network bases like Twitter on the "Follower Principle". 
Consumer can recommend podcast chapters, episodes to his follower. 
Additional consumer can interact with the Podcast Producer to give feedback, make suggestions.

Podcast Producer can upload his own podcast and share with his listeners.

##User stories

1. User can sign up for an account
2. User can upload own podcasts
3. User can follow other Users
3. User can search for uploades podcast
4. User can search for other users
5. User can write a post to share podcasts with followers
6. Each User have their own profile with timeline
7. Each User has a podcast feed, depending on whom they follow
8. User can like/fav podcasts

##All Software Components and Services

###Back End Compenents for MVP

#### User account (Object)
1. Real name
2. unique network name
3. image (?)
4. followers
5. following
6. own podcast

###Front End Mobile App Components for MVP

####UI-Views (Website)
1. Landing page<br />
  a. Sign in<br />
 	&nbsp;&nbsp;&nbsp;i. Email/password<br />
  &nbsp;&nbsp;&nbsp;ii. Automatic sign in (Checkbox)<br />
  b. Sign up<br />
  &nbsp;&nbsp;&nbsp;i. User registers for an account with screen name, email, password, and photo<br />
2. Activity Feed - Shows all the recent activity (mostly posts) of the accounts that they are following.
3. New Post - Allows user to share podcasts
4. Search - Searches archive for posts/podcasts
5. Follower list (all podcast form people you are following, kind of subcription list)
6. Profile<br />
  a. Image (?)
  b. real name Name
  c. unique network name
  d. own podast
  e. who he self follow (Number)
  f. adding opiton to own follower list
  g. number of followers
  h. who is followin him (?)
  i. Location (?)
  j. own website (?)
  functionality:
  a. Able to edit what the user's profile looks like (with preview?)<br />
  b. Able to edit previous posts(?)<br />
7. Upload Podcast
8. Add new follower/podcast with recommanditon for exploring new podcaster

####UI-Elements
1. Menu (Located and can be accessed by almost all pages)<br />
  a. Activity feed
  b. Follower list
  c. Upload Podcast<br />
  d. Profile<br />
2. Navigation Bar on top (Located and can be accessed by almost all pages) <br />
  a. Links to other pages: New Post, Search, Add new Follower<br />

####Podcast episode (Object)
has following attributes

1. Title
2. Image
2. Topic and Content description
3. Link to Podcast (actuall file)
  a. Linked to podcast in our database
  b. Linked to podcast through url
4. Date
5. Author
6. Meta data (Length, size, created)
7. Tags (?)

####Post (Object)
Posts cotain a podcast episode with a own iniatl comment from the PostWriter
Posts have the following functionality

1. Like
2. Favorite (safe in Listening Later list)
3. Comment(?)
4. Share/Retweet(?)
