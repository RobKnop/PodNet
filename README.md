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
5. User can share podcasts with followers
6. Each User have their own profile with timeline
7. Each User has a podcast feed, depending on whom they follow
8. User can like/fav podcasts

##All Software Components and Services

###Front End Mobile App Components

####Pages
1. Landing page<br />
  a. Sign in<br />
 	&nbsp;&nbsp;&nbsp;i. Email/password<br />
  &nbsp;&nbsp;&nbsp;ii. Automatic sign in<br />
  b. Sign up<br />
  &nbsp;&nbsp;&nbsp;i. User registers for an account with screen name, email, password, and photo(?)<br />
2. Menu (Located and can be accessed by almost all pages)<br />
  a. Upload Podcast<br />
  b. Profile<br />
  c. Settings<br />
3. Navigation Bar (Located and can be accessed by almost all pages) <br />
  a. Links to other pages: Activity Feed, New Post, Search<br />
4. Activity Feed - Shows all the recent activity (mostly posts) of the accounts that they are following.
5. New Post - Allows user to share podcasts
6. Search - Searches archive for posts/podcasts
7. Profile<br />
  a. Able to edit what the user's profile looks like<br />
  b. Able to edit previous posts<br />
8. Upload Podcast
9. Settings

####Post
A post has the following components

1. Title
2. Description (text and possibly images).
3. Link to Podcast
  a. Linked to podcast in our database
  b. Linked to podcast through url
4. Date
5. Author

Posts have the following functionality

1. Like
2. Favorite
3. Comment(?)
4. Share(?)
