Tekpub.Mongo.DocumentController = ['$scope', '$routeParams','Media',function($scope,$routeParams, Media){
  $scope.documents = Media.document.query($routeParams);
}];
Tekpub.Mongo.ListController =  ['$scope', '$routeParams','Media', function($scope, $routeParams, Media){
  var params = {
    database : $routeParams.database,
    collection : $routeParams.collection
  }

  $scope.context = "root";
  if(params.database) $scope.context = "database";
  if(params.collection) $scope.context = "collection";

  $scope.items = Media[$scope.context].query($routeParams);

  $scope.addItem = function(){
    var newItemName = $scope.newItemName;
    if(newItemName){
      var newItem = new Media[context]({name : newItemName});
      newItem.$save(params);
      $scope.items.push(newItem);
    }
  }
  $scope.removeItem = function(item){
    if(confirm("Delete this " + $scope.context + "? There's no undo...")){
      var removeParams = {name : item.name};
      if($routeParams.database) removeParams.database = $routeParams.database;

      item.$delete(removeParams);
      $scope.items.splice($scope.items.indexOf(item),1)
    }
  }
}];
Tekpub.Mongo.EditorController =  ['$scope', '$routeParams','Media',function($scope, $routeParams, Media){
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
}];
