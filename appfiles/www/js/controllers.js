/*.controller('MainCtrl', function($scope, $http) {
    $http.get('https://cors-test.appspot.com/test').then(function(resp) {
        console.log('Success', resp);
        // For JSON responses, resp.data contains the result
    }, function(err) {
        console.error('ERR', err);
        // err.status will contain the status code
    })310-530-3900
    (310) 784-0706
    (310) 530-3177
})*/
angular.module('starter.controllers', [])
.controller('LoginCtrl', function ($scope, $state, $http, $ionicPopup)
{
    $scope.signIn = function (user) {
        console.log('Sign-In', user);

        var getPasswordRequestURL = 'http://54.183.235.161:8080/api/v1/users/';
        getPasswordRequestURL += user.username;
        

        $http({
            method: 'GET',
            url: getPasswordRequestURL,
            data: null,
            headers: { 'Content-Type': 'application/json' }
        }).then(function (resp) {
            console.log('Success', resp);
            console.log('test', resp.data._id);

            if (user.password == resp.data.firstName) {
                $state.go('sidemenu.tab.dash');
            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Username or Password Incorrect'
                });
            }

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
.controller('SignUpCtrl', function ($scope, $state,$http, $ionicPopup) {
    $scope.signUp = function (user) {
        console.log('Sign-Up Finished', user);

        var signUpData = { '_id': user.name,
                           'firstName': user.firstname,
                           'lastName': user.lastname};
        
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

;