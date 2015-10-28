angular.module('starter.controllers', [])
.controller('LoginCtrl', function ($scope, $state)
{
    $scope.signIn = function (user) {
        console.log('Sign-In', user);
        $state.go('sidemenu.tab.dash');
    };
    $scope.goToSignUp = function (user) {
        console.log('GoTo Sign-Up', user);
        $state.go('signup');
    };
})
.controller('SignUpCtrl', function ($scope, $state) {
    $scope.signUp = function (user) {
        console.log('Sign-Up Finished', user);
        $state.go('sidemenu.tab.dash');
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