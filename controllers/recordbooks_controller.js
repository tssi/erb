"use strict";
define(['app','api','jquery','fixtable'], function (app) {
    app.register.controller('RecordBookController',['$scope','$rootScope','api','$uibModal', function ($scope,$rootScope,api,$uibModal) {
		$scope.init = function(){
			$rootScope.__MODULE_NAME ='RecordBook';
			$scope.initFacultyLoads();
			$scope.initStudents();
			$scope.loads = true;
			$scope.erb = false;
			
		}
		$scope.initFacultyLoads = function(){
			api.GET('faculty_loadings',function success(response){
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
			api.GET('faculty_loadings',data,function success(response){
				$scope.FacultyLoads = response.data;
			});
		}				
		$scope.initStudents = function(){
			api.GET('students',function success(response){
				$scope.Students = response.data;
			});
		}		
	
		$scope.openRecordBook = function(load_id){
			recordBook(load_id);
		};
		
		
		function recordBook(load_id){
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
			api.GET(testComponents,function success(response){
				$scope.Components = response.data[0];
			});
			api.GET(testMeasurableItems,function success(response){
				$scope.MeasurableItems = response.data;
				$scope.MeasurableItemsCount = response.data.length;
				console.log(response);
			});
			
		}
		
		
		// PERIOD RADIO BUTTON EVENT HANDLER
		$scope.selectPeriod = function(period,hasTemplate){
			
			if(!hasTemplate){
				var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'TemplateModal.html',
				controller: 'TemplateModalController',
				resolve: {
					period: function () {
						return period;
					}
				  }
				});
				modalInstance.opened.then(function(){$rootScope.__MODAL_OPEN=true;});
					
			}
			
		
			
			/*
			if(period == '1'){
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
			*/
			
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
					templateUrl: 'UpdateMeasurable.html',
					controller: 'ModalInstanceController',
					resolve: {
						items: function () {
							return $scope.EditableItems;
						}
					  }
				});
				//modalInstance.opened.then(function(){$rootScope.__MODAL_OPEN=true;});
				
				
				modalInstance.result.then(function () {}, function (source) {
				
					//Re-initialize booklets when confirmed
					if(source==='confirm')
						recordBook(1);
				});
				
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
		$scope.State = 'edit';
		
		//CHANGE STATE EVENT HANDLER
		$scope.updateState=function(state){
			$scope.State=state;
		};
		
		//ADD NEW MEASURABLE ITEM EVENT HANDLER
		$scope.addNewItem=function(){
			$scope.EditableItems.unshift($scope.NewItem);
			
			api.POST('measurable_items',$scope.EditableItems,function success(response){
				console.log(response);
			});
		
			$scope.NewItem={};
		};
		
		//REMOVE MEASURABLE ITEM EVENT HANDLER
		$scope.removeItem=function(index,id){
			$scope.EditableItems.splice(index, 1);
		};
		
		//CONFIRM EVENT HANDLER
		$scope.confirmEdit = function(){
			$scope.MeasurableItems = $scope.EditableItems;
			api.POST('measurable_items',$scope.MeasurableItems,function success(response){
				$uibModalInstance.dismiss('confirm');
			});
		
			
			$uibModalInstance.dismiss('confirm');
		};
		
		//CANCEL EVENT HANDLER
		$scope.cancelEdit = function(){
			$rootScope.__MODAL_OPEN=false;
			$uibModalInstance.dismiss('cancel');
			//REFETCH DATA
			/*api.GET('measurable_items',data,function success(response){
				$scope.MeasurableItems = response.data;
			});	*/
		};
	}]);

	app.register.controller('TemplateModalController',['$scope','$rootScope','$uibModalInstance','api','period', function ($scope, $rootScope, $uibModalInstance, api,period){
		console.log($rootScope);
		
		$scope.ActiveStep=1;
		$scope.Steps = [
				{id:1, description:"Step 1"},
				{id:2, description:"Step 2"},
				{id:3, description:"Step 3"}
			];
		$scope.Actions = [
				{id:1, title:"Use previous template", description:"Example block-level help text here.", icon:"glyphicon glyphicon-copy"},
				{id:2, title:"Copy template from other section", description:"Example block-level help text here.", icon:"glyphicon glyphicon-copyright-mark"},
				{id:3, title:"Use new template", description:"Example block-level help text here.", icon:"glyphicon glyphicon-file"}
			];
		
		$scope.nextStep = function(){
			if($scope.ActiveStep===1){
				switch($scope.SelectedAction.id){
					case 1: 
							$scope.PrevTempOptions = [
								{id:1, title:"Include measurable item", description:"Example block-level help text here."},
								{id:2, title:"Don't include measurable item", description:"Example block-level help text here."},
							];
							break;
					case 2: console.log('2');
					
					
							break;
					case 3: 
							api.GET('templates',function success(response){
								$scope.Templates = response.data;
								console.log($scope.Templates);
							});
							break;
				}
					
				
			}
			if($scope.ActiveStep===2){
				
				
			}
			if($scope.ActiveStep===3){
				$rootScope.__MODAL_OPEN=false;
				$uibModalInstance.dismiss('cancel');
				
				
				//api.GET('init_components',function success(response){
				//	$scope.Components = response.data[0];
				//});
				//api.GET('init_measurable_items',function success(response){
				//	$scope.MeasurableItems = response.data;
				//	$scope.MeasurableItemsCount = response.data.length;
				//});
				
				
			};
			if($scope.ActiveStep<$scope.Steps.length){
				$scope.ActiveStep++;
			}
		};
		$scope.prevStep = function(){
			if($scope.ActiveStep>1){
				$scope.ActiveStep--;
			};
		};
		$scope.updateStep=function(step){
			$scope.ActiveStep = step.id;
		};
		
		//HIGLIGHT SELECTED OPTIONS
		$scope.setSelectedAction=function(selected){
			$scope.SelectedAction = selected;
		};
		$scope.setSelectedPrevTempOption=function(selected){
			$scope.SelectedPrevTempOption = selected;
		};
		$scope.setSelectedTemplate=function(selected){
			$scope.SelectedTemplate = selected;
		};
	
	
	
	
		//CANCEL EVENT HANDLER
		$scope.cancelTemplate = function(){
			$rootScope.__MODAL_OPEN=false;
			$uibModalInstance.dismiss('cancel');
		};
	}]);
	
});


