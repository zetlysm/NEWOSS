'use strict';

// Declare app level module which depends on filters, and services
angular.module('app', [
  'ngRoute',
  'ngMaterial',
  'infinite-scroll']).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {  	
    templateUrl: 'partials/frontpage.html', 
  	controller: 'homeCtrl'
  });
  $routeProvider.when('/events', {
    templateUrl: 'partials/eventBrite.html', 
    controller: 'eventsController'
  });
  $routeProvider.when('/gallery', {
    templateUrl: 'partials/galleries.html', 
    controller: 'galleryController'
  });
  $routeProvider.when('/gallery/:name', {
    templateUrl: 'partials/gallery.html', 
    controller: 'galleryController'
  });
  $routeProvider.when('/admin', {
    templateUrl: 'partials/admin.html', 
    controller: 'adminController'
  });
  $routeProvider.when('/justknock', {
    templateUrl: 'partials/justknock.html', 
    controller: 'documentsController'
  });
  $routeProvider.when('/benefits', {
    templateUrl: 'partials/benefits.html', 
    controller: 'documentsController'
  });
  $routeProvider.when('/documents', {
    templateUrl: 'partials/documents.html', 
    controller: 'documentsController'
  });
  $routeProvider.when('/videos', {
    templateUrl: 'partials/videos.html', 
    controller: 'videosController'
  });
  $routeProvider.when('/news', {
    templateUrl: 'partials/news.html', 
    controller: 'newsController'
  });
  $routeProvider.otherwise({redirectTo: '/'});
  
}]).run(["$rootScope", function($rootScope){
}]);
