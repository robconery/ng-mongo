var ListCtrl = function($scope, $http){
  //http get returns a promise...
  var result = $http.get("/mongo-api/dbs");
  result.success(function(data){
    $scope.items = data;
  });
}