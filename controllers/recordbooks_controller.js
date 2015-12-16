"use strict";
define(['app','api','jquery','fixtable'], function (app) {
    app.register.controller('RecordBookController',['$scope','$rootScope','api','$uibModal', function ($scope,$rootScope,api,$uibModal) {
		$scope.init = function(){
			$rootScope.__MODULE_NAME ='RecordBook';
			$scope.initFacultyLoads({limit:2});
			$scope.initStudents({limit:10});
			$scope.loads = true;
			$scope.erb = false;
			
		}
		$scope.initFacultyLoads = function(data){
			api.GET('faculty_loadings',data,function success(response){
				$scope.FacultyLoads = response.data;
				
				console.log($scope.FacultyLoads);
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
			api.GET('faculty_loadings',data,function success(response){
				$scope.FacultyLoads = response.data;
			});
		}				
		$scope.initStudents = function(data){
			api.GET('students',data,function success(response){
				$scope.Students = response.data;
			});
		}		
		$scope.openRecordBook = function(data,load_id){
			$scope.loads = false;
			$scope.erb = true;
			//FOR TESTING PURPOSES
			if(load_id == 1){
				var testComponents = 'components';
				var testMeasurableItems = 'measurable_items';
			}else{
				var testComponents = 'init_components';
				var testMeasurableItems = 'init_measurable_items';
			}
			api.GET(testComponents,data,function success(response){
				$scope.Components = response.data[0];
			});
			api.GET(testMeasurableItems,data,function success(response){
				$scope.MeasurableItems = response.data;
				$scope.MeasurableItemsCount = response.data.length;
			});
		};
		
		// PERIOD RADIO BUTTON EVENT HANDLER
		$scope.selectPeriod = function(data,period){
			if(period == '1st'){
				var testComponents = 'components';
				var testMeasurableItems = 'measurable_items';
			}else{
				var testComponents = 'init_components';
				var testMeasurableItems = 'init_measurable_items';
			}
			
			api.GET(testComponents,data,function success(response){
				$scope.Components = response.data[0];
			});
			api.GET(testMeasurableItems,data,function success(response){
				$scope.MeasurableItems = response.data;
				$scope.MeasurableItemsCount = response.data.length;
			});
			
		};
		
		
		
		//Opening the modal
		$scope.editMeasurable=function(data,id){
			if(id == 1){ //FOR TESTING PURPOSES
				 var fetch = 'component_measurable_1';
			}else if(id == 2){
				 var fetch = 'component_measurable_2';
			}else if(id == 3){
				 var fetch = 'component_measurable_3';
			}//
			
			api.GET(fetch,data,function success(response){
				$scope.EditableItems = response.data;
				var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceController',
				resolve: {
					items: function () {
						return $scope.EditableItems;
					}
				  }
				});
				modalInstance.opened.then(function(){$rootScope.__MODAL_OPEN=true;});
			});
		};
		
					
		//FIX TABLE
		(function() {
			var demo, fixedTable;
			fixedTable = function(el) {
				var $body, $header, $sidebar;
				$body = $(el).find('.fixedTable-body');
				$sidebar = $(el).find('.fixedTable-sidebar table');
				$header = $(el).find('.fixedTable-header table');
			
				
				return $($body).scroll(function() {
					$($sidebar).css('margin-top', -$($body).scrollTop());
					return $($header).css('margin-left', -$($body).scrollLeft());
				});
			};
			demo = new fixedTable($('#demo'));
		}).call(this);
		
	
	}]);
	
	app.register.controller('ModalInstanceController',['$scope','$rootScope','$uibModalInstance','api','items', function ($scope, $rootScope, $uibModalInstance, api,items){
		
		$scope.EditableItems = items;

		//Get the data entered and push it to booklets.js
		$scope.confirmEdit = function(){
			$rootScope.__MODAL_OPEN=false;
			 $uibModalInstance.dismiss('confirm');
		};
		//Close modal
		$scope.cancelEdit = function(){
			$rootScope.__MODAL_OPEN=false;
			$uibModalInstance.dismiss('cancel');
			/*REFECHT DATA
			api.GET('measurable_items',data,function success(response){
				$scope.MeasurableItems = response.data;
			});
			*/
		};
	}]);
	
	

});


