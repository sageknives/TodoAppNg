(function(){
  var myapp = angular.module("todoApp",["ngRoute", "ngTouch",'ui.bootstrap']);

  myapp.config(function($routeProvider){
    $routeProvider
      .when("/index", {
        templateUrl:"views/login.html",
        controller: "LoginController"
      })
      .when("/home", {
        templateUrl: "views/home.html",
        controller: "HomeController"
      })
      .when("/repo-list/:id",{
        templateUrl: 'views/repolist.html',
        controller: 'RepoListController'
      })
      .when("/todo-list/:id",{
        templateUrl: 'views/todolist.html',
        controller: 'TodoListController'
      })
      .otherwise({redirectTo:"/home"});
  });
  
  myapp.config(['$controllerProvider', function($controllerProvider) {
  $controllerProvider.allowGlobals();
}]);
}());