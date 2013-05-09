Tekpub.Mongo.MongoLink = function(){
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