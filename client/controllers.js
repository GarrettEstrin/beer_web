angular.module('myApp')
  .controller('mainController', mainController)
  .controller('loginController', loginController)
  .controller('logoutController', logoutController)
  .controller('registerController', registerController)
  .controller('SingleUserController', SingleUserController)
  .controller('LogBeerController', LogBeerController)
  .controller('UsersController', UsersController)
  .controller('BeersController', BeersController)
  .controller('UserDetailController', UserDetailController)
  .controller('BeerDetailController', BeerDetailController)


  mainController.$inject = ['$rootScope', '$state', 'AuthService', '$http', '$routeParams', '$scope', '$route', '$location', 'UserFactory']
  loginController.$inject = ['$state', 'AuthService', '$http']
  logoutController.$inject = ['$state', 'AuthService']
  registerController.$inject = ['$state', 'AuthService', '$http']
  SingleUserController.$inject = ['$http', 'AuthService', '$rootScope']
  LogBeerController.$inject = ['$http', 'AuthService', '$rootScope', 'UserFactory', '$state', 'BeerFactory']
  UsersController.$inject = ['$http', 'AuthService', '$rootScope', '$state', 'UserFactory']
  BeersController.$inject = ['$http', 'AuthService', '$rootScope', '$state', 'BeerFactory']
  UserDetailController.$inject = ['$http', 'AuthService', '$rootScope', '$state', 'UserFactory', '$stateParams']
  BeerDetailController.$inject = ['$http', 'AuthService', '$rootScope', '$state', 'BeerFactory', '$stateParams']


function mainController($rootScope, $state, AuthService, $http, $routeParams, $scope, $route, $location, UserFactory) {
  var vm = this
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
  vm.currentUser = ''




  $rootScope.$on('$stateChangeStart', function (event) {
    // console.log("Changing states")
    AuthService.getUserStatus()
      .then(function(data){
        vm.currentUser = data.data.user
      })
  })

  UserFactory.show(vm.currentUser._id)
    .success(function(user){
      vm.currentUser = user
      console.log(vm.currentUser);
    })



  $rootScope.isLoggedIn = function(){
    console.log("isLoggedIn triggered");
  }

  vm.logout = function () {

    // call logout from service
    AuthService.logout()
      .then(function () {
        $state.go('home')
      })
  }
}

// LOGIN CONTROLLER:
function loginController($state, AuthService, $http) {
  var vm = this

  vm.login = function () {

    // initial values
    vm.error = false
    vm.disabled = true

    // call login from service
    AuthService.login(vm.loginForm.username, vm.loginForm.password)
      // handle success
      .then(function () {
        // $state.go('user({id: vm.currentUser._id})')
        $state.go('beers')
        vm.disabled = false
        vm.loginForm = {}
      })
      // handle error
      .catch(function () {
        console.log("Whoops...")
        vm.error = true
        vm.errorMessage = "Invalid username and/or password"
        vm.disabled = false
        vm.loginForm = {}
      })
  }
}


// LOGOUT CONTROLLER:
function logoutController($state, AuthService) {
  var vm = this
  vm.logout = function () {

    // call logout from service
    AuthService.logout()
      .then(function () {
        $state.go('home')
      })
  }
}

// REGISTER CONTROLLER:
function registerController($state, AuthService, $http) {
  var vm = this
  vm.register = function () {

    // initial values
    vm.error = false
    vm.disabled = true

    // call register from service
    AuthService.register(vm.registerForm.name, vm.registerForm.username, vm.registerForm.password)
      // handle success
      .then(function(data) {
        console.log(data);
        $state.go('profile')
        vm.disabled = false
        vm.registerForm = {}
      })
      // handle error
      .catch(function () {
        vm.error = true
        vm.errorMessage = "Something went wrong!"
        vm.disabled = false
        vm.registerForm = {}
      })
  }
}

function SingleUserController($http, AuthService, $rootScope) {
  var vm = this
  $http.get('/api')
  .then(function(response){
    vm.allUsers = response.data
  })

  vm.showUser = function(userId) {
    console.log('let us show the user' + userId);
    // go to state that shows details for user
    // $state.go('userDetails')
    // making a http call if necessary
  }
  AuthService.getUserStatus()
    .then(function(data){
      vm.currentUser = data.data.user
      $http.get('/api/' + vm.currentUser._id)
        .success(function(data) {
          vm.currentUser = data
        })
    })
    /*
        Function to carry out the actual PUT request to S3 using the signed request from the app.
      */
      vm.uploadFile = function (file, signedRequest, url){
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedRequest);
        xhr.onreadystatechange = function(){
          if(xhr.readyState === 4){
            if(xhr.status === 200){
              document.getElementById('preview').src = url;
              document.getElementById('avatar-url').value = url;
              // document.getElementById('nav-avatar').src = url;
            }
            else{
              alert('Could not upload file.');
            }
          }
        };
        xhr.send(file);
      }

      /*
        Function to get the temporary signed request from the app.
        If request successful, continue to upload the file using this signed
        request.
      */
      vm.getSignedRequest = function (file){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/sign-s3?file-name=${file.randomName}&file-type=${file.type}`);
        xhr.onreadystatechange = () => {
          if(xhr.readyState === 4){
            if(xhr.status === 200){
              const response = JSON.parse(xhr.responseText);
              console.log("response:");
              console.log(response.url);
              vm.avatarUrl = response.url
              console.log("AvatarURL");
              console.log(vm.avatarUrl);
              vm.uploadFile(file, response.signedRequest, response.url);
              vm.addAvatarToProfile()
            }
            else{
              alert('Could not get signed URL.');
            }
          }
        };
        xhr.send();
      }

      /*
       Function called when file input updated. If there is a file selected, then
       start upload procedure by asking for a signed request from the app.
      */
      vm.initUpload = function (){
        function makeid(){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for( var i=0; i < 10; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        }
        var files = document.getElementById('file-input').files;
        // var file = files[0];
        file = files[0];
        file.randomName = vm.currentUser._id + "." + file.name.split('.').pop()
        if(file == null){
          return alert('No file selected.');
        }
        vm.getSignedRequest(file);
      }

      /*
       Bind listeners when the page loads.
      */
      initiate = function() {
          document.getElementById('file-input').onchange = vm.initUpload;
      }

      initiate()

  vm.addAvatarToProfile = function(){
    console.log(vm.avatarUrl);
    $http.patch('/api/' + vm.currentUser._id, {avatar: vm.avatarUrl})
      .then(console.log(vm.avatarUrl))
  }
  // Show change avatar div
  vm.showAvatarDiv = function(){
    console.log('showAvatarDiv hit');
    var div = document.getElementById('new-avatar-div')
    div.style.display = "inline-block"
    var btn = document.getElementById('edit-avatar-btn')
    console.log(btn.innerText);
    btn.innerText = "Done"
    btn.className = " btn btn-danger"
    btn.removeEventListener('click', vm.showAvatarDiv)
    btn.addEventListener('click', vm.hideAvatarDiv)

  }

  vm.hideAvatarDiv = function(){
    console.log('hideAvatarDiv hit');
    var div = document.getElementById('new-avatar-div')
    div.style.display = 'none'
    var btn = document.getElementById('edit-avatar-btn')
    console.log(btn.innerText);
    btn.innerText = "Change Avatar"
    btn.className = " btn btn-primary"
    btn.removeEventListener('click', vm.hideAvatarDiv)
    btn.addEventListener('click', vm.showAvatarDiv)
  }
  vm.show = function(){
    console.log("show function hit");
    $http.get('/api/' + vm.currentUser._id, function(req, res){
      console.log(res);
      return vm.user = res.data.user
    })
  }

}

function LogBeerController($http, AuthService, $rootScope, UserFactory, $state, BeerFactory){
  console.log("LogBeerController instantiated");
  AuthService.getUserStatus()
    .then(function(data){
      vm.currentUser = data.data.user
      $http.get('/api/' + vm.currentUser._id)
        .success(function(data) {          vm.currentUser = data
        })
    })
  vm = this
  vm.beerPictureUrl = ""
  vm.logBeer = function(beer){
    console.log("logBeer function was activated");
    beer.review = {title: "", body: ""}
    beer.user = vm.currentUser._id
    beer.location = document.getElementById('places-autocomplete').value
    console.log("Beer object:");
    console.log(beer);
    $http.post('/beers', {
      name: beer.name,
      color: beer.color,
      alcoholcontent: beer.alcoholcontent,
      bitter: beer.bitter,
      picture: vm.beerPictureUrl,
      user: beer.user,
      location: beer.location,
      review: {title: beer.review.title,
              body: beer.review.body
      }
    })
      .then(function(data) {
        console.log(data)
        $state.go('beer', {id: data.data.beer._id})
      })
  }
  var picBtn = document.getElementById('picture-modal-btn')
  var picModal = document.getElementById('picture-modal')
  var picCloseBtn = document.getElementById('close-picture-modal-btn')

  picBtn.addEventListener('click', function(){
    picModal.style.display = "inline-block"
  })

  picCloseBtn.addEventListener('click', function(){
    picModal.style.display = "none"
  })
  var body = document.getElementsByTagName('body')
  var locBtn = document.getElementById('location-modal-btn')
  var locModal = document.getElementById('location-modal')
  var locCloseBtn = document.getElementById('close-location-modal-btn')

  locBtn.addEventListener('click', function(){
    locModal.style.display = "inline-block"
  })

  locCloseBtn.addEventListener('click', function(){
    locModal.style.display = "none"
  })

  // FIND LOCATION
  var coords = {}
  navigator.geolocation.getCurrentPosition(function(data){
    coords.lat = data.coords.latitude
    coords.lon = data.coords.longitude
    // console.log("Coords");
    // console.log(coordinates);
    BeerFactory.location(coords)
  })



  /*
      Function to carry out the actual PUT request to S3 using the signed request from the app.
    */
    vm.uploadFile = function (file, signedRequest, url){
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedRequest);
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
          if(xhr.status === 200){
            document.getElementById('preview').src = url;
            // document.getElementById('avatar-url').value = url;
            // document.getElementById('nav-avatar').src = url;
          }
          else{
            alert('Could not upload file.');
          }
        }
      };
      xhr.send(file);
      vm.beerPictureUrl = url
    }

    /*
      Function to get the temporary signed request from the app.
      If request successful, continue to upload the file using this signed
      request.
    */
    vm.getSignedRequest = function (file){
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `/sign-s3?file-name=${file.randomName}&file-type=${file.type}`);
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
          if(xhr.status === 200){
            const response = JSON.parse(xhr.responseText);
            console.log("response:");
            console.log(response.url);
            vm.avatarUrl = response.url
            console.log("BeerURL");
            console.log(vm.avatarUrl);
            vm.uploadFile(file, response.signedRequest, response.url);
            // vm.addAvatarToProfile()
          }
          else{
            alert('Could not get signed URL.');
          }
        }
      };
      xhr.send();
    }

    /*
     Function called when file input updated. If there is a file selected, then
     start upload procedure by asking for a signed request from the app.
    */
    vm.initUpload = function (){
      function makeid(){
          var text = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          for( var i=0; i < 10; i++ )
              text += possible.charAt(Math.floor(Math.random() * possible.length));
          return text;
      }
      var files = document.getElementById('file-input').files;
      // var file = files[0];
      file = files[0];
      file.randomName = makeid() + "." + file.name.split('.').pop()
      if(file == null){
        return alert('No file selected.');
      }
      vm.getSignedRequest(file);
    }

    /*
     Bind listeners when the page loads.
    */
    initiate = function() {
        document.getElementById('file-input').onchange = vm.initUpload;
    }

    initiate()
}

function UsersController($http, AuthService, $rootScope, $state, UserFactory){
  var vm = this

  UserFactory.index()
    .success(function(data){
      vm.users = data
    })

  vm.showUser = function(userId) {
    console.log('let us show the user' + userId);
    $state.go('userDetails')
    // go to state that shows details for user
    // $state.go('userDetails')
    // making a http call if necessary
  }
}

function UserDetailController($http, AuthService, $rootScope, $state, UserFactory, $stateParams){
  console.log("UserDetailController instantiated");
  var vm = this
  UserFactory.show($stateParams.id)
    .success(function(user){
      vm.user = user
      console.log(vm.user);
    })

}

function BeersController($http, AuthService, $rootScope, $state, BeerFactory){
  var vm = this

  BeerFactory.index()
    .success(function(data){
      vm.beers = data
    })

  vm.showBeer = function(userId) {
    console.log('let us show the beer' + beerId);
    $state.go('beerDetails')
    // go to state that shows details for beer
    // $state.go('beerDetails')
    // making a http call if necessary
  }
}

function BeerDetailController($http, AuthService, $rootScope, $state, BeerFactory, $stateParams){
  var vm = this
  vm.disabled = false
  vm.beerId = $stateParams.id

  // Show/hide review div
  vm.showReviewDiv = function(){
    console.log('showReviewDiv hit');
    var div = document.getElementById('review-div')
    div.style.display = "inline-block"
    var btn = document.getElementById('toggle-review-btn')
    btn.style.display = "none"

  }



  BeerFactory.show($stateParams.id)
    .success(function(beer){
      vm.beer = beer
    })
  vm.logReview = function(data){
    console.log("logReview function hit");
    console.log(data);
    vm.disabled= true
    var newBeer = {
      title: data.title,
      body: data.body,
      beerId: vm.beerId
    }
    BeerFactory.edit(newBeer)
    .success(function(beer){
      console.log(beer);
      // $state.go('beer', {id: beer.beerid})
      $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true })
    })
  }
}
