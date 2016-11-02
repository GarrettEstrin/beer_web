angular.module('myApp')
  .controller('mainController', mainController)
  .controller('loginController', loginController)
  .controller('logoutController', logoutController)
  .controller('registerController', registerController)
  .controller('SingleUserController', SingleUserController)
  .controller('LogBeerController', LogBeerController)


  mainController.$inject = ['$rootScope', '$state', 'AuthService']
  loginController.$inject = ['$state', 'AuthService']
  logoutController.$inject = ['$state', 'AuthService']
  registerController.$inject = ['$state', 'AuthService']
  SingleUserController.$inject = ['$http', 'AuthService', '$rootScope']
    LogBeerController.$inject = ['$http', 'AuthService', '$rootScope']


function mainController($rootScope, $state, AuthService) {
  var vm = this
  $rootScope.$on('$stateChangeStart', function (event) {
    // console.log("Changing states")
    AuthService.getUserStatus()
      .then(function(data){
        vm.currentUser = data.data.user
      })
  })

  vm.logout = function () {

    // call logout from service
    AuthService.logout()
      .then(function () {
        $state.go('login')
      })
  }

  console.log($rootScope)
}

// LOGIN CONTROLLER:
function loginController($state, AuthService) {
  var vm = this
  vm.login = function () {

    // initial values
    vm.error = false
    vm.disabled = true

    // call login from service
    AuthService.login(vm.loginForm.username, vm.loginForm.password)
      // handle success
      .then(function () {
        console.log("Successful login...")
        $state.go('profile')
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
        $state.go('login')
      })
  }
}

// REGISTER CONTROLLER:
function registerController($state, AuthService) {
  var vm = this
  vm.register = function () {

    // initial values
    vm.error = false
    vm.disabled = true

    // call register from service
    AuthService.register(vm.registerForm.username, vm.registerForm.password)
      // handle success
      .then(function () {
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
  vm.avatarUrl = ''
  AuthService.getUserStatus()
    .then(function(data){
      vm.currentUser = data.data.user
      $http.get('/api/' + vm.currentUser._id)
        .success(function(data) {
          console.log(data)
          vm.currentUser = data
        })
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
        console.log(files)
        console.log("File:");
        console.log(file);
        console.log("File name:");
        console.log(file.name);
        console.log("Random name:");
        console.log(makeid() + "." + file.name.split('.').pop());
        file.randomName = vm.currentUser._id + "." + file.name.split('.').pop()
        console.log("New name:");
        console.log(file.name);
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
      .then(
        vm.avatarUrl = ""
        )
  }

}

function LogBeerController($http, AuthService, $rootScope){
  console.log("LogBeerController instantiated");
  AuthService.getUserStatus()
    .then(function(data){
      vm.currentUser = data.data.user
      $http.get('/api/' + vm.currentUser._id)
        .success(function(data) {
          console.log(data)
          vm.currentUser = data
        })
    })
  vm = this
  vm.logBeer = function(beer){
    console.log("logBeer function was activated");
    beer.review = {title: "", body: ""}
    beer.user = vm.currentUser._id
    console.log("Beer object:");
    console.log(beer);
    $http.post('/beers', {
      name: beer.name,
      color: beer.color,
      alcoholcontent: beer.alcoholcontent,
      bitter: beer.bitter,
      picture: beer.picture,
      user: beer.user,
      review: {title: beer.review.title,
              body: beer.review.body
      }
    })
      .then(function(){
        vm.avatarUrl = ""
      })
  }
}
