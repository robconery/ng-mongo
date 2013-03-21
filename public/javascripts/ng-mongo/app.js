var ngMongo = angular.module("ngMongo",['ngResource']);

ngMongo.config(function($routeProvider){
  $routeProvider
      .when("/",{
        templateUrl : "list-template.html",
        controller : "ListCtrl"
      })
  ;
});

ngMongo.factory("Mongo",function($resource){
  return {
    database : $resource("/mongo-api/dbs"),
    collection : $resource("/mongo-api/:database")
  }
});

ngMongo.directive("deleteButton", Tekpub.Bootstrap.DeleteButton);
ngMongo.directive("addButton", Tekpub.Bootstrap.AddButton);

ngMongo.controller("ListCtrl", function($scope, $routeParams, Mongo){
  console.log($routeParams);
  var context = "database";
  if($routeParams.database) context = "collection";

  $scope.items = Mongo[context].query($routeParams);

  $scope.addItem = function(){
    var newItemName = $scope.newItemName;
    if(newItemName){
      var newItem = new Mongo[context]({name : newItemName});
      newItem.$save($routeParams);
      $scope.items.push(newItem);
    }
  }
  $scope.removeItem = function(item){
    if(confirm("Delete this " + context + "? There's no undo...")){
      var params = {name : item.name};
      if($routeParams.database) params.database = $routeParams.database;

      item.$delete(params);
      $scope.items.splice($scope.items.indexOf(item),1)
    }
  }


});
