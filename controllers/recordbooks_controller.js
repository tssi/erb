"use strict";
define(['app','api','jquery','fixtable'], function (app) {
    app.register.controller('RecordBookController',['$scope','$rootScope','api','$uibModal', function ($scope,$rootScope,api,$uibModal) {
		$scope.init = function(){
			$rootScope.__MODULE_NAME ='RecordBook';
			$scope.initFacultyLoads({limit:100});
			$scope.initStudents({limit:100});
			$scope.loads = true;
			$scope.erb = false;
			
		}
		$scope.initFacultyLoads = function(data){api.GET('faculty_loadings',data,function success(response){$scope.FacultyLoads = response.data})}
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
		$scope.initStudents = function(data){api.GET('students',data,function success(response){$scope.Students = response.data})}		
	
		$scope.openRecordBook = function(data,load_id){
			$scope.load_id = load_id;
			recordBook(data,load_id);
		};
		
		function recordBook(data,load_id){
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
				console.log($scope.MeasurableItems);
				console.log($scope.MeasurableItemsCount);
			});
			
		}
		
		
		// PERIOD RADIO BUTTON EVENT HANDLER
		$scope.selectPeriod = function(period,hasTemplate,data){
			
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
				
				modalInstance.result.then(function () {}, function (source) {
					//Re-initialize
					if(source==='confirm'){
							
						recordBook(data,'2');
				
					}
					
				});
					
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
		$scope.editMeasurable=function(data,componentId,itemCount){
		//	api.GET('measurable_items',data,function success(response){
			//	$scope.EditableItems = response.data;
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'UpdateMeasurable.html',
					controller: 'ModalInstanceController',
					resolve: {
						items: function () {
							return [$scope.MeasurableItems,componentId,itemCount];
						}
					  }
				});
				
				
				modalInstance.result.then(function () {}, function (source) {
					//Re-initialize
					if(source==='confirm'){
						
						//console.log($scope.MeasurableItems);
						//recordBook(data,$scope.load_id);
					}
					
				});
		//	});
				
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
	
		$scope.MeasurableItems = items[0];
		$scope.componentId = items[1];
		$scope.itemCount = items[2];
		$scope.State = 'edit';
		
		//CHANGE STATE EVENT HANDLER
		$scope.updateState=function(state){
			$scope.State=state;
		};
		
		//ADD NEW MEASURABLE ITEM EVENT HANDLER
		$scope.addNewItem=function(componentId){
			$scope.NewItem.is_item = true;
			$scope.NewItem.component_id = componentId;
			$scope.MeasurableItems.unshift($scope.NewItem);
			$scope.NewItem={};
		};
		
		//REMOVE MEASURABLE ITEM EVENT HANDLER
		$scope.removeItem=function(index,id){
			$scope.MeasurableItems.splice(index, 1);
		};
		

		
		//CANCEL EVENT HANDLER
		$scope.cancelEdit = function(){
			$rootScope.__MODAL_OPEN=false;
			$uibModalInstance.dismiss('cancel');
		};
	}]);

	app.register.controller('TemplateModalController',['$scope','$rootScope','$uibModalInstance','api','period', function ($scope, $rootScope, $uibModalInstance, api,period){
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
				$uibModalInstance.dismiss('confirm');
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


