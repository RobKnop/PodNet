angular.module('starter.controllers', [])
//login controller
.controller('LoginCtrl', function ($scope, $state, $http, $ionicPopup) {
    //remove windowlocalstorage so can't use last login
    window.localStorage['selfData'] = null;

    //when user signs in
    $scope.signIn = function (user) {
        window.localStorage['selfData'] = null;
        var getSignInURL = 'http://54.183.235.161:8080/api/v1/users/';
        getSignInURL += user.username;


        $http({
            method: 'GET',
            url: getSignInURL,
            data: null,
            headers: { 'Content-Type': 'application/json' }
        }).then(function (resp) {
            console.log('Sign in Success', resp);
            if (resp.data.message == 'No user found!') {
                //signin failed
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Username Incorrect'
                });
            }
            else {
                //sign in succeeded
                window.localStorage['selfData'] = JSON.stringify(resp.data);
                console.log('selfData Updated');
                $state.go('sidemenu.tab.dash');
            }
        }, function (err) {
            //get request failed
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Username incorrect or Not Connected to Internet'
            });
            console.error('ERR', err);

        });


    };

    //button to signup
    $scope.goToSignUp = function (user) {
        console.log('GoTo Sign-Up', user);
        $state.go('signup');
    };
})

//signup controller
.controller('SignUpCtrl', function ($scope, $state, $http, $ionicPopup) {
    //sign up function
    $scope.signUp = function (user) {
        console.log('Sign-Up Finished', user);
        //load up json user object
        var signUpData = {
            '_id': user.name,
            'firstName': user.firstname,
            'lastName': user.lastname,
            'followers' : [],
            'following' : [],
            "publishedPodcasts" : [],
            "newsfeed" : []
        };
        
        $http({
            method: 'POST',
            url: 'http://54.183.235.161:8080/api/v1/signup',
            data: signUpData,
            headers: { 'Content-Type': 'application/json' }
        }).then(function (resp) {
            console.log('Success', resp);
            if (resp.data.message.indexOf('ERROR') > -1) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Sign Up failed!',
                    template: 'Username already taken'
                });
            }
            else {
                window.localStorage['selfData'] = JSON.stringify(signUpData);
                $state.go('sidemenu.tab.dash');
            }
            
        }, function (err) {
            var alertPopup = $ionicPopup.alert({
                title: 'Sign Up failed!',
                template: 'Server Failed or Not Connected to Internet'
            });
            console.error('ERR', err);

        });

    };
    $scope.goToLogin = function (user) {
        console.log('Sign-Up Cancelled', user);
        $state.go('login');
    };
})

//controller for landing page
.controller('DashCtrl', function ($scope, $http, $sce) {
    var selfData = JSON.parse(window.localStorage['selfData']);
    $scope.posts = selfData.newsfeed;
   for (var i = 0; i < $scope.posts.length; i++) {
        var getPodURL = 'http://54.183.235.161:8080/api/v1/podcasts/' + $scope.posts[i].podcast._id;
        
        $scope.posts[i].audiosrc = $sce.trustAsResourceUrl(getPodURL);
    }
    
})

.controller('ChatsCtrl', function ($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
        Chats.remove(chat);
    }
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    };
})

.controller('LandingCtrl', function ($scope) { })

.controller('SearchCtrl', function ($scope, $state, $http) {
    var searchResults = searchResults = [{
        '_id': 'No results found',
        'firstName': '',
        'lastName': ''
    }];
    $scope.search = function (query) {
        if (query.length > 2) {
            var searchURL = 'http://54.183.235.161:8080/api/v1/users/search/';
            searchURL += query;


            $http({
                method: 'GET',
                url: searchURL,
                data: null,
                headers: { 'Content-Type': 'application/json' }
            }).then(function (resp) {
                console.log('Success', resp);

                if (resp.data.message == 'No user found!') {
                    $scope.searchResults = [{
                        '_id': 'No results found',
                        'firstName': '',
                        'lastName': ''
                    }];
                }
                else {
                    $scope.searchResults = resp.data;
                    window.localStorage['searchResults'] = JSON.stringify(resp.data);
                }

            }, function (err) {
                $scope.searchResults = [{
                    '_id': 'No results found',
                    'firstName': '',
                    'lastName': ''
                }];

            });

            //$scope.$apply(function () { $scope.searchResults = searchResults; });
        }
    }

})
.controller('OtherProfileCtrl', function ($scope, $stateParams, $state, $http, $ionicPopup) {
    var searchResults = JSON.parse(window.localStorage['searchResults']);
    var index = -1;
    if (searchResults) {
        for (var i = 0; i < searchResults.length; i++) {
            if (searchResults[i]._id == $stateParams._id) {
                index = i;
                break;
            }
        }
    }
    if (index == -1) {
        console.log("Error did not find search id");

        //try get request
        var getUserURL = 'http://54.183.235.161:8080/api/v1/users/';
        getUserURL += $stateParams._id;


        $http({
            method: 'GET',
            url: getUserURL,
            data: null,
            headers: { 'Content-Type': 'application/json' }
        }).then(function (resp) {
            console.log('Find User Success', resp);
            if (resp.data.message == 'No user found!') {
                $state.go('sidemenu.tab.selfprofile');
            }
            else {
                window.localStorage['viewData'] = JSON.stringify(resp.data);
                $scope.name = resp.data.firstName + " " + resp.data.lastName;
                $scope.nfollowers = resp.data.followers.length;


                if (resp.data.following.length) {
                    $scope.nfollowing = resp.data.following.length;
                }
                else {
                    $scope.nfollowing = 0;
                }
            }


        }, function (err) {

            console.error('ERR', err);
            $state.go('sidemenu.tab.selfprofile');
        });

        //$state.go('sidemenu.tab.search');
    }
    else {
        window.localStorage['viewData'] = JSON.stringify(searchResults[index]);

        $scope.name = searchResults[index].firstName + " " + searchResults[index].lastName;
        $scope.nfollowers = searchResults[index].followers.length;


        if (searchResults[index].following.length) {
            $scope.nfollowing = searchResults[index].following.length;
        }
        else {
            $scope.nfollowing = 0;
        }
    }

    $scope.follow = function () {
        var selfData = JSON.parse(window.localStorage['selfData']);
        var otherData = JSON.parse(window.localStorage['viewData']);

        var followRequestURL = 'http://54.183.235.161:8080/api/v1/addfollower?current=';
        followRequestURL += selfData._id + "&newFollower=" + otherData._id;


        $http({
            method: 'GET',
            url: followRequestURL,
            data: null,
            headers: { 'Content-Type': 'application/json' }
        }).then(function (resp) {
            console.log('Follow Request Success', resp);
            if (resp.data.message.indexOf('successfully') > -1) {
                var alertString = 'You are now following ' + otherData._id;
                var alertPopup = $ionicPopup.alert({
                    title: alertString
                });

                var getPasswordRequestURL = 'http://54.183.235.161:8080/api/v1/users/';
                getPasswordRequestURL += selfData._id;


                $http({
                    method: 'GET',
                    url: getPasswordRequestURL,
                    data: null,
                    headers: { 'Content-Type': 'application/json' }
                }).then(function (resp) {
                    console.log('Update self profile', resp);
                    if (resp.data.message == 'No user found!') {
                    }
                    else {
                        window.localStorage['selfData'] = JSON.stringify(resp.data);
                    }
                }, function (err) {
                    console.error('ERR', err);
                });


            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Follow Failed',
                    template: resp.data.message
                });
            }

        }, function (err) {
            var alertPopup = $ionicPopup.alert({
                title: 'Follow Failed'
            });
            console.error('ERR', err);

        });


    };
})

.controller('SelfProfileCtrl', function ($scope) {
    window.localStorage['viewData'] = window.localStorage['selfData'];
    window.localStorage['searchResults'] = null;
    var selfData = JSON.parse(window.localStorage['selfData']);
    console.log('selfData', selfData);
    $scope.name = selfData.firstName + " " + selfData.lastName;

    $scope.nfollowers = selfData.followers.length;
    
    
    if (selfData.following.length) {
        $scope.nfollowing = selfData.following.length;
    }
    else {
        $scope.nfollowing = 0;
    }

    
})
.controller('TabPostsCtrl', function ($scope) {
    var selfData = JSON.parse(window.localStorage['viewData']);
})
.controller('TabFollowingCtrl', function ($scope) {
    var selfData = JSON.parse(window.localStorage['viewData']);
    $scope.following = selfData.following;
    console.log("following", $scope.following);
})
.controller('TabFollowersCtrl', function ($scope) {
    var selfData = JSON.parse(window.localStorage['viewData']);
    $scope.followers = selfData.followers;
    console.log("followers", selfData.followers);
})

.controller('UploadCtrl', function ($scope, $state) {
    var selfData = JSON.parse(window.localStorage['selfData']);
    
    $scope.ownerName = selfData._id;
})
.controller('PodcastSearchCtrl', function ($scope, $state, $http, $sce) {
    $scope.audiosrc = null;
    
    $scope.audiohide = "false";
    
    var searchResults = null;
    $scope.search = function (query) {
        if (query.length > 2) {
            var searchURL = 'http://54.183.235.161:8080/api/v1/podcasts/search/';
            searchURL += query;


            $http({
                method: 'GET',
                url: searchURL,
                data: null,
                headers: { 'Content-Type': 'application/json' }
            }).then(function (resp) {
                console.log('Success', resp);

                if (resp.data.message == 'No Podcast found!') {
                    $scope.searchResults = null;
                }
                else {
                    $scope.searchResults = resp.data;
                    window.localStorage['podcastSearchResults'] = JSON.stringify(resp.data);
                }

            }, function (err) {
                $scope.searchResults = null;

            });
        }
    }

    $scope.playFile = function (podID) {
        var getPodURL = 'http://54.183.235.161:8080/api/v1/podcasts/' + podID;
        $scope.audiosrc = $sce.trustAsResourceUrl(getPodURL);
        var playme = document.getElementById('podAudio');
        
        playme.load();
        console.log('audio loaded');
        
        
    }

})
.controller('NewPostCtrl', function ($scope, $state, $http, $ionicPopup) {
    //show uploaded podcasts
    var selfData = JSON.parse(window.localStorage['selfData']);
    var searchURL = 'http://54.183.235.161:8080/api/v1/podcasts/search/';
    searchURL += selfData._id;


    $http({
        method: 'GET',
        url: searchURL,
        data: null,
        headers: { 'Content-Type': 'application/json' }
    }).then(function (resp) {
        console.log('Success', resp);

        if (resp.data.message == 'No Podcast found!') {
            $scope.searchResults = null;
        }
        else {
            $scope.searchResults = resp.data;
            window.localStorage['podcastSearchResults'] = JSON.stringify(resp.data);
        }

    }, function (err) {
        $scope.searchResults = null;

    });


    $scope.selectedRow = null;  // initialize our variable to null
    $scope.setClickedRow = function (index) {  //function that sets the value of selectedRow to current index
        $scope.selectedRow = index;
    }

    $scope.createPost = function (comment) {
        if(!comment || comment == "comment"){
            var alertPopup = $ionicPopup.alert({
                title: 'Comment field cannont be empty'
            });
            return;
        }
        if ($scope.selectedRow == null) {
            var alertPopup = $ionicPopup.alert({
                title: 'Must Select Podcast'
            });
            return;
        }
        /*console.log("com", comment);
        console.log("post", $scope.searchResults[$scope.selectedRow]);*/
        var postData = {
            'author': selfData._id,
            'comment': comment,
            'podcast': $scope.searchResults[$scope.selectedRow],
            'likes': 0
        };
        
        $http({
            method: 'POST',
            url: 'http://54.183.235.161:8080/api/v1/posts/creation',
            data: postData,
            headers: { 'Content-Type': 'application/json' }
        }).then(function (resp) {
            console.log('New Post Success', resp); 
            var alertPopup = $ionicPopup.alert({
                title: 'New Post Success!' 
            });
        }, function (err) {
            var alertPopup = $ionicPopup.alert({
                title: 'New Post failed!',
                template: 'Server Failed or Not Connected to Internet'
            });
            console.error('ERR', err);
        });
    }
})
;