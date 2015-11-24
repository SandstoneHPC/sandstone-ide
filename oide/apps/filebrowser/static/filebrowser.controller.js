'use strict';

angular.module('oide.filebrowser')
.controller('FilebrowserController', ['FBFiletreeService', '$rootScope', 'FileService', '$scope', function(FiletreeService, $rootScope, FileService, $scope){
  var self = this;
  // self.fileData = FileService.fileData;
  // $scope.$watch(function () { return FileService.fileData }, function (newVal, oldVal) {
  //   if (typeof newVal !== 'undefined') {
  //       $scope.fileData = FileService.fileData;
  //   }
  // });

  // $scope.$watch('FileService.getFileData()', function(newVal){
  //   $scope.fileData = newVal;
  // });

  $scope.$watch(function(){
    return FileService.getFileData();
}, function (newValue) {
    // alert("isLoggedIn changed to " + newValue);
    console.log("fileData changed");
    self.fileData = newValue;
});

  self.show_details = false;
  self.ShowDetails = function(){
    self.show_details = true;
  };
}])
.factory('FileService', ['$rootScope', function($rootScope){
  var fileData;

  var setFileData = function(data) {
    fileData = data;
    // $rootScope.$apply();
  };

  var getFileData = function(){
    return fileData;
  }

  return {
    setFileData: setFileData,
    getFileData: getFileData
  };
}]);
