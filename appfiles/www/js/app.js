// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
      //window.statusbar.visible = true;
    if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
    }
    /*if (window.StatusBar) {
      // org.apache.cordova.statusbar required
        window.StatusBar.styleLightContent();
        window.st
        StatusBar.hide();
    }*/
  });
})
.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
})
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
      .state('sidemenu', {
          url: "/sidemenu",
          abstract: true,
          templateUrl: "templates/sidemenu.html"
      })

    .state('sidemenu.tab', {
    url: "/tab",
    abstract: true,
        //templateUrl: "templates/tabs.html"
    views: {
        'menu-content': {
            templateUrl: "templates/tabs.html",
        }
    }
  })

  
   
    .state('login', {
        cache:false,
        url: '/login',
        templateUrl: 'templates/tab-login.html',
        controller: 'LoginCtrl'
    })
    .state('signup', {
        cache: false,
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'SignUpCtrl'
    })
    // Each tab has its own nav history stack:
  .state('sidemenu.tab.dash', {
    cache: false,
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  
  .state('sidemenu.tab.search', {
      cache: false,
      url: '/search',
      views: {
          'search': {
              templateUrl: 'templates/search.html',
              controller: 'SearchCtrl'
          }
      }
  })
  .state('sidemenu.tab.selfprofile', {
      cache: false,
      url: '/selfprofile',
      views: {
          'selfprofile': {
              templateUrl: 'templates/selfprofile.html',
              controller: 'SelfProfileCtrl'
          }
      }
  })
  .state('sidemenu.tab.selfprofile.posts', {
      cache: false,
      url: '/tabposts',
      views: {
          'tabposts': {
              templateUrl: 'templates/tabposts.html',
              controller: 'TabPostsCtrl'
          }
      }
  })
  .state('sidemenu.tab.selfprofile.followers', {
      cache: false,
      url: '/tabfollowers',
      views: {
          'tabfollowers': {
              templateUrl: 'templates/tabfollowers.html',
              controller: 'TabFollowersCtrl'
          }
      }
  })
  .state('sidemenu.tab.selfprofile.following', {
      cache: false,
      url: '/tabfollowing',
      views: {
          'tabfollowing': {
              templateUrl: 'templates/tabfollowing.html',
              controller: 'TabFollowingCtrl'
          }
      }
  })
  .state('sidemenu.tab.otherprofile', {
      cache: false,
      url: '/otherprofile/:_id',
      views: {
          'otherprofile': {
              templateUrl: 'templates/otherprofile.html',
              controller: 'OtherProfileCtrl'
          }
      }
  })

  .state('sidemenu.tab.otherprofile.posts', {
      cache: false,
      url: '/tabotherposts',
      views: {
          'tabposts': {
              templateUrl: 'templates/tabposts.html',
              controller: 'TabPostsCtrl'
          }
      }
  })
  .state('sidemenu.tab.otherprofile.followers', {
      cache: false,
      url: '/tabotherfollowers',
      views: {
          'tabotherfollowers': {
              templateUrl: 'templates/tabfollowers.html',
              controller: 'TabFollowersCtrl'
          }
      }
  })
  .state('sidemenu.tab.otherprofile.following', {
      cache: false,
      url: '/tabotherfollowing',
      views: {
          'tabotherfollowing': {
              templateUrl: 'templates/tabfollowing.html',
              controller: 'TabFollowingCtrl'
          }
      }
  })
  .state('sidemenu.tab.upload', {
      cache: false,
      url: '/upload',
      views: {
          'upload': {
              templateUrl: 'templates/upload.html',
              controller: 'UploadCtrl'
          }
      }
  })
  .state('sidemenu.tab.podcastsearch', {
      cache: false,
      url: '/podcastsearch',
      views: {
          'podcastsearch': {
              templateUrl: 'templates/podcastsearch.html',
              controller: 'PodcastSearchCtrl'
          }
      }
  })
     
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
