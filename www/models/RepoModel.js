(function() {

  var repoList= null;
  
  var RepoModel = function($http, $window) {

    /* Get repo list */
    var getRepoList = function(id) {
	    repoList = {
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