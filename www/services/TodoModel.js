(function() {

  var model = {
  	todos: null,
  	repos: {
			id: '2',
        	title: 'Repos',
        	parentNode: null,
        	complete: true,
        	children: [
        		{
        			id: '3',
        			title: 'Services',
        			complete: false,
        			children: []
        		},
        		{
        			id: '4',
        			title: 'android',
        			complete: false,
        			children: []
        		},
        		{
        			id: '5',
        			title: 'memory leaks',
        			complete: false,
        			children: []
        		}
        	]
       },
       logItems:{
				title: 'WorkLog',
	        	children: [
	        		{
	        			id: '3',
	        			title: 'Leash',
	        			complete: false,
	        			children: []
	        		},
	        		{
	        			id: '4',
	        			title: 'Swipe Menus',
	        			complete: false,
	        			children: []
	        		},
	        		{
	        			id: '5',
	        			title: 'put in images',
	        			complete: false,
	        			children: []
	        		}
	        	],
	        	id: '4'
	        
	       },
     upcomingTodoList: [],
     activeList: null,
     loggedInStatus: false,
     currentNode: null, 
     activeNav: "",
     activeSubMenu: '',
     openNav: null,
     updateViewNode: null,
     previousMenu: "",
     parentAddNode: null,
     listOfTodos: [],
     addForm: null,
     editForm: null
  };
  

  /* Code needs refactoring
  Also arrays should be dictionaries for easy sorting and deleting
  */
  //var currentNode = null;
  //var upcomingTodoList = [];
  //var activeList;
  var mytoken = '54359';
  //var navNotifier;
  //var setUpcomingTodolist;
  
  //var loggedInStatus = true;
  var todo = function($http, $window) {

    var getAll = function(token) {
	    return $http.get("http://sagegatzke.com/todosajax/services.php/?action=getall&token=" + mytoken)
	      .then(function(data, status, headers, config) {
	      	console.log('got data');
	      	
	      	return makeTree(null, data.data);
	        
	      });
    };
    
    var addTodo = function(todo){
    	console.log('todo title: ' + todo.title);
    	console.log('todo parent id: ' + todo.parent);
    	console.log('todo due date: ' + todo.dueDate);
    	console.log('todo last updated: ' + todo.lastUpdated);
    	console.log('todo description: ' + todo.desc);
    	console.log('todo parent title:' + todo.parentNode.title);
    	if(todo.id == "") {
    		todo.parentNode.children.push(todo);
    		if(todo.parentNode.complete){
	    		todo.parentNode.complete = false;
	    		todoIsComplete(todo.parentNode);
	    	}
	    	model.listOfTodos.push(todo);
    	}
    	
    	$http.get("http://sagegatzke.com/todosajax/services.php/?action=add&token=" + mytoken + "&treeId=" + todo.parent + "&name=" + todo.title + "&info=" + todo.desc + "&date=" + todo.dueDate + "&lastupdated=" + todo.lastUpdated + "&todoid=" + todo.id )
	      .then(function(data, status, headers, config) {
	      	console.log('got data');
	      	console.log(data.data);
	      	todo.id = data.data.id;
	      	todo.createBy = data.data.createdby;
	        
	      });
	      
    };
    
    var createTodo = function(title, desc, dueDate, parent){
    	var timeStamp = getTimeStamp();
		dueDate = new Date(dueDate).toMysqlFormat();
    	var todo = {
    		id: "",
    		title: title,
    		parentNode: parent,
    		parent: parent.id,
    		complete: false,
    		lastUpdated: timeStamp,
    		desc: desc,
    		images: [],
    		dueDate: dueDate,
    		createdBy: "",
    		currentClass: "",
    		children: []
    	};
    	return todo;
    };
    
    var moveTodo = function(node, newParent){
    	var children = node.parentNode.children;
    	for(var i = 0; i < children.length; i++){
    		if(node.id ==  children[i].id){
    			children.splice(i, 1);
    			break;
    		}
    	}
    	if(!node.parentNode.complete){
    		var parentIsComplete = true;
    		for(var i = 0; i < node.parentNode.children.length; i++){
    			if(!node.parentNode.children[i].complete){
    				parentIsComplete = false;
    			}
    		}
    		if(parentIsComplete){
    			node.parentNode.complete = true;
    			todoIsComplete(node.parentNode);
    		}
    	}
    	console.log('past find loop');
    	//node.parent.children.remove(node);
    	node.parent = newParent.id;
    	node.parentNode = newParent;
    	node.lastUpdated = getTimeStamp();
    	newParent.children.push(node);
    	if(node.parentNode.complete != node.complete && !node.complete){
    		node.parentNode.complete = false;
    		todoIsComplete(node.parentNode);
    	}
    	$http.get("http://sagegatzke.com/todosajax/services.php/?action=move&token=" + mytoken + "&treeId=" + node.id + "&parent=" + node.parent + "&lastupdated=" + node.lastUpdated)
	      .then(function(data, status, headers, config) {
	      	console.log('got data moved');
	      	console.log(data.data);
	      });
    };
    var convertBoolToNum = function(value){
    	if(value) return 1;
    	else return 0;
    };
    var todoIsComplete = function(node){
    	
    	node.lastUpdated = getTimeStamp();
    	console.log(node.complete);
    	$http.get("http://sagegatzke.com/todosajax/services.php/?action=complete&token=" + mytoken + "&treeId=" + node.id + "&complete=" + convertBoolToNum(node.complete) + "&lastupdated=" + node.lastUpdated)
	      .then(function(data, status, headers, config) {
	      	console.log('todo completion has been updated');
	      });
	    if(!node.complete && node.parentNode !== null && node.parentNode.complete){
	    	node.parentNode.complete = false;
    		todoIsComplete(node.parentNode);
    	}
    	if(node.complete && node.parentNode !== null && !node.parentNode.complete){
    		var allChildrenComplete = true;
    		for(var i = 0; i < node.parentNode.children.length; i++){
    			if(!node.parentNode.children[i].complete){
    				allChildrenComplete = false;
    				break;
    			}
    		}
    		if(allChildrenComplete){
    			node.parentNode.complete = true;
    			todoIsComplete(node.parentNode);
    		}
    	}
    };
    
    var deleteTodo = function(todo){
    	for(var i=0;i< todo.parentNode.children.length;i++){
    		if(todo.id == todo.parentNode.children[i].id){
    			todo.parentNode.children.splice(i,1);
    			break;
    		}
    	}
    	todoDeleteList = [];
    	deleteNodeChild(todo,todoDeleteList);
    	alert(todoDeleteList.toString());
    };
    
    var deleteNodeChild = function(todo,todoDeleteList){
    	for(var i=0;i<todo.children.length;i++){
    		deleteNodeChild(todo.children[i],todoDeleteList);
    	}
    	todoDeleteList.push(todo.id);
    	todo.parentNode = null;
    	todo.children = null;
    	todo = null;
    };
    var getTimeStamp = function(){
    	var timeStamp = new Date();
    	return timeStamp.toMysqlFormat();
    	
    };
    var convertDateTime = function(date){
    	return date.toMysqlFormat();
    };
    //part of date to sql format  
    var twoDigits = function(d) {
    	if(0 <= d && d < 10) return "0" + d.toString();
    	if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    	return d.toString();
	};
 
	Date.prototype.toMysqlFormat = function() {
    	return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
	};
    
    var getModel = function(){
    	return model;
    };

	var hasModel = function(){
		return model.todos !== null;
	};
    var login = function(userName,password) {
    	var url = "http://sagegatzke.com/todosajax/services.php/?username="+ userName +"&password=" +password;
      return $http.get(url)
        .then(function(data, status, headers, config) {
        	if(data.data > 0){
        		 mytoken = data.data;
        		 model.loggedInStatus = true;
        	}
         	else{
         		mytoken = "invalid log in";
         	}
          ///console.write(mytoken);
          return mytoken;
        });
    };
    
    var getNode = function(id){
    	//if(id === null){
    	//	currentNode = findNode(id);
    	//}
      	return currentNode;
    };
    
    var setNode = function(node){
      currentNode = node;
    };
    var getActiveList = function(){
      return activeList;
    };
    
    var setActiveList = function(list){
      activeList = list;
    };
    var isLoggedIn = function(){
    	return loggedInStatus;
    };
    var setUpComingTodos = function(action){
    	setUpcomingTodolist = action;
    }
    var getUpcomingTodos = function(){
    	if(upcomingTodoList.length){
    		return setUpcomingTodolist(upcomingTodoList);
    	}
    	else{
    		return [{title:'all caught up'}];
    	}
    };
    var setLoginStatus = function(status){
    	loggedInStatus = status;
    };
    //search tree 
    var findNode = function(id){
    	if(currentNode.id == id) return currentNode;
    	
    };
    //private tree builder
    var makeTree = function(parent, data){
    	var node = {
    		id: data.id,
    		title: data.title,
    		parentNode: parent,
    		parent: data.parent,
    		complete: data.complete == 1,
    		lastUpdated: new Date(data.lastupdated),
    		desc: data.desc,
    		images: data.images,
    		dueDate: new Date(data.duedate),
    		createdBy: data.createdby,
    		currentClass: "",
    		children: []
    	};
    	if(parent !== null && data.children.length >= 1){
    		model.listOfTodos.push(node);
    	}
    	if(!node.complete && node.parentNode !== null){
    		model.upcomingTodoList.push(node);
    	}
    	if(parent === null){
    		node.currentClass = 'active';
    		model.activeList = node;
    		model.currentNode = node;
    		console.log('top found and set to active');
    	}
    	else{
    		parent.children.push(node);
    	}
    	getChildrenNodes(node,data);
    	return node;
    }
    var getChildrenNodes = function(parent, data){
    	if(data.children.length == 0){
    		return;
    	}
    	for(var i=0;i<data.children.length;i++){
    		makeTree(parent, data.children[i]);
    	}
    	return;
    }
    
    //private tree to list builder
    var makeListFromTree = function(parent,data,list){
    	var node = {
    		id: data.id,
    		title: data.title,
    		parentNode: parent,
    		parent: data.parent,
    		complete: data.complete,
    		lastUpdated: data.lastupdated,
    		desc: data.desc,
    		images: data.images,
    		dueDate: data.duedate,
    		createdBy: data.createdby,
    		currentClass: "",
    		children: []
    	};
    	if(node.complete == 0){
    		upcomingTodoList.push(node);
    	}
    	if(parent === null){
    		node.currentClass = 'active';
    		currentNode = node;
    		console.log('top found and set to active');
    	}
    	else{
    		parent.children.push(node);
    	}
    	list = getChildrenFromTreeNode(node,data,list);
    	for(var i = 0; i <list.children.length;i++){
    		node.children.push(list.children[i]);	
    	}
    	list.list.push(node);
    	return list;
    };
    var getChildrenFromTreeNode = function(parent,data, list){
    	if(data.children.length == 0){
    		list.children = [];
    		return list;
    	}
    	for(var i=0;i<data.children.length;i++){
    		list = makeListFromTree(parent, data.children[i], list);
    	}
    	return list;
    };
    return {
      getAll: getAll,
      logIn: login,
      getNode: getNode,
      setNode: setNode,
      getActiveList: getActiveList,
      setActiveList: setActiveList,
      isLoggedIn: isLoggedIn,
      setLoginStatus: setLoginStatus,
      hasModel: hasModel,
      getModel: getModel,
      getUpcomingTodos: getUpcomingTodos,
      setUpComingTodos: setUpComingTodos,
      createTodo: createTodo,
      addTodo: addTodo,
      moveTodo: moveTodo,
      todoIsComplete: todoIsComplete,
      convertDateTime: convertDateTime,
      deleteTodo: deleteTodo
    };
  };

  var module = angular.module("todoApp");
  module.factory("todo", todo);
}());