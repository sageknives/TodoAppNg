(function(){
  var app = angular.module("todoApp",["ngRoute", "ngTouch",'ui.bootstrap']);

  app.config(function($routeProvider){
    $routeProvider
      .when("/index", {
        templateUrl:"views/login.html",
        controller: "LoginController"
      })
      .when("/home", {
        templateUrl: "views/home.html",
        controller: "HomeController"
      })
      .when("/todo-view/:id",{
        templateUrl: 'views/todoview.html',
        controller: 'TodoViewController'
      })
      .when("/todo-list/:id",{
        templateUrl: 'views/todolist.html',
        controller: 'TodoListController'
      })
      .otherwise({redirectTo:"/home"});
  });
  
  app.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
}());