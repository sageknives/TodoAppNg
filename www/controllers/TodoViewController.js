(function(){
  var module = angular.module("todoApp");
	var model = null;

  
  var TodoViewController = function($scope, $routeParams,$timeout, $location, ModelManager, NavManager, ViewManager){
  	
    if(!ViewManager.hasCurrentNode()){
      $location.path('/home');
    }
    $scope.todolist = ViewManager.getCurrentNode();
    NavManager.connectNav($scope);

    ModelManager.getTodoActions($scope);
   	$scope.fullscreen = 'fullscreen';  
  };
  


  module.controller("TodoViewController",TodoViewController);
}());