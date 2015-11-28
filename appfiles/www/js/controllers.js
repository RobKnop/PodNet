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
.controller('SelfProfileCtrl', function ($scope) {
    var selfData = JSON.parse(window.localStorage['selfData']);
    //console.log('selfData', selfData);
    $scope.name = selfData.firstName + " " + selfData.lastName;
})
;