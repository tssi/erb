"use strict";
define(['app','api'], function (app) {
    app.register.controller('CurriculumController',['$scope','$rootScope','api', function ($scope,$rootScope,api) {
		$scope.init = function(){
			$rootScope.__MODULE_NAME ='Curriculum';
			
			$scope.initSubjects();
			$scope.initLevels();
		}
		function getSubjects(data){
			api.GET('subjects',data,function success(response){
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
		$scope.initLevels = function(){
			api.GET('year_levels',{'limit':20},function success(response){
				$scope.Levels = response.data;
				$.each($scope.Levels,function(i,o){
					 $scope.CurriculumDetails[o.id]=[];
				});
				console.log($CurriculumDetails);
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
		//change level
		$scope.changeLevels = function($level){
			console.log($scope.CurriculumDetail);
			if(!$scope.CurriculumDetail.educ_level_id){
				return $level.educ_level_id.id =='';
			}else{
				return $level.educ_level_id == $scope.CurriculumDetail.educ_level_id;
			}
			
		}
	}]);
});