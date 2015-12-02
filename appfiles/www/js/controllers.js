/*.controller('MainCtrl', function($scope, $http) {
    $http.get('https://cors-test.appspot.com/test').then(function(resp) {
        console.log('Success', resp);
        // For JSON responses, resp.data contains the result
    }, function(err) {
        console.error('ERR', err);
        // err.status will contain the status code
    })
})*/
angular.module('starter.controllers', [])
.controller('LoginCtrl', function ($scope, $state, $http, $ionicPopup) {
    //remove windowlocalstorage so can't use last login

    window.localStorage['selfData'] = null;

    $scope.signIn = function (user) {
        var getPasswordRequestURL = 'http://54.183.235.161:8080/api/v1/users/';
        getPasswordRequestURL += user.username;


        $http({
            method: 'GET',
            url: getPasswordRequestURL,
            data: null,
            headers: { 'Content-Type': 'application/json' }
        }).then(function (resp) {
            console.log('Sign in Success', resp);
            if (resp.data.message == 'No user found!') {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Username Incorrect'
                });
            }
            else {
                window.localStorage['selfData'] = JSON.stringify(resp.data);
                
                $state.go('sidemenu.tab.dash');
            }

            /*if (user.password == resp.data.firstName) {
                $state.go('sidemenu.tab.dash');
            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Username or Password Incorrect'
                });
            }*/

        }, function (err) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Username incorrect or Not Connected to Internet'
            });
            console.error('ERR', err);

        });


    };
    $scope.goToSignUp = function (user) {
        console.log('GoTo Sign-Up', user);
        $state.go('signup');
    };
})
.controller('SignUpCtrl', function ($scope, $state, $http, $ionicPopup) {
    $scope.signUp = function (user) {
        console.log('Sign-Up Finished', user);

        var signUpData = {
            '_id': user.name,
            'firstName': user.firstname,
            'lastName': user.lastname
        };

        $http({
            method: 'POST',
            url: 'http://54.183.235.161:8080/api/v1/signup',
            data: signUpData,
            headers: { 'Content-Type': 'application/json' }
        }).then(function (resp) {
            console.log('Success', resp);

            if (resp.status == 200) {
                $state.go('sidemenu.tab.dash');
            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Sign Up failed!',
                    template: 'Username or Password Incorrect'
                });
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
.controller('DashCtrl', function ($scope) { })

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
    for (var i = 0; i < searchResults.length; i++) {
        if (searchResults[i]._id == $stateParams._id) {
            index = i;
            break;
        }
    }
    if (index == -1) {
        console.log("Error did not find search id");
        $state.go('sidemenu.tab.search');
    }

    window.localStorage['viewData'] = JSON.stringify(searchResults[index]);
    $scope.name = searchResults[index].firstName + " " + searchResults[index].lastName;
    $scope.nfollowers = searchResults[index].followers.length;


    if (searchResults[index].following.length) {
        $scope.nfollowing = searchResults[index].following.length;
    }
    else {
        $scope.nfollowing = 0;
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
    var selfData = JSON.parse(window.localStorage['selfData']);
    //console.log('selfData', selfData);
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
    
})


;