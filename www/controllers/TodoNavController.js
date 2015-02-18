(function(){
  var activeTodoNavList;
  var module = angular.module("todoApp");
	var loggedIn= false;
	var model = null;
	
    
  var TodoNavController = function($scope, $routeParams,$timeout,$location, todo){
  	model = todo.getModel();
  	$scope.activeNav = model.activeNav;
  	$scope.activeRepoList = model.repos;
  	$scope.activeList = model.activeList; 
	$scope.logItems = model.logItems;
	$scope.listOfTodos = model.listOfTodos;
	$scope.deleteTodo = todo.deleteTodo;
    if(loggedIn){
    	$scope.loggedIn = loggedIn;
    	//getData(todo,$scope);
        
    }else{
    	$scope.loggedIn = false;
    	$scope.loneButton = "loneButton";
    }
    $scope.loginError = '';
    
    
    
    $scope.logIn = function(){
    	var userName = angular.element(document.getElementById('username')).val();
    	var password = angular.element(document.getElementById('password')).val();
    	todo.logIn(userName,password)
    	.then(function(result){
    		if(result == 'invalid log in'){
    			$scope.loginError = result;
    		}
    		else{
    			todo.setLoginStatus(true);	
      			$scope.loggedIn = true;
		    	$scope.loneButton = '';
		      
		    	if(todo.hasModel()){
		      		model.todos = todo.getAll();
		      		$scope.todos = model.todos;
		      		console.log('has model');
		   	 	}	
		    	else{
		      		console.log('didn\' have model');
		      		todo.getAll()
		      		.then(function(result){
		      			model.todos = result;
		      			$scope.todos = model.todos;
		      			console.log('got model');
		      			$scope.activeList = model.activeList;
		      			$scope.logItems = model.logItems;
		      		});
		    	}
    		}
    		
    	});
    };
    
    
    $scope.change = function (node) {
    	if(node === null){
    		$scope.openNav("");
    		return;
    	}
        console.log(node.id);
        $scope.activeList.currentClass = "";
     	$timeout(function(){
     		node.currentClass = 'active';
        	$scope.activeList = node;
     	}, 200); 
    };
    $scope.updateViewNode = function (node, type) {
    	model.openNav('');
    	if(type == 'home'){
    		$location.path('/home');
    		return;
    	}
        console.log(node.id);
        model.currentNode = node;
        //todo.setNode(node);
        $location.path('/todo-'+type+'/'+node.id);
    };
    model.updateViewNode = $scope.updateViewNode;
    $scope.showOptions = function(node){
    	console.log(node.id);
    	var newSubMenu = 'list-bottom-' + node.id;
    	if(model.activeSubMenu == newSubMenu){
    		angular.element(document.getElementById(model.activeSubMenu)).removeClass('active');
    		model.activeSubMenu = "";
    	}
    	else{
    		angular.element(document.getElementById(model.activeSubMenu)).removeClass('active');
    		model.activeSubMenu = newSubMenu;
    		angular.element(document.getElementById(model.activeSubMenu)).addClass('active');
    	}
      };
      $scope.open = function($event) {
    	$event.preventDefault();
    	$event.stopPropagation();

    	$scope.opened = true;
  	  };
  	  $scope.close = function(){
      	  $scope.opened = false;
  	  };
  	  $scope.todoCompleteChange = function(node){
  	  	  todo.todoIsComplete(node);
  	  }
      $scope.addForm = function(node){
      	$scope.editAddNode = todo.createTodo("", "", Date.now(), node);

		  $scope.dateOptions = {
		    formatYear: 'yy',
		    startingDay: 1
		  };

  		$scope.format = 'M-dd-yyyy';
  		$scope.minDate = Date.now();
      	$scope.maxDate = node.dueDate;
      	$scope.previousMenu = model.activeNav;
      	$scope.parentAddNode = node;
      	$scope.openNav('addFormOpen');
      };
      model.addForm = $scope.addForm;
      $scope.submitAddForm = function(parent){
      	console.log('in submit add form');
      	
      	$scope.editAddNode.dueDate = $scope.editAddNode.dueDate.toISOString();
      	/*var title = angular.element(document.getElementById("add-todo-name")).val();
      	var desc = angular.element(document.getElementById("add-todo-desc")).val();
      	var dueDate = $scope.dt;*/
      	console.log('todo title: ' + $scope.editAddNode.title);
    	console.log('todo parent id: ' + $scope.editAddNode.parentNode.id);
    	console.log('todo due date: ' + $scope.editAddNode.dueDate);
    	console.log('todo description: ' + $scope.editAddNode.desc);
    	console.log('todo parent title:' + $scope.editAddNode.parentNode.title);
      	//var newTodo = todo.createTodo(title, desc, dueDate, parent);
      	todo.addTodo($scope.editAddNode);
      	$scope.openNav($scope.previousMenu);
      };
      $scope.moveForm = function(node){
      	$scope.moveNode = node;
      	$scope.previousMenu = model.activeNav;
      	$scope.openNav('moveFormOpen');
      	$scope.todoNode = node.parentNode;
      	
      };
      $scope.submitMoveForm = function(node,parent){
      	todo.moveTodo(node, parent);
      	$scope.openNav($scope.previousMenu);
      };
      $scope.editForm = function(node){
      	$scope.editAddNode = node;
      	$scope.openNav('addFormOpen');
      };
      model.editForm = $scope.editForm;
      $scope.errorWindow = function(message){
      	$scope.errorMessage = message + ' is not Implemented yet.';
      	$scope.openNav('error');
      };
    $scope.navClick = function(navClass){
      if(model.activeNav == navClass){
        //model.activeNav = "";
      }
      else{
        model.activeNav = navClass;
      }
    };
    
    $scope.openNav = function(nav){
    	if(model.activeNav == nav){
    		model.activeNav = "";
    		$scope.activeNav = "";
    	}
    	else{
    		model.activeNav = nav;
    		$scope.activeNav = nav;
    	}
    };
    model.openNav = $scope.openNav;
  }
  


  module.controller("TodoNavController",TodoNavController);
}());

  /*.directive('collection', function () {
	return {
		restrict: "E",
		replace: true,
		scope: {
			collection: '=' , member:'&'
		},
		template: "<div class='todo-list'>{{member}}<ul><member ng-repeat='member in collection' member='member'>hi</member></ul></div>"
	}
})

.directive('member', function ($compile) {
	return {
		restrict: "E",
		replace: true,
		scope: {
			member: '='
		},
		template: "<li>{{member.title}}</li>",
		link: function (scope, element, attrs) {
			if (angular.isArray(scope.member.children)) {
				element.append("<collection collection='member.children'></collection>"); 
				$compile(element.contents())(scope)
			}
		}
	}
})*/

/*  module.directive('todos', function($compile) {
  var tpl = '<div class="todo-list"><ol ui-sortable' +
    ' ng-model="value"' +
    ' class="list">' +
    '  <li ng-repeat="node in value | filter:search"' +
    '     <span class="muted">{{ node.title }}</span>' +
    '      ({{ node.children.length }} children)' +
      '     <a href="" class="blue" ng-click="onEdit({node: node})">edit</a>' +
      '     <todo value="node.children" on-edit="onEdit({node: node})"></todo>' +
    '  </li>' +
    '</ol></div>';
  firstNav = '';
  return {
    restrict: 'E',
    terminal: true,
      scope: { value: '=', onEdit: '&'},
    template: tpl,
    link: function(scope, element, attrs) {
        $compile(element.contents())(scope.$new());
    }
  };
});*/