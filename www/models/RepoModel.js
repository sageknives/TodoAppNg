(function() {

  var repoList= null;
  
  var RepoModel = function($http, $window) {

    /* Get repo list */
    var getRepoList = function(id) {
	    repoList = {
            id: '2b',
            title: 'Repos',
            parentNode: null,
            complete: true,
            children: [
                {
                    id: '3c',
                    title: 'Services',
                    parentNode: null,
                    complete: false,
                    children: []
                },
                {
                    id: '4c',
                    title: 'android',
                    parentNode: null,
                    complete: false,
                    children: []
                },
                {
                    id: '5c',
                    title: 'memory leaks',
                    parentNode: null,
                    complete: false,
                    children: []
                }
            ]
       };
       return repoList;
    };
    
    var convertTodoToRepo = function(todo){
    	
    };

    var convertRepoToTodo = function(repo){
        
    };
    
    
    return {
      getRepoList: getRepoList,
      convertTodoToRepo: convertTodoToRepo,
      convertRepoToTodo: convertRepoToTodo
    };
  };

  var module = angular.module("todoApp");
  module.factory("RepoModel", RepoModel);
}());