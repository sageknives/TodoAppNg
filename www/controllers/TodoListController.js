(function(){
  var module = angular.module("todoApp");
  var model = null;	

  
  var TodoListController = function($scope, $routeParams,$location, ModelManager, NavManager, ViewManager){

    if(!ViewManager.hasCurrentNode()){
      $location.path('/home');
    }
    $scope.todolist = ViewManager.getCurrentNode();
    NavManager.connectNav($scope);

    ModelManager.getTodoActions($scope);
    $scope.fullscreen = '';
  };
  


  module.controller("TodoListController",TodoListController);
}());