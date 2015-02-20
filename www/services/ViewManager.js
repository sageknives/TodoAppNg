(function() {
  
    var ViewManager = function() {
        var currentNode = null;

        var setCurrentNode = function(node){
            currentNode = node;
        };
        var getCurrentNode = function(){
            return currentNode;
        };
        var hasCurrentNode = function(){
            return currentNode !== null;
        };
  

        return {
            setCurrentNode: setCurrentNode,
            getCurrentNode: getCurrentNode,
            hasCurrentNode: hasCurrentNode
        };
    };

    var module = angular.module("todoApp");
    module.factory("ViewManager", ViewManager);
}());