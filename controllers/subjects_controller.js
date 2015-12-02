"use strict";
define(['app','api'], function (app) {
    app.register.controller('SubjectController',['$scope','$rootScope','api', function ($scope,$rootScope,api) {
		$scope.init = function(){
			$rootScope.__MODULE_NAME ='Subject';
			$scope.initSubjects({limit:2});
		}
		$scope.initSubjects = function(data){
			api.GET('subjects',data,function success(response){
				$scope.Subjects = response.data;
			});
		}
		$scope.filterSubjects =  function(subject){
			var searchBox = $scope.SearchBox;
			var keyword = new RegExp(searchBox, 'i');
			var test = keyword.test(subject.name) || keyword.test(subject.description);
			return !searchBox || test ; //Return NO FILTER or filter by patient_name
		}
		$scope.confirmSearch = function(){
			var searchBox = $scope.SearchBox;
			var data = {keyword:searchBox,fields:['name','description']};
			$scope.Subjects=[];
			api.GET('subjects',data,function success(response){
				$scope.Subjects = response.data;
			});
		}
		$scope.saveSubject = function(){
			api.POST('subjects',$scope.Subject,function success(response){
				console.log(response);
				$scope.initSubjects({limit:10});
			});
		}
	}]);
});