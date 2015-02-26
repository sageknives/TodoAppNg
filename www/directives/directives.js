(function(){
  var module = angular.module("todoApp");

  module.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});

module.directive('todo', function($compile, $templateCache) {
  var tpl = '<div  id="listid-{{value.id}}" class="todo-list list-div {{value.currentClass}}">'+
    '     <div class="list-header list-item" ><a href="" ng-click="onTodoNavChange(value.parentNode, action)"><{{value.title}}</a>'+
    '<button class="list-item-button">add</button></div>'+
    '<ul><li id="listitem-{{node.id}}" class="list-item" ng-repeat="node in value.children | orderBy:\'complete\'"><div class="list-item-top">' +
    '<input class="list-item-checkbox" ng-if="node.complete == 1" type="checkbox" checked />'+
    '<input class="list-item-checkbox" ng-if="node.complete == 0" type="checkbox" />'+
    '<a class="list-item-title" ng-if="(node.children).length >= 1" href="" ng-click="change(value,node)">{{node.title}}</a>'+
    '<a class="list-item-title" ng-if="(node.children).length == 0" href="#/todo-view/{{node.id}}" class="blue" ng-click="onTodoNavChange(1, action, node)">{{node.title}} page</a>'+
    '<button ng-if="(node.children).length == 0" class="list-item-button">add</button>'+
    '<button ng-if="(node.children).length >= 1" class="list-item-button">view</button>'+
    '<button class="list-item-button" ng-click="openNav(node.id)">info</button>'+
    '</div><div id="list-bottom-{{node.id}}" class="list-item-bottom animate-element">'+
    '<button class="list-item-action green">share</button>'+
    '<button class="list-item-action gray">edit</button>'+
    '<button class="list-item-action blue">move</button>'+
    '<button class="list-item-action red">delete</button>'+
    '</div></li>' +
    '</ul></div>';
    //'<div ng-repeat="node in value.children"><todo ng-if="(node.children).length >= 1" value="node"  parent="value" action="action()"></todo></div>'+

	//<todo ng-if="(node.children).length >= 1" value="node"  parent="value" action="action()"></todo>
  return {
    restrict: 'E',
    transclude: true,
    terminal: true,
    replace: true,
      scope: { value: '=', action: '&', change:'='},
    template: tpl,
    //templateUrl: 'todolist.html',
    //template: $templateCache.get('todolist.html'),
    link: function(scope, element, attrs) {
        $compile(element.contents())(scope.$new());
    },
    controller: function($scope, todo){
      $scope.isComplete = function(number){
        if(number === 0) return 'checked';
      };
      $scope.openNav = function(id){
      	var listElement = angular.element(document.getElementById('list-bottom-' + id));
      	if(listElement.hasClass('active')) listElement.removeClass('active');
      	else listElement.addClass('active');
      };
      $scope.onTodoNavChange = function (value,node,action, nodepass) {
        //alert(node.id);
        if(node === null){
        	action();
        }
        else if(node == "1"){
          
          action();
          var oldCurrent = todo.getNode();
          oldCurrent.currentClass = '';
          nodepass.currentClass= 'active';
          todo.setNode(nodepass);
        }
        else{
          //var oldCurrent = todo.getActiveList();
          //oldCurrent.currentClass = '';
          value.currentClass = "";
          node.currentClass= 'active';
          //todo.setActiveList(node);
          //$scope.parent().activeList = node;
          value = node;
        }
      };
    }
  };
});


module.directive('todoss', function($compile, $templateCache) {
  var tpl = '<div><div  id="listid-{{value.id}}" class="todo-list list-div {{value.currentClass}}">'+
    '     <div class="list-header list-item" ><a href="" ng-click="onTodoNavChange(parent, action)"><{{value.title}}</a>'+
    '<button class="list-item-button">add</button></div>'+
    '<ul><li id="listitem-{{node.id}}" class="list-item" ng-repeat="node in value.children | orderBy:\'complete\'"><div class="list-item-top">' +
    '<input class="list-item-checkbox" ng-if="node.complete == 1" type="checkbox" checked />'+
    '<input class="list-item-checkbox" ng-if="node.complete == 0" type="checkbox" />'+
    '<a class="list-item-title" ng-if="(node.children).length >= 1" href="" ng-click="onTodoNavChange(node)">{{node.title}}</a>'+
    '<a class="list-item-title" ng-if="(node.children).length == 0" href="#/todo-view/{{node.id}}" class="blue" ng-click="onTodoNavChange(1, action, node)">{{node.title}} page</a>'+
    '<button ng-if="(node.children).length == 0" class="list-item-button">add</button>'+
    '<button ng-if="(node.children).length >= 1" class="list-item-button">view</button>'+
    '<button class="list-item-button" ng-click="openNav(node.id)">info</button>'+
    '</div><div id="list-bottom-{{node.id}}" class="list-item-bottom animate-element">'+
    '<button class="list-item-action green">share</button>'+
    '<button class="list-item-action gray">edit</button>'+
    '<button class="list-item-action blue">move</button>'+
    '<button class="list-item-action red">delete</button>'+
    '</div></li>' +
    '</ul></div>'+ 
    //'<div ng-repeat="node in value.children"><todo ng-if="(node.children).length >= 1" value="node"  parent="value" action="action()"></todo></div>'+
    '</div>';
	//<todo ng-if="(node.children).length >= 1" value="node"  parent="value" action="action()"></todo>
  return {
    restrict: 'E',
    transclude: true,
    terminal: true,
    replace: true,
      scope: { value: '=' , parent: '=', action:'&', getUl:'&'},
    template: tpl,
    //templateUrl: 'todolist.html',
    //template: $templateCache.get('todolist.html'),
    link: function(scope, element, attrs) {
        $compile(element.contents())(scope.$new());
    },
    controller: function($scope, todo){
    	$scope.getUl = function(node){
    		return '<p>Hi</p>';
    	};
      $scope.isComplete = function(number){
        if(number === 0) return 'checked';
      };
      $scope.openNav = function(id){
      	var listElement = angular.element(document.getElementById('list-bottom-' + id));
      	if(listElement.hasClass('active')) listElement.removeClass('active');
      	else listElement.addClass('active');
      };
      $scope.onTodoNavChange = function (node,action, nodepass) {
        //alert(node);
        if(node == "1"){
          
          action();
          todo.setNode(nodepass);
        }
        else{
          activeTodoNavList.currentClass = '';
          activeTodoNavList = node;
          node.currentClass = 'active';
          todo.setNode(node);
        }
      };
    }
  };
});


module.directive('todos', function($compile) {
  var tpl = '<a href="" class="blue" ng-click="onTodoNavChange(value)">{{value.title}}</a>';

  return {
    restrict: 'E',
    transclude: false,
    terminal: true,
      scope: { value: '=', parent: '='},
    template: tpl,
    link: function(scope, element, attrs) {
        $compile(element.contents())(scope.$new());
    },
    controller: function($scope){
      $scope.onTodoNavChange = function (node) {
        activeTodoNavList.currentClass = '';
        activeTodoNavList = node;
        node.currentClass = 'active';
      };
    }
  };
});

  
 
}());
