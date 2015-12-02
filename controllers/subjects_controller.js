"use strict";
define(['app','api'], function (app) {
    app.register.controller('SubjectController',['$scope','$rootScope','api', function ($scope,$rootScope,api) {
		$scope.init = function(){
			$rootScope.__MODULE_NAME ='Subject';
			
			$scope.initSubjects({limit:2});
		}
		function getSubjects(data){
			api.GET('subjects',data,function success(response){
				console.log(response);
				$scope.Subjects = response.data;
				$scope.NextPage=response.meta.next;
				$scope.PrevPage=response.meta.prev;
				$scope.TotalItems=response.meta.count;
				$scope.LastItem=response.meta.page*response.meta.limit;
				$scope.FirstItem=$scope.LastItem-(response.meta.limit-1);
				if($scope.LastItem>$scope.TotalItems){
					$scope.LastItem=$scope.TotalItems;
				};
				$scope.DataLoading = false;
			});
		}
		$scope.initSubjects = function(){
			$scope.ActivePage = 1;
			$scope.NextPage=null;
			$scope.PrevPage=null;
			$scope.DataLoading = false;
			getSubjects({page:$scope.ActivePage});
		}
		$scope.navigatePage=function(page){
			$scope.ActivePage=page;
			getSubjects({page:$scope.ActivePage});
		};
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