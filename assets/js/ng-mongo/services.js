Tekpub.MediaProvider = function(){

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
  this.$get = ['$resource',function($resource){
    var result = {};
    _.each(resources, function(resource){
      result[resource.name] = $resource(resource.url, {} , {update : {method : 'PUT'}});
    });
    return result;
  }];

}
