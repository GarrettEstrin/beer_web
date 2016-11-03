var myApp = angular.module('myApp', ['ui.router'])

myApp.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/')

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      restricted: false
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginController as loginCtrl'

    })
    .state('logout', {
      url: '/logout',
      controller: 'logoutController'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'registerController as registerCtrl'
    })
    .state('beerlogger', {
      url: '/logbeer',
      templateUrl: 'templates/beerlogger.html',
      restricted: true,
      controller: 'LogBeerController as lbc'
    })
    .state('individualBeer', {
      url: '/beers',
      template: 'templates/individualbeer.html',
      restricted: false,
      controller: 'IndividualBeerController as ibc'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      restricted: true,
      controller: 'SingleUserController as suc'
    })

})

myApp.run(function ($rootScope, $location, $state, AuthService) {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    AuthService.getUserStatus()
    .then(function(){
      // console.log(toState)
      if (toState.restricted && !AuthService.isLoggedIn()){
        // $location.path('/login')
        $state.go('login');
      }
    })
  })
})
