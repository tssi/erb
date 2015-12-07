"use strict";
define(['model'],function($model){
	return new $model(
			{
				meta:{
					title: 'Faculty Loads',
				},
				data:[
					{id:1,subject:'English 1',section:'Section A',year_level:'Grade 1'},
					{id:2,subject:'English 2',section:'Section B',year_level:'Grade 2'},
					{id:3,subject:'English 3',section:'Section C',year_level:'Grade 3'},
				]
			}
		);
});