var Tekpub = Tekpub || {};

Tekpub.MongoApp = function(){

  var init = function(appName, payload){
    //initialize the app
    app(appName, payload);
    //startup Angular
    angular.element(document).ready(function(){
      angular.bootstrap(document, [appName]);
    });
  }

  var app = function(appName, payload){

    var mongoApp = angular.module(appName,['ngResource']);
    mongoApp.config(function($routeProvider){
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

    mongoApp.provider("Media", function(){

      //config
      var resources = [];
      this.setResource = function(resourceName, url){
        var resource = {name : resourceName, url : url};
        resources.push(resource);
      }

      //injected
      this.$get = function($resource){
        var result = {};
        _.each(resources, function(resource){
          result[resource.name] = $resource(resource.url);
        });
        return result;
      }

    });
    mongoApp.config(function(MediaProvider){
      if(!payload) throw "Need to have mongoApi set please";
      for(var key in payload){
        MediaProvider.setResource(key, payload[key]);
      }
    });

    mongoApp.directive("deleteButton", Tekpub.Bootstrap.DeleteButton);
    mongoApp.directive("addButton", Tekpub.Bootstrap.AddButton);
    mongoApp.directive("breadcrumbs",Tekpub.Bootstrap.Breadcrumbs);

    mongoApp.controller("DocumentCtrl", function($scope,$routeParams, Media){
      $scope.documents = Media.document.query($routeParams);
    });
    mongoApp.controller("ListCtrl", function($scope, $routeParams, Media){

      var params = {
        database : $routeParams.database,
        collection : $routeParams.collection
      }

      var context = "root";
      if(params.database) context = "database";
      if(params.collection) context = "collection";

      $scope.items = Media[context].query($routeParams);

      $scope.addItem = function(){
        var newItemName = $scope.newItemName;
        if(newItemName){
          var newItem = new Media[context]({name : newItemName});
          newItem.$save(params);
          $scope.items.push(newItem);
        }
      }
      $scope.removeItem = function(item){
        if(confirm("Delete this " + context + "? There's no undo...")){
          var removeParams = {name : item.name};
          if($routeParams.database) removeParams.database = $routeParams.database;

          item.$delete(removeParams);
          $scope.items.splice($scope.items.indexOf(item),1)
        }
      }


    });
    return mongoApp;
  }

  return {
    start : init
  }

}();

