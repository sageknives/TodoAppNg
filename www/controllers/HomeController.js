(function(){
  
  var module = angular.module("todoApp");
  var model = null;
  var HomeController = function($scope, $routeParams, $location,todo){
  	model = todo.getModel();
  	$scope.openNav = model.openNav;
  	$scope.updateViewNode = model.updateViewNode;
  	$scope.upcomingTodos = model.upcomingTodoList;
    
    $scope.updateNav = function (navClass) {
        model.activeNav = navClass;
    };
    
    /*$scope.updateViewNode = function (node, type) {
    	if(type == 'home'){
    		$location.path('/home');
    		return;
    	}
    	$scope.openNav = "";
        console.log(node.id);
        model.currentNode = node;
        //todo.setNode(node);
        $location.path('/todo-'+type+'/'+node.id);
    };*/
  };
  
  


  module.controller("HomeController",HomeController);
}());