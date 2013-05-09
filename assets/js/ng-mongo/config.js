Tekpub.MongoApp = function(){
  //start 'em up
  var start = function(appName, payload){
    //initialize the app
    var module = init(appName, payload);

    //startup Angular
    angular.bootstrap(document, [appName]);
    return module;
  };
  var init = function(appName, payload){

    //create the module
    var mongoApp = angular.module(appName,['ngResource']);

    //configure routes
    mongoApp.config(['$routeProvider',function($routeProvider){
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
          .when("/:database/:collection/:id", {
            templateUrl : "editor-template.html",
            controller : "EditorCtrl"
          })
          .otherwise({
            template : "<h1>Not Found</h1>"
          })
      ;
    }]);

    //set the provider for Mongo
    mongoApp.provider("Media", Tekpub.MediaProvider);

    //configure the provider
    mongoApp.config(['MediaProvider',function(MediaProvider){
      if(!payload) throw "Need to have mongoApi set please";
      MediaProvider.setResources(payload);
    }]);

    //wireup the directives
    mongoApp.directive("deleteButton", Tekpub.Bootstrap.DeleteButton);
    mongoApp.directive("addButton", Tekpub.Bootstrap.AddButton);
    mongoApp.directive("breadcrumbs",Tekpub.Bootstrap.Breadcrumbs);

    //wireup the filters
    mongoApp.filter("mongolink", Tekpub.Mongo.MongoLink);
    mongoApp.filter("descriptivename", Tekpub.DescriptiveName);

    //wireup the controllers
    mongoApp.controller("ListCtrl", Tekpub.Mongo.ListController);
    mongoApp.controller("DocumentCtrl", Tekpub.Mongo.DocumentController);
    mongoApp.controller("EditorCtrl", Tekpub.Mongo.EditorController);
    return mongoApp;
  };
  return {
    start : start
  }
}();

