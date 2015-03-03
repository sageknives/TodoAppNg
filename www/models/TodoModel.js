(function() {

    var todoModel = {
  	    todos: null,
        upcomingTodoList: {},
        listOfTodos: {},
        activeList: null,
        currentNode: null
    };
  
    /* C
    Also arrays should be dictionaries for easy sorting and deleting
    */
    var mytoken = {};
    var aWeekOut = new Date();
    aWeekOut.setDate(aWeekOut.getDate() + 7); 

    var TodoModel = function($http, $window) {

        var getAll = function(token) {
            mytoken = token;
            var request = $http({
                method: "post",
                url: 'http://sagegatzke.com/todosajax/services.php',
                data: {
                    token: token,
                    action: 'getall'
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            return request.then(function (data) {
                    console.log('tree true');
                    todoModel.todos = makeTree(null, data.data);
                    return;
            });
            /*mytoken = token;
	        return $http.get("http://sagegatzke.com/todosajax/services.php/?action=getall&token=" + token)
	            .then(function(data, status, headers, config) {
	      	        todoModel.todos = makeTree(null, data.data);
	      	        return;
	            });*/
        }; 
        var addTodo = function(todo){
            todo.lastUpdated = new Date().toISOString();
        	if(todo.id == "") {
        		todo.parentNode.children.push(todo);
        		if(todo.parentNode.complete){
    	    		todo.parentNode.complete = false;
    	    		todoIsComplete(todo.parentNode);
    	    	}
    	    	
        	}
            if(todo.dueDate !== null && todo.dueDate.toISOString() <= aWeekOut.toISOString()){
                todoModel.upcomingTodoList[todo.id] = todo;
            }
            else{
                delete todoModel.upcomingTodoList[todo.id];
            }
        	var request = $http({
                method: "post",
                url: 'http://sagegatzke.com/todosajax/services.php',
                data: {
                    token: mytoken,
                    action: 'add',
                    treeId: todo.parent,
                    name: todo.title,
                    info: todo.desc,
                    duedate: todo.dueDate,
                    lastupdated: todo.lastUpdated,
                    todoid: todo.id
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            return request.then(function (data) {
                    todo.id = data.data.id;
                    todo.createdBy = data.data.createdby;
                    todoModel.listOfTodos['hash'+todo.id] = todo;
            });
            /*
        	$http.get("http://sagegatzke.com/todosajax/services.php/?action=add&token=" + mytoken + "&treeId=" + todo.parent + "&name=" + todo.title + "&info=" + todo.desc + "&date=" + todo.dueDate + "&lastupdated=" + todo.lastUpdated + "&todoid=" + todo.id )
    	        .then(function(data, status, headers, config) {
    	      	    todo.id = data.data.id;
    	      	    todo.createdBy = data.data.createdby;
    	        });
                */   	      
        };   
        var createTodo = function(title, desc, dueDate, parent){
    		dueDate = new Date(dueDate);
        	var todo = {
    	   	    id: "",
    		    title: title,
    		    parentNode: parent,
    		    parent: parent.id,
    		    complete: false,
    		    lastUpdated: new Date(),
    		    desc: desc,
    		    images: [],
    		    dueDate: dueDate,
    		    createdBy: "",
    		    currentClass: "",
    		    children: []
    	    };
    	    return todo;
        };
        var createTodoFromTodo = function(node){
            
            var todo = {
                id: node.id,
                title: node.title,
                parentNode: node.parentNode,
                parent: node.parent,
                complete: node.complete,
                lastUpdated: new Date(),
                desc: node.desc,
                images: [],
                dueDate: node.dueDate,
                createdBy: node.createdBy,
                currentClass: node.currentClass,
                children: node.children
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
        	node.parent = newParent.id;
        	node.parentNode = newParent;
        	node.lastUpdated = new Date().toISOString();
        	newParent.children.push(node);
        	if(node.parentNode.complete != node.complete && !node.complete){
        		node.parentNode.complete = false;
        		todoIsComplete(node.parentNode);
        	}
            node.lastUpdated = new Date().toISOString();
            var request = $http({
                method: "post",
                url: 'http://sagegatzke.com/todosajax/services.php',
                data: {
                    token: mytoken,
                    action: 'move',
                    treeId: node.id,
                    parent: node.parent,
                    lastupdated: node.lastUpdated
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            return request.then(function (data) {
                    console.log('todo moved');
            });
        	/*$http.get("http://sagegatzke.com/todosajax/services.php/?action=move&token=" + mytoken + "&treeId=" + node.id + "&parent=" + node.parent + "&lastupdated=" + node.lastUpdated)
    	      .then(function(data, status, headers, config) {
                console.log('todo moved');
    	      });*/
        };
        var convertBoolToNum = function(value){
        	if(value) return 1;
        	else return 0;
        };
        var todoIsComplete = function(node){
        	if(node.dueDate <= aWeekOut){
                if(node.complete){
                    delete todoModel.upcomingTodoList[node.id];
                }
                else{
                    todoModel.upcomingTodoList[node.id] = node;
                }
            }
        	node.lastUpdated = new Date().toISOString();
            var request = $http({
                method: "post",
                url: 'http://sagegatzke.com/todosajax/services.php',
                data: {
                    token: mytoken,
                    action: 'complete',
                    treeId: node.id,
                    complete: convertBoolToNum(node.complete),
                    lastupdated: node.lastUpdated
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            request.then(function (data) {
                console.log('todo complete:' + node.complete);
            });
        	/*$http.get("http://sagegatzke.com/todosajax/services.php/?action=complete&token=" + mytoken + "&treeId=" + node.id + "&complete=" + convertBoolToNum(node.complete) + "&lastupdated=" + node.lastUpdated)
    	      .then(function(data, status, headers, config) {
    	      });
            */
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
            //TODO: needs to update server and up coming list etc
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
        var getModel = function(){
            return todoModel;
        };
        var getUpcoming = function(){
    	    if(upcomingTodoList.length){
    		    return upcomingTodoList;
    	    }
    	    else{
    		    return [{title:'all caught up'}];
    	    }
        };
        var convertDateForTree = function(stringDate){
            if(stringDate === null || stringDate == '0000-00-00 00:00:00') return null;
            return new Date(stringDate);
        };
        var makeTree = function(parent, data){

        	var node = {
        		id: data.id,
        		title: data.title,
        		parentNode: parent,
        		parent: data.parent,
        		complete: data.complete == 1,
        		lastUpdated: convertDateForTree(data.lastupdated),
        		desc: data.desc,
        		images: data.images,
        		dueDate: convertDateForTree(data.duedate),
        		createdBy: data.createdby,
        		currentClass: "",
        		children: []
        	};
            if(parent !== null){
                if(data.children.length >= 0){
                    todoModel.listOfTodos['hash'+node.id] = node;
                }

                if(!node.complete && node.dueDate !== null && node.dueDate <= aWeekOut){
                    todoModel.upcomingTodoList[node.id] = node;
                }
            }   

        	if(parent === null){
        		node.currentClass = 'active';
        		todoModel.activeList = node;
        		todoModel.currentNode = node;
        	}
        	else{
        		parent.children.push(node);
        	}
        	getChildrenNodes(node,data);
        	return node;
        };
        var getChildrenNodes = function(parent, data){
        	if(data.children.length == 0){
        		return;
        	}
        	for(var i=0;i<data.children.length;i++){
        		makeTree(parent, data.children[i]);
        	}
        	return;
        }; 
        var getActions = function(viewScope){
            viewScope.addTodo = addTodo;
            viewScope.moveTodo = moveTodo;
            viewScope.deleteTodo = deleteTodo;
            viewScope.completeTodo = todoIsComplete;
            viewScope.createTodo = createTodo;
            viewScope.createTodoFromTodo = createTodoFromTodo;
        };
        var bindTodoVariables = function(viewScope){
            viewScope.upcomingTodoList = todoModel.upcomingTodoList;
            viewScope.listOfTodos = todoModel.listOfTodos;
            viewScope.activeList = todoModel.activeList;
            viewScope.currentNode = todoModel.currentNode;
        };

        var checkForUpdates = function(){
            var lastTimeChecked = new Date();
            console.log('now is ' + lastTimeChecked);
            //lastTimeChecked.setMinutes(lastTimeChecked.getMinutes() + 1);
            //lastTimeChecked.setHours(lastTimeChecked.getHours() + 1);
            //lastTimeChecked.setDate(lastTimeChecked.getDate() +1); 
            //console.log('60 seconds ago was ' + lastTimeChecked);
            var request = $http({
                method: "post",
                url: 'http://sagegatzke.com/todosajax/services.php',
                data: {
                    token: mytoken,
                    action: 'getnew',
                    jstime: lastTimeChecked
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            request.then(function (data) {
                var newItems = data.data;
                console.log('check for updates since last update');
                if(newItems !=  'no updates') asyncUpdateTree(newItems);
                console.log('async update done');

            });
            
        };

        var asyncUpdateTree = function(items){
            for(var i =0; i<items.length;i++){
                var id = items[i].id;
                var listItem = todoModel.listOfTodos['hash'+id];
                if(typeof listItem === "undefined"){
                    listItem = createAsyncTodo(items[i]);
                }
                else if(listItem.id == id){
                    updateAsyncTodo(listItem,items[i]);
                }
                
                if(listItem.dueDate <= aWeekOut)
                {
                    if(listItem.complete){
                        delete todoModel.upcomingTodoList[listItem.id];
                    }
                    else{
                        todoModel.upcomingTodoList[listItem.id] = listItem;
                    }
                }
            }
        };

        var updateAsyncTodo = function(a,b){
            a.title = b.title;
            a.desc = b.desc;
            a.dueDate = convertDateForTree(b.duedate);
            a.lastUpdated = convertDateForTree(b.lastupdated);
            a.complete = b.complete == 1;
            a.images = b.images;

            if(a.parent != b.parent){
                a.parent = b.parent;
                for(var i=0;i<a.parentNode.children.length;i++){
                    if(a.parentNode.children[i].id == a.id){
                        a.parentNode.children.splice(i,1);
                        break;
                    }
                }
                a.parentNode = todoModel.listOfTodos['hash'+a.parent];
                todoModel.listOfTodos['hash'+a.parent].children.push(a);
            }
        };

        var createAsyncTodo = function(data){
            var node = {
                id: data.id,
                title: data.title,
                parentNode: todoModel.listOfTodos['hash'+data.parent],
                parent: data.parent,
                complete: data.complete == 1,
                lastUpdated: convertDateForTree(data.lastupdated),
                desc: data.desc,
                images: data.images,
                dueDate: convertDateForTree(data.duedate),
                createdBy: data.createdby,
                currentClass: "",
                children: []
            };
            node.parentNode.children.push(node);
            return node;
        };

    return {
        getAll: getAll,
        getUpcoming:getUpcoming,
        getModel:getModel,
        getActions:getActions,
        bindTodoVariables:bindTodoVariables,
        checkForUpdates:checkForUpdates
    };
  };

  var module = angular.module("todoApp");
  module.factory("TodoModel", TodoModel);
}());

/*

    var getModel = function(){
        return todoModel;
    };

    var hasModel = function(){
        return todoModel.todos !== null;
    };
    
    var getNode = function(id){
        //if(id === null){
        //  currentNode = findNode(id);
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
var setLoginStatus = function(status){
        loggedInStatus = status;
    };
    //search tree 
    var findNode = function(id){
        if(currentNode.id == id) return currentNode;    
    };
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
            todoModel.upcomingTodoList.push(node);
        }
        if(parent === null){
            node.currentClass = 'active';
            todoModel.currentNode = node;
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
        return this.getUTCFullYear() + "-" + twoDigits(1 
            + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " 
            + twoDigits(this.getHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" 
            + twoDigits(this.getUTCSeconds());
    };

    */