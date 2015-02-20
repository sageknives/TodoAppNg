(function() {

    var models = {
        upcomingTodoList: {},
        activeList: null,
        loggedInStatus: false,
        listOfTodos: {}
    };
  
    var ModelManager = function($http, $window, NotificationLog, RepoModel, TodoModel ) {
        var mytoken = '';
        var login = function(userName,password) {
            var url = "http://sagegatzke.com/todosajax/services.php/?username="+ userName +"&password=" +password;
            return $http.get(url)
            .then(function(data, status, headers, config) {
                if(data.data > 0){
                    console.log('login true');
                    mytoken = data.data;
                    models.loggedInStatus = true;
                    return TodoModel.getAll(mytoken)
                    .then(function(result){
                        console.log('added todos');

                        return mytoken;
                    });
                }
                else{
                    mytoken = "invalid log in";
                }
                return mytoken;
            });
        };

        var getTodoModel = function(){
            return TodoModel.getModel();
        };
        var getTodoActions = function(viewScope){
            TodoModel.getActions(viewScope);
        };
        var bindTodoVariables = function(viewScope){
            TodoModel.bindTodoVariables(viewScope);
        };
        
        var getRepos = function(){
            return RepoModel.getRepoList();
        };
        var getNotifications = function(){
            return NotificationLog.getNotificationLog();
        };
    
        return {
            login:login,
            getTodoModel:getTodoModel,
            getTodoActions:getTodoActions,
            bindTodoVariables:bindTodoVariables,
            getRepos:getRepos,
            getNotifications:getNotifications
        };
    
    };

    var module = angular.module("todoApp");
    module.factory("ModelManager", ModelManager);
}());