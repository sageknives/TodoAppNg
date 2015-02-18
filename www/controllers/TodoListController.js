(function(){
  var module = angular.module("todoApp");
  var model = null;	

  
  var TodoListController = function($scope, $routeParams,$location, todo){
  	var model = todo.getModel();
  	var node = model.currentNode;
  	if(node === null){
  		$location.path('/home');
  	}
    $scope.todolist = node;
    $scope.openNav = model.openNav;
    $scope.updateViewNode = model.updateViewNode;
    $scope.fullscreen = '';
    $scope.updateNav = function (navClass) {
        todo.notifyNav(navClass);
      };
  	$scope.editForm = model.editForm;
  	$scope.addForm = model.addForm; 
  };
  


  module.controller("TodoListController",TodoListController);
}());