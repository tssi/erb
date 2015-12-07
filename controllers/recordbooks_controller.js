"use strict";
define(['app','api','jquery','fixtable'], function (app) {
    app.register.controller('RecordBookController',['$scope','$rootScope','api', function ($scope,$rootScope,api,$window) {
		$scope.init = function(){
			$rootScope.__MODULE_NAME ='RecordBook';
			$scope.initFacultyLoads({limit:2});
			$scope.initStudents({limit:10});
			$scope.loads = true;
			$scope.erb = false;
		}
		$scope.initFacultyLoads = function(data){
			api.GET('faculty_loads',data,function success(response){
				$scope.FacultyLoads = response.data;
			});
		}
		$scope.filterFacultyLoads =  function(load){
			var searchBox = $scope.SearchBox;
			var keyword = new RegExp(searchBox, 'i');
			var test = keyword.test(load.subject) || keyword.test(load.year_level) || keyword.test(load.section);
			return !searchBox || test ; //Return NO FILTER or filter by patient_name
		}
		$scope.confirmSearch = function(){
			var searchBox = $scope.SearchBox;
			var data = {keyword:searchBox,fields:['subject','year_level','section']};
			$scope.FacultyLoads=[];
			api.GET('faculty_loads',data,function success(response){
				$scope.FacultyLoads = response.data;
			});
		}
		$scope.saveSubject = function(){
			api.POST('faculty_loads',$scope.FacultyLoads,function success(response){
				console.log(response);
				$scope.initFacultyLoads({limit:10});
			});
		}
		
		
		$scope.initStudents = function(data){
			api.GET('students',data,function success(response){
				$scope.Students = response.data;
				console.log($scope.Students);
			});
		}
		
		console.log($('#demo'));
		
		//TABS
		//$scope.tabs = [
			//{ title:'2nd Period', content:'Dynamic content 2' },
		//	{ title:'3rd Period', content:'Dynamic content 3' },
		//	{ title:'4th Period', content:'Dynamic content 4' },
		//];
		
		$scope.openRecordBook = function($){
				$scope.loads = false;
				$scope.erb = true;
		};
		
		(function() {
			var demo, fixedTable;
			console.log('wew');
			fixedTable = function(el) {
				var $body, $header, $sidebar;
				$body = $(el).find('.fixedTable-body');
				$sidebar = $(el).find('.fixedTable-sidebar table');
				$header = $(el).find('.fixedTable-header table');
			
				
				return $($body).scroll(function() {
						console.log('wew');
					$($sidebar).css('margin-top', -$($body).scrollTop());
					return $($header).css('margin-left', -$($body).scrollLeft());
				});
			};

			demo = new fixedTable($('#demo'));

		}).call(this);
	
	}]);
	
});


