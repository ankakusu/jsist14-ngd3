var hello = angular.module("directives");

hello.directive("hello", function(){
  return {
    restrict: "AE",
    scope: {},
    template:
      '<div>Hello {{helloName}}!</div>' +
      '<input ng-model="helloName">'
  };
});