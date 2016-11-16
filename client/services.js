angular.module('myApp')
  .factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    var user = null

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register
    })

    function isLoggedIn() {
      if(user) {
        return true
      } else {
        return false
      }
    }

    function getUserStatus() {
      return $http.get('/user/status')
      // handle success
      .success(function (data) {
        if(data.status){
          user = true
        } else {
          user = false
        }
      })
      // handle error
      .error(function (data) {
        user = false
      })
    }

    function login(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer()

      // send a post request to the server
      $http.post('/user/login',
        {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            user = true
            deferred.resolve()
          } else {
            user = false
            deferred.reject()
          }
        })
        // handle error
        .error(function (data) {
          user = false
          deferred.reject()
        })

      // return promise object
      return deferred.promise

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer()

      // send a get request to the server
      $http.get('/user/logout')
        // handle success
        .success(function (data) {
          user = false
          deferred.resolve()
        })
        // handle error
        .error(function (data) {
          user = false
          deferred.reject()
        })

      // return promise object
      return deferred.promise

    }

    function register(name, username, password) {

      // create a new instance of deferred
      var deferred = $q.defer()

      // send a post request to the server
      $http.post('/user/register',
        {name: name, username: username, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve()
          } else {
            deferred.reject()
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject()
        })

      // return promise object
      return deferred.promise

    }

}])

.factory('UserFactory', ['$http', UserFactory])
.factory('BeerFactory', ['$http', BeerFactory])

function UserFactory($http){
return {
  index: index,
  show: show,
  destroy: destroy,
  create: create,
  edit: edit
}

function index(){
  return $http.get('/api/')
}

function show(id){
  return $http.get('/api/' + id)
}

function destroy(id){
  return $http.delete('/api/' + id)
}

function create(user){
  return $http.post('/api', user)
}

function edit(user, beer){
  return $http.patch('/api' + user._id)
}
}

function BeerFactory($http){
return {
  index: index,
  show: show,
  destroy: destroy,
  create: create,
  edit: edit,
  location: location
}

function index(){
  return $http.get('/beers')
}

function show(id){
  return $http.get('/beers/' + id)
}

function destroy(id){
  return $http.delete('/beers' + id)
}

function create(beer){
  return $http.post('/beers', beer)
}

function edit(beer){
  return $http.patch('/beers/' + beer.beerId, beer)
}

function location(coords){
  // console.log(coords);
  return $http.get('/beers/location/'+ coords.lat + '/' + coords.lon)
}

}
