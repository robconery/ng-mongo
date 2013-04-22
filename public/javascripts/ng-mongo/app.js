var Tekpub = Tekpub || {};

Tekpub.MongoApp = function(){

  //services
  var mediaProvider = function(){

    //config
    var resources = [];
    this.setResources = function(resourceDefinition){
      for(var key in resourceDefinition){
        this.setResource(key, resourceDefinition[key]);
      }
    }
    this.setResource = function(resourceName, url){
      var resource = {name : resourceName, url : url};
      resources.push(resource);
    }

    //injected
    this.$get = function($resource){
      var result = {};
      _.each(resources, function(resource){
        result[resource.name] = $resource(resource.url, {} , {update : {method : 'PUT'}});
      });
      return result;
    }

  }

  //controllers
  var documentController = function($scope,$routeParams, Media){
    $scope.documents = Media.document.query($routeParams);
  };
  var listController = function($scope, $routeParams, Media){

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


  }
  var editorController = function($scope, $routeParams, Media){
    var editor = {};
    var renderEditor = function(value){
      editor = ace.edit('ace-editor');
      var JsonMode = require("ace/mode/json").Mode;
      editor.getSession().setMode(new JsonMode());

      //we're showing a string! NOT JSON!
      var valueString = JSON.stringify(value,null,2);

      editor.setValue(valueString);
      editor.selection.clearSelection();

    }
    var params = {
      database : $routeParams.database,
      collection : $routeParams.collection,
      id : $routeParams.id
    };
    var isNew = function(){
      return params.id === "add";
    }
    //pull the document in question
    if(isNew()){
      renderEditor({name : ""});
    }else{
      $scope.document = Media.document.get(params, function(results){
        renderEditor(results.document);
      });
    }
    var backToList = function(){
      location.href="#/" + params.database + "/" + params.collection;
    }

    $scope.deleteDocument = function(){
      if(confirm("Delete this document are you sure?")){
        $scope.document.$delete(params,backToList);
      }
    }

    $scope.saveDocument = function(){
      var editorText = editor.getValue();
      //parse it to JSON
      var parsed = JSON.parse(editorText);
      //create a Resources
      var docToSave = new Media.document(parsed);

      if(isNew()){
        delete params.id;
        docToSave.$save(params, backToList);
      }else{
        docToSave.$update(params, backToList);
      }

    }
  }

  //filters
  var mongoLink = function(){

    //filters return a function
    return function(item, arg){
      var currentLocation = location.href;
      if(currentLocation[currentLocation.length-1] !== "/") currentLocation+="/";
      //a very simple appending of the current item's name
      if(item)
        return currentLocation + item[arg];
      else
        return currentLocation + "add";
    }
  }

  var descriptiveName = function(){
    return function(item){
      var out = item.id;
      if(item.name)
        out = item.name;
      else if (item.sku)
        out= item.sku;
      else if (item.slug)
        out= item.slug;
      else if (item.title)
        out= item.title;
      else if (item.email)
        out= item.email;
      return out;
    }
  }

  //start 'em up
  var start = function(appName, payload){
    //initialize the app
    init(appName, payload);

    //startup Angular
    angular.bootstrap(document, [appName]);
  };

  var init = function(appName, payload){

    //create the module
    var mongoApp = angular.module(appName,['ngResource']);

    //configure routes
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
          .when("/:database/:collection/:id", {
            templateUrl : "editor-template.html",
            controller : "EditorCtrl"
          })
          .otherwise({
            template : "<h1>Not Found</h1>"
          })
      ;
    });

    //set the provider for Mongo
    mongoApp.provider("Media", mediaProvider);

    //configure the provider
    mongoApp.config(function(MediaProvider){
      if(!payload) throw "Need to have mongoApi set please";
      MediaProvider.setResources(payload);
    });

    //wireup the directives
    mongoApp.directive("deleteButton", Tekpub.Bootstrap.DeleteButton);
    mongoApp.directive("addButton", Tekpub.Bootstrap.AddButton);
    mongoApp.directive("breadcrumbs",Tekpub.Bootstrap.Breadcrumbs);

    //wireup the filters
    mongoApp.filter("mongolink", mongoLink);
    mongoApp.filter("descriptivename", descriptiveName);

    //wireup the controllers
    mongoApp.controller("ListCtrl", listController);
    mongoApp.controller("DocumentCtrl", documentController);
    mongoApp.controller("EditorCtrl", editorController);

    return mongoApp;
  }

  return {
    start : start
  }

}();

