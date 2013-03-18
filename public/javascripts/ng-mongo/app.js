var ngMongo = angular.module("ngMongo",['ngResource']);


ngMongo.factory("Mongo",function($resource){
  return {
    database : $resource("/mongo-api/dbs")
  }
});

ngMongo.controller("ListCtrl", function($scope, Mongo){
  //http get returns a promise...
  $scope.items = Mongo.database.query();
  $scope.addDb = function(){
    var dbName = $scope.newDbName;
    if(dbName){
      var newDb = new Mongo.database({name : dbName});
      newDb.$save();
      $scope.items.push(newDb);
    }
  }
  $scope.removeDb = function(db){
    if(confirm("Delete this database? There's no undo...")){
      db.$delete({name : "name"});
      $scope.items.splice($scope.items.indexOf(db),1)
    }
  }


});
