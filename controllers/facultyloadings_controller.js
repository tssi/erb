"use strict";
define(['app','api','jquery'], function (app) {
    app.register.controller('FacutyLoadingController',['$scope','$rootScope','api', function ($scope,$rootScope,api) {
		$scope.init = function(){
			$rootScope.__MODULE_NAME ='Faculty Loading';
			$scope.initFacultyLoadings();
			//$scope.initTemplates();
		}
		$scope.filterFacultyLoadings =  function(faltyloading){
			var searchBox = $scope.SearchBox;
			var keyword = new RegExp(searchBox, 'i');
			var test = keyword.test(faltyloading.subject.name) || keyword.test(faltyloading.section.name) || keyword.test(faltyloading.yearlevel.name);
			return !searchBox || test ; //Return NO FILTER or filter by patient_name
		}
		
		$scope.initFacultyLoadings = function(){
			$scope.ActivePage = 1;
			$scope.NextPage=null;
			$scope.PrevPage=null;
			$scope.DataLoading = false;
			getFacultyLoadings({page:$scope.ActivePage});
		}
		function getFacultyLoadings(data){
			api.GET('faculty_loadings',data,function success(response){
				$scope.FacultyLoadings = response.data;
				console.log($scope.FacultyLoadings);
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
		
	}]);
});