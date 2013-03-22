var Tekpub = Tekpub || {};
Tekpub.Bootstrap = {};
Tekpub.Bootstrap.AddButton = function(){
  return {
    restrict : "E",
    scope : {
      action : "&",
      text : "@"
    },
    template : "<button class='btn btn-success' ng-click='action()'><i class='icon icon-white icon-plus-sign'></i> {{text}}</button>"
  }
}

Tekpub.Bootstrap.DeleteButton = function(){
  return {
    restrict : "E",
    replace : true,
    scope : {
      text : "@",
      action : "&"
    },
    template : "<button class='btn btn-danger' ng-click='action()'><i class='icon icon-remove icon-white'></i> {{text}}</button>"

  }
}

Tekpub.Bootstrap.Breadcrumbs = function($routeParams){
  return {
    restrict : "E",
    scope : {
      context : "="
    },
    controller : function($scope){
      var rootUrl = "#/";
      $scope.crumbs = [{url : rootUrl, text : "Databases"}];
      var runningUrl = rootUrl;
      for(var param in $routeParams){
        runningUrl += $routeParams[param];
        $scope.crumbs.push({url : runningUrl, text : $routeParams[param]});
      }

      $scope.notLast = function(crumb){
        return crumb !== _.last($scope.crumbs);
      }
    },
    template : '<div class="row">' +
        '<div class="span12">' +
        '<ul class="breadcrumb">' +
        '<li ng-repeat="crumb in crumbs">' +
        '<h3><a href="{{crumb.url}}">{{crumb.text}}</a><span class="divider" ng-show="notLast(crumb)"> / </span></h3>' +
        '</li>' +
        '</ul>' +
        '</div>' +
        '</div>'
  }
}