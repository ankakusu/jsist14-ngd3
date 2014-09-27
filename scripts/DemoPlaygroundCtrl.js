angular.module("controllers")
  .controller("DemoPlaygroundCtrl", function($scope){
    $scope.update = function(){
      $scope.data = Math.random();
    };

    $scope.init = function(rotateYaw, rotatePitch, centerLon, centerLat, scale){
      $scope.rotateYaw = rotateYaw;
      $scope.rotatePitch = rotatePitch;
      $scope.centerLon = centerLon;
      $scope.centerLat = centerLat;
      $scope.scale = scale;
    }
  });