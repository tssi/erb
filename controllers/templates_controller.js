"use strict";
define(['app','api','jquery'], function (app) {
    app.register.controller('TemplateController',['$scope','$rootScope','api', function ($scope,$rootScope,api) {
		$scope.init = function(){
			$rootScope.__MODULE_NAME ='Templates';
			$scope.initComponents();
			$scope.initTemplates();
			$scope.State = 'edit';
			$scope.GeneralComponents = [];
		}
		$scope.updateState=function(state){
				$scope.State=state;
			};
		$scope.filterComponents =  function(component){
			var searchBox = $scope.SearchBox;
			var keyword = new RegExp(searchBox, 'i');
			var test = keyword.test(component.name) || keyword.test(component.description);
			return !searchBox || test ; //Return NO FILTER or filter by patient_name
		}
		$scope.filterTemplate =  function(template){
			var searchBox = $scope.SearchBox;
			var keyword = new RegExp(searchBox, 'i');
			var test = keyword.test(template.name) || keyword.test(template.id);
			return !searchBox || test ; //Return NO FILTER or filter by patient_name
		}
		$scope.initComponents = function(){
			$scope.ActivePage = 1;
			$scope.NextPage=null;
			$scope.PrevPage=null;
			$scope.DataLoading = false;
			getComponents({page:$scope.ActivePage});
		}
		$scope.initTemplates = function(){
			$scope.ActivePage = 1;
			$scope.NextPage=null;
			$scope.PrevPage=null;
			$scope.DataLoading = false;
			getTemplates({page:$scope.ActivePage});
		}
		function getTemplates(data){
			api.GET('templates',data,function success(response){
				$scope.Templates = response.data;
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
		function getComponents(data){
			api.GET('template_components',data,function success(response){
				$scope.Components = response.data;
				console.log($scope.Components);
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
		
		//ADD NEW general components ITEM EVENT HANDLER
		$scope.addNewItem=function(NewItem){
			console.log(NewItem);
			console.log($scope.GeneralComponents)
			$scope.GeneralComponents.push(NewItem);
			$scope.NewItem={};
		};
		
		//REMOVE general components ITEM EVENT HANDLER
		$scope.removeItem=function(index){
			$scope.GeneralComponents.splice(index);
		};
	}]);
});