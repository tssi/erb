"use strict";
define(['app','api','jquery','fixtable'], function (app) {
    app.register.controller('RecordBookController',['$scope','$rootScope','api','$uibModal', function ($scope,$rootScope,api,$uibModal) {
		$scope.init = function(){
			$rootScope.__MODULE_NAME ='RecordBook';
			$scope.initFacultyLoads({limit:100});
			$scope.initStudents({limit:100});
			$scope.loads = true;
			$scope.erb = false;
			$scope.Period = "1";
		}
		$scope.initFacultyLoads = function(data){
			api.GET('faculty_loads/api',data,function success(response){
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
			api.GET('faculty_loads/api',data,function success(response){
				$scope.FacultyLoads = response.data;
			});
		}				
		$scope.initStudents = function(data){api.GET('students/api',data,function success(response){
			$scope.Students = response.data
		})};		
	
		$scope.openRecordBook = function(data){
			$scope.facultyLoadID = data.data.FacultyLoad.id;
			initRecordBook(data);
		};
		
		function initRecordBook(data){
			
			api.POST('recordbooks/create',data,function success(response){
				$scope.loads = false;
				$scope.erb = true;
				$scope.recordbookId = response.data.Recordbook.id;
				
				if(!response.data.RecordbookDetail.length){
					$scope.period_id = $scope.Period;
					selectingTemplateModal();
				}else{
					$.each(response.data.RecordbookDetail,function(i,o){
						if(o.period_id == $scope.Period){
							data['TemplateId'] = o.template_id;
						}
					});
					console.log(data);
					
					api.POST('recordbooks/template', data,function success(response){
						$scope.Components = response.data.components;
						$scope.MeasurableItems = response.data.measurables;
					});
				}
			});
		}
		
		function selectingTemplateModal(){
			var modalInstance = $uibModal.open({
										animation: true,
										templateUrl: 'TemplateModal.html',
										controller: 'TemplateModalController',
										resolve: {
										  period_id: function () {
											return $scope.Period;
										  }
										}
									});
		
			modalInstance.result.then(function () {}, function (data) {
				if(data.source==='confirm'){
					recordBook(data.template,data.action);
				}
			});
		}
		
		function recordBook(tmp,action){
			$scope.loads = false;
			$scope.erb = true;
			
			var data  = {
					'TemplateId':tmp.Template.id,
					'PeriodId':$scope.Period,
					'SelectedAction': action.id,
					'data':{
						'Recordbook':{
							'id': $scope.recordbookId
					}
				}
			}
			
			api.POST('recordbooks/template', data,function success(response){
				$scope.Components = response.data.components;
				$scope.MeasurableItems = response.data.measurables;
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
												  period_id: function () {
													return period;
												  }
												}
											});
				
				modalInstance.result.then(function () {}, function (source) {
					if(source==='confirm'){
							
						recordBook(data,'2');
				
					}
					
				});
					
			}
		};
			
		//Opening the modal
		$scope.editMeasurable=function(data,componentId,itemCount){
			console.log(data);
			console.log(componentId);
			console.log(itemCount);
			
		//	api.GET('measurable_items',data,function success(response){
			//	$scope.EditableItems = response.data;
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'UpdateMeasurable.html',
					controller: 'ModalInstanceController',
					resolve: {
						items: function () {
							return $scope.MeasurableItems;
						},
						component_id: function () {
							return componentId;
						},
						item_count: function () {
							return itemCount;
						}
					  }
				});
				
				
				modalInstance.result.then(function () {}, function (source) {
					console.log(source);
					//Re-initialize
					if(source==='confirm'){
						
						console.log($scope.MeasurableItems);
						recordBook(data,$scope.facultyLoadID);
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
	
	app.register.controller('ModalInstanceController',['$scope','$rootScope','$uibModalInstance','api','items','component_id','item_count', function ($scope, $rootScope, $uibModalInstance, api,items,component_id,item_count){
	
		$scope.MeasurableItems = items;
		$scope.componentId = component_id;
		$scope.itemCount = item_count;
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
		

		
		//CONFIRM EVENT HANDLER
		$scope.confirmEdit = function(){
			$rootScope.__MODAL_OPEN=false;
			$uibModalInstance.dismiss('confirm');
		};
		
		//CANCEL EVENT HANDLER
		$scope.closeEdit = function(){
			$rootScope.__MODAL_OPEN=false;
			$uibModalInstance.dismiss('cancel');
		};
	}]);

	app.register.controller('TemplateModalController',['$scope','$rootScope','$uibModalInstance','api','period_id', function ($scope, $rootScope, $uibModalInstance, api, period_id){
		$scope.ActiveStep=1;
		
		$scope.Steps = [{id:1, description:"Step 1"},{id:2, description:"Step 2"},{id:3, description:"Step 3"}];
		
		
		
		//GET ALL TEMPLATES
		api.GET('templates/all',function success(response){
			$scope.Templates = response.data;
		});	
		
		$scope.nextStep = function(){
			if($scope.ActiveStep===1){
				if(period_id == '1'){
					$scope.Actions = [
						{id:'BlankTemp', title:"Blank template", description:"Example block-level help text here.", icon:"glyphicon glyphicon-file"},
						{id:'CopyFrom', title:"Copy meausrable items from other section", description:"Example block-level help text here.", icon:"glyphicon glyphicon-copyright-mark"},
					];
				}else{
					// NOT YET DONE CODING
					console.log($scope.SelectedTemplate);
					$scope.Actions = [
						{id:'BlankTemp', title:"Blank template", description:"Example block-level help text here.", icon:"glyphicon glyphicon-file"},
						{id:'CopyPrev', title:"Copy measurable items from previous period", description:"Example block-level help text here.", icon:"glyphicon glyphicon-copy"},
						{id:'CopyFrom', title:"Copy meausrable items from other section", description:"Example block-level help text here.", icon:"glyphicon glyphicon-copyright-mark"},
					];
					//
				}
				
			}
			if($scope.ActiveStep===2){
		
			}
			if($scope.ActiveStep===3){
				$rootScope.__MODAL_OPEN=false;
				$uibModalInstance.dismiss({source:'confirm','action':$scope.SelectedAction,'template':$scope.SelectedTemplate});
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


