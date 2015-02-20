(function() {

  var log = null;
  
  var NotificationLog = function($http, $window) {

    /* Get repo list */
    var getNotificationLog = function(id) {
	    log = {
            id: '4',
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
            ]          
         };
       return log;
    };
    
    var addToLog = function(todo){
    	 log.children.push(todo);
    };
    
    return {
      getNotificationLog: getNotificationLog,
      addToLog: addToLog
    };
  };

  var module = angular.module("todoApp");
  module.factory("NotificationLog", NotificationLog);
}());