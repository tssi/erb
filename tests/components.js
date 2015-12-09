"use strict";
define(['model'],function($model){
	return new $model(
			{
				meta:{
					title: 'Component',
				},
				data:[
					{
					  "code": "WW",
					  "description": "Written Work",
					  "percentage": "20%"
					},
					{
					  "code": "PT",
					  "description": "Performance Task",
					  "percentage": "30%"
					},
					{
					  "code": "QA",
					  "description": "Quarterly Assessment",
					  "percentage": "50%"
					}
				]
			}
		);
});