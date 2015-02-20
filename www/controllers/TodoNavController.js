(function(){
    var activeTodoNavList;
    var module = angular.module("todoApp");
    var loggedIn= false;


    var TodoNavController = function($scope, $routeParams,$timeout,$location, ModelManager, NavManager,ViewManager){

        $scope.activeNav = '';
        $scope.activeList = null;
        $scope.previousMenu= "";
        $scope.parentAddNode= null;
        $scope.currentNode = null;
        $scope.activeSubMenu = '';

  	     
        //shared nav
        $scope.updateViewNode = function (node, type) {
            console.log('start update view');
            $scope.openNav('');
            if(type == 'home'){
                $location.path('/home');
                return;
            }
            console.log(node.id);
            ViewManager.setCurrentNode(node);
            //todo.setNode(node);
            $location.path('/todo-list/'+node.id);
            console.log('redirected');
        };
        //shared nav
        $scope.addForm = function(node){
            $scope.editAddNode = $scope.createTodo("", "", Date.now(), node);
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
            $scope.noDueDate = false;
            $scope.format = 'M-dd-yyyy';
            $scope.minDate = Date.now();
            $scope.maxDate = node.dueDate;
            $scope.previousMenu = $scope.activeNav;
            $scope.parentAddNode = node;
            $scope.openNav('addFormOpen');
        };
        //shared nav
        $scope.editForm = function(node){
            $scope.editAddNode = node;
            $scope.noDueDate = node.dueDate === null;
            //if(node.dueDate === null){
            //    $scope.editAddNode.dueDate = new Date();
           // }
            
            $scope.openNav('addFormOpen');
        }; 
        //shared nav
        $scope.errorWindow = function(message){
            $scope.errorMessage = message + ' is not Implemented yet.';
            $scope.openNav('error');
        };
        //shared nav
        $scope.openNav = function(nav){
            if($scope.activeNav == nav){
                $scope.activeNav = "";
            }
            else{
                $scope.activeNav = nav;
            }
        };
        NavManager.setNav($scope);
        $scope.activeRepoList = ModelManager.getRepos();


        /*$scope.activeNav = model.activeNav;
        $scope.activeRepoList = ModelManager.getRepos();
        $scope.activeList = model.activeList; 
        $scope.logItems = model.logItems;
        $scope.listOfTodos = model.listOfTodos;
        $scope.deleteTodo = todo.deleteTodo;*/
        if(loggedIn){
            $scope.loggedIn = loggedIn;
    	   //getData(todo,$scope);
        }
        else{
    	   $scope.loggedIn = false;
    	   $scope.loneButton = "loneButton";
        }
        $scope.loginError = '';
    
        //in use
        //private nav
        $scope.logIn = function(){
    	   var userName = angular.element(document.getElementById('username')).val();
    	   var password = angular.element(document.getElementById('password')).val();
    	   ModelManager.login(userName,password)
    	       .then(function(result){
    		        if(result == 'invalid log in'){
    		          	$scope.loginError = result;
    		        }
    		        else{
                        console.log('got logged in');
                        $scope.loneButton = '';
                        $scope.todos = ModelManager.getTodoModel().todos;
                        $scope.logItems = ModelManager.getNotifications();
                        $scope.loggedIn = true;
                        ModelManager.getTodoActions($scope);
                        ModelManager.bindTodoVariables($scope);
                        console.log('got nav variables connected');
                    }
            });
        };
    
        //private nav maybe
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

        //private nav
        $scope.showOptions = function(node){
            console.log(node.id);
            var newSubMenu = 'list-bottom-' + node.id;
            if($scope.activeSubMenu == newSubMenu){
                angular.element(document.getElementById($scope.activeSubMenu)).removeClass('active');
                $scope.activeSubMenu = "";
            }
            else{
                angular.element(document.getElementById($scope.activeSubMenu)).removeClass('active');
                $scope.activeSubMenu = newSubMenu;
                angular.element(document.getElementById($scope.activeSubMenu)).addClass('active');
            }
        };

        //private nav
        //not sure in use
        $scope.open = function($event) {
    	    $event.preventDefault();
    	    $event.stopPropagation();
    	    $scope.opened = true;
        };

        //private nav
        //not sure in use
        $scope.close = function(){
            $scope.opened = false;
        };

        $scope.todoCompleteChange = function(node){
            todo.todoIsComplete(node);
        };

        //private nav
        $scope.updateDueDate = function(){
            if($scope.editAddNode.dueDate === null){
                $scope.editAddNode.dueDate = new Date();
            }
            else{
                $scope.editAddNode.dueDate = null;
            }
        };

        //private nav
        $scope.submitAddForm = function(parent){
            console.log('in submit add form');
            if($scope.noDueDate){
                $scope.editAddNode.dueDate = null;
            }
            else{
                $scope.editAddNode.dueDate = $scope.editAddNode.dueDate.toISOString();
            }
      	    console.log('todo title: ' + $scope.editAddNode.title);
            console.log('todo parent id: ' + $scope.editAddNode.parentNode.id);
            console.log('todo due date: ' + $scope.editAddNode.dueDate);
            console.log('todo description: ' + $scope.editAddNode.desc);
            console.log('todo parent title:' + $scope.editAddNode.parentNode.title);
      	    //var newTodo = todo.createTodo(title, desc, dueDate, parent);
      	    $scope.addTodo($scope.editAddNode);
      	    $scope.openNav($scope.previousMenu);
        };

        //private nav
        $scope.moveForm = function(node){
      	    $scope.moveNode = node;
      	    $scope.previousMenu = $scope.activeNav;
      	    $scope.openNav('moveFormOpen');
      	    $scope.todoNode = node.parentNode;
        };

        //private nav
        $scope.submitMoveForm = function(node,parent){
      	    $scope.moveTodo(node, parent);
      	    $scope.openNav($scope.previousMenu);
        };
    };

    module.controller("TodoNavController",TodoNavController);
}());