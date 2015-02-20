(function(){
    var module = angular.module("todoApp");
    var model = null;
    var HomeController = function($scope, $routeParams, $location,ModelManager, NavManager){
  	    //model = todo.getModel();

        NavManager.connectNav($scope);
        console.log('got home nav connected');
        ModelManager.bindTodoVariables($scope);
        console.log('got home variables connected');
    };
  
    module.controller("HomeController",HomeController);
}());