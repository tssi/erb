"use strict";
define(['app','api','jquery','fixtable'], function (app) {
    app.register.controller('RecordBookController',['$scope','$rootScope','api','$uibModal', function ($scope,$rootScope,api,$uibModal) {
		$scope.init = function(){
			$rootScope.__MODULE_NAME ='RecordBook';
			$scope.initFacultyLoads({limit:100});
			$scope.initStudents({limit:100});
			$scope.initActivePeriod();
			$scope.initPeriods();
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
		
		$scope.initPeriods = function(data){api.GET('system_defaults/periods',function success(response){
			$scope.Periods = response.data;
		})};		
		
		$scope.initActivePeriod= function(data){api.GET('system_defaults/active_period',function success(response){
			$scope.ActivePeriod = response.data.SystemDefault.value;
		})};	
	
		$scope.openRecordBook = function(data){
			$scope.FacultyLoadId = data.FacultyLoadId;
			
			api.POST('recordbooks/create',data,function success(response){
				$scope.loads = false;
				$scope.erb = true;
				$scope.RecordbookId = response.data.Recordbook.id;//INIT NG-recordbook
				$scope.TemplateId = response.data.Recordbook.template_id;//INIT NG-TEMPLATEID
				if(!$scope.TemplateId){
					initTemplate();
				}else{//RUN THIS OF EVERYTHING ON RECORDBOOK HAS BEEN INITIALIZED
					data['RecordbookId'] = $scope.RecordbookId;
					data['TemplateId'] = $scope.TemplateId;
					api.POST('recordbooks/template', data,function success(response){
						$scope.Components = response.data.components;
						$scope.MeasurableItems = response.data.measurables;
					});
				}
			});
		};
		
		function initTemplate(){
			var data = {};
			data['limit'] = 100;
			data['RecordbookId'] = $scope.RecordbookId;
			data['PeriodId'] = $scope.ActivePeriod;
			
			var modalInstance = $uibModal.open({
										animation: true,templateUrl: 'TemplateModal.html',controller: 'TemplateModalController',
										resolve: {
										  data: function () {
											return data;
										  }
										}
									});
		
			modalInstance.result.then(function(){},function(response){
				if(response.source==='confirm'){
					recordBook(response.data);
				}
			});
		}
		
		function recordBook(data){
			$scope.loads = false;
			$scope.erb = true;
			api.POST('recordbooks/template',data,function success(response){
				$scope.Components = response.data.components;
				$scope.MeasurableItems = response.data.measurables;
			});
		}
		
		
		//PERIOD RADIO BUTTON EVENT HANDLER
		$scope.selectPeriod = function(){
				var data = {}
					data['limit'] = 100;
					data['FacultyLoadId'] = $scope.FacultyLoadId;
					data['ActivePeriod'] = $scope.ActivePeriod;
				
				//CHECK RECORDBOOK
				api.POST('recordbooks/checkbook',data,function success(response){
					var record = response.data;
					if(record == 'false'){//IF NO RECORD BOOK
						api.POST('recordbooks/create',data,function success(response){
							$scope.RecordbookId = response.data.Recordbook.id;
							initTemplate();
						});
					}else if(record.Recordbook.template_id ==  null){//IF HAS RECORDBOOK BUT NO TEMPLATE
						$scope.RecordbookId = response.data.Recordbook.id;
						initTemplate();
					}else{//WITH RECORDBOOK
						var d = {};
							d['limit'] = 100;
							d['RecordbookId'] = record.Recordbook.id;
							d['PeriodId'] = record.Recordbook.period_id;
							d['TemplateId'] = record.Recordbook.template_id;
						recordBook(d);
					}
				});
			};
			
		//EDIT MEASURABLE ITEM EVNT HANDLER
		$scope.editMeasurable=function(data){
			console.log(data);
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'UpdateMeasurable.html',
				controller: 'UpdateMeasurableController',
				resolve: {
					data: function () {
						return data;
					},
				  }
			});
			
			modalInstance.result.then(function () {}, function (source) {
				if(source.action==='confirm'){
					api.POST('recordbooks/create_items', source.items,function success(response){//INSERT NEW MEASURABLE ITEMS
						recordBook(source.data);//REPOPULATE RECORDBOOK
					});
				}
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
	
	app.register.controller('UpdateMeasurableController',['$scope','$rootScope','$uibModalInstance','api','data', function ($scope, $rootScope, $uibModalInstance, api,data){
		console.log(data);
		$scope.MeasurableItems = data.MeasurableItem;
		$scope.componentId = data.GeneralComponent.id;
		$scope.itemCount = data.item_count;
		$scope.recordbook_detail_id = data.id;
		$scope.State = 'edit';
		//VIEW MODEL
		$scope.componentName = data.GeneralComponent.name;
		$scope.percentToPass = data.percent_to_pass;
		$scope.percentage = data.percentage;
		$scope.base = data.base;
		$scope.ceiling = data.ceiling;
		
		
		//CHANGE STATE EVENT HANDLER
		$scope.updateState=function(state){
			$scope.State=state;
		};
		
		//ADD NEW MEASURABLE ITEM EVENT HANDLER
		$scope.addNewItem=function(componentId){
			$scope.NewItem['MeasurableItem'].is_item = true;
			$scope.NewItem['MeasurableItem'].general_component_id = componentId;
			$scope.NewItem['MeasurableItem'].recordbook_detail_id = $scope.recordbook_detail_id;
			$scope.MeasurableItems.push($scope.NewItem);
			$scope.NewItem={};
		};
		
		//REMOVE MEASURABLE ITEM EVENT HANDLER
		$scope.removeItem=function(index,id){
			$scope.MeasurableItems.splice(index, 1);
		};
			
		//CONFIRM EVENT HANDLER
		$scope.confirmEdit = function(){
			var d = {};
			d['limit'] = 100;
			d['RecordbookId'] = data.Recordbook.id;
			d['PeriodId'] = data.Recordbook.period_id;
			d['TemplateId'] = data.Recordbook.template_id;
			$rootScope.__MODAL_OPEN=false;
			$uibModalInstance.dismiss({'action':'confirm','items':$scope.MeasurableItems,'data':d});
		};
		
		//CANCEL EVENT HANDLER
		$scope.closeEdit = function(){
			$rootScope.__MODAL_OPEN=false;
			$uibModalInstance.dismiss('cancel');
		};
	}]);

	app.register.controller('TemplateModalController',['$scope','$rootScope','$uibModalInstance','api','data', function ($scope, $rootScope, $uibModalInstance, api, data){
		//INIT STEPS
		$scope.Steps = [{id:1, description:"Step 1"},{id:2, description:"Step 2"},{id:3, description:"Step 3"}];
		
		//INIT ACTIVE STEP
		$scope.ActiveStep=1;
		
		//GET TEMPLATE OPTIONS
		api.GET('templates/all',function success(response){
			$scope.Templates = response.data;
		});	
		
		//NEXT STEP HANDLER
		$scope.nextStep = function(){
			if($scope.ActiveStep===1){
				if(data['PeriodId'] == '1'){
					$scope.Actions = [
						{id:'BlankTemp', title:"Blank template", description:"Example block-level help text here.", icon:"glyphicon glyphicon-file"},
						{id:'CopyFrom', title:"Copy meausrable items from other section", description:"Example block-level help text here.", icon:"glyphicon glyphicon-copyright-mark"},
					];
				}else{
					// NOT YET DONE CODING
					$scope.Actions = [
						{id:'BlankTemp', title:"Blank template", description:"Example block-level help text here.", icon:"glyphicon glyphicon-file"},
						{id:'CopyPrev', title:"Copy measurable items from previous period", description:"Example block-level help text here.", icon:"glyphicon glyphicon-copy"},
						{id:'CopyFrom', title:"Copy meausrable items from other section", description:"Example block-level help text here.", icon:"glyphicon glyphicon-copyright-mark"},
					];
				}
			}
			if($scope.ActiveStep===3){
				$rootScope.__MODAL_OPEN=false;
				$uibModalInstance.dismiss({source:'confirm','data':data});
			};
			if($scope.ActiveStep<$scope.Steps.length){
				$scope.ActiveStep++;
			}
		};
		
		//PREV STEP HANDLER
		$scope.prevStep = function(){
			if($scope.ActiveStep>1){
				$scope.ActiveStep--;
			};
		};
		
		//UPDATE STEP HANDLER
		$scope.updateStep=function(step){
			$scope.ActiveStep = step.id;
		};
		
		//HIGLIGHT SELECTED ACTION
		$scope.setSelectedAction=function(selected){
			$scope.SelectedAction = data['SelectedAction'] = selected.id;
		};
		
		//HIGHLIGHT SELECTED ACTION
		$scope.setSelectedTemplate=function(selected){
			$scope.SelectedTemplate = data['TemplateId'] = selected;
		};
		
		//CANCEL HANDLER
		$scope.cancelTemplate = function(){
			$rootScope.__MODAL_OPEN=false;
			$uibModalInstance.dismiss('cancel');
		};
	}]);
	
});


