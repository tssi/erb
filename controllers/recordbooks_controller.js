"use strict";
define(['app','api','jquery','fixtable'], function (app) {
    app.register.controller('RecordBookController',['$scope','$rootScope','api', function ($scope,$rootScope,api,$window , $uibModal, $log) {
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
		
		//MODAL
		
		$scope.items = ['item1', 'item2', 'item3'];

		$scope.animationsEnabled = true;

		$scope.open = function (size) {

		var modalInstance = $uibModal.open({
		  animation: $scope.animationsEnabled,
		  templateUrl: 'myModalContent.html',
		  controller: 'ModalInstanceCtrl',
		  size: size,
		  resolve: {
			items: function () {
			  return $scope.items;
			}
		  }
		});

		modalInstance.result.then(function (selectedItem) {
		  $scope.selected = selectedItem;
			}, function () {
			  $log.info('Modal dismissed at: ' + new Date());
			});
		};

		$scope.toggleAnimation = function () {
			$scope.animationsEnabled = !$scope.animationsEnabled;
		};

		app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

		  $scope.items = items;
		  $scope.selected = {
			item: $scope.items[0]
		  };

		  $scope.ok = function () {
			$uibModalInstance.close($scope.selected.item);
		  };

		  $scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		  };
		});
					
		//FIX TABLE
		(function() {
			var demo, fixedTable;
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


