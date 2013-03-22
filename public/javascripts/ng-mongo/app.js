var ngMongo = angular.module("ngMongo",['ngResource']);

ngMongo.config(function($routeProvider){
  $routeProvider
      .when("/",{
        templateUrl : "list-template.html",
        controller : "ListCtrl"
      })
      .when("/:database", {
        templateUrl : "list-template.html",
        controller : "ListCtrl"
      })
      .when("/:database/:collection", {
        templateUrl : "document-template.html",
        controller : "DocumentCtrl"
      })
      .otherwise({
        template : "<h1>Not Found</h1>"
      })
  ;
});

ngMongo.factory("Mongo",function($resource){
  return {
    database : $resource("/mongo-api/dbs"),
    collection : $resource("/mongo-api/:database"),
    document : $resource("/mongo-api/:database/:collection")
  }
});

ngMongo.directive("deleteButton", Tekpub.Bootstrap.DeleteButton);
ngMongo.directive("addButton", Tekpub.Bootstrap.AddButton);
ngMongo.directive("breadcrumbs",Tekpub.Bootstrap.Breadcrumbs);


ngMongo.controller("DocumentCtrl", function($scope,$routeParams, Mongo){
  $scope.documents = Mongo.document.query($routeParams);
});

ngMongo.controller("ListCtrl", function($scope, $routeParams, Mongo){
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
