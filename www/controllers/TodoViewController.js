(function(){
  var module = angular.module("todoApp");
	var model = null;

  
  var TodoViewController = function($scope, $routeParams,$timeout, $location, todo){
  	var model = todo.getModel();
  	var node = model.currentNode;
  	if(node === null){
  		$location.path('/home');
  	}
  	$scope.openNav = model.openNav;
  	$scope.updateViewNode = model.updateViewNode;
   	$scope.todo = node;   
   	$scope.fullscreen = 'fullscreen';   
    $scope.updateNav = function (navClass) {
        todo.notifyNav(navClass);
    };
  };
  


  module.controller("TodoViewController",TodoViewController);
}());