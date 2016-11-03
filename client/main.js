var myApp = angular.module('myApp', ['ui.router', 'ngRoute'])
.directive('navigationBar', navigationBar)

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
    .state('beers', {
      url: '/allbeers',
      templateUrl: 'templates/beers.html',
      restricted: false,
      controller: 'BeersController as bc'
    })
    .state('users', {
      url: '/allusers',
      templateUrl: 'templates/users.html',
      controller: 'UsersController as uc'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      restricted: true,
      controller: 'SingleUserController as suc'
    })
    .state('user', {
      url: '/userdetail/:id',
      templateUrl: 'templates/user.html',
      controller: 'UserDetailController as udc'
    })
    .state('beer', {
      url: '/beerdetail/:id',
      templateUrl: 'templates/beer.html',
      controller: 'BeerDetailController as bdc'
    })

})

function navigationBar() {
  return {
    restrict: 'E',
    templateUrl: 'partials/nav.html'
  }
}


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
