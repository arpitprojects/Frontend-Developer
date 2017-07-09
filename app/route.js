radioOn.config([ '$routeProvider' , '$locationProvider' ,  function($routeProvider , $locationProvider){
    $routeProvider
     
     .when('/playlist' , {
        templateUrl : 'public/playlist.html',
        controller : 'playlistController'
    })
      .when('/home' , {
        templateUrl : 'public/home.html',
        controller : 'homeController'
    }) 
    .otherwise({
       redirectTo :  '/home'
    }); 
    
    $locationProvider.hashPrefix('');
}]);