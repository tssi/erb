"use strict";
define(['model'],function($model){
	return new $model(
			{
				meta:{
					title: 'Measurable Items',
				},
				data:[
						{
						  "Component":{
							"name": "Performance Task",
						  },
						  "id":3,
						  "component_id": 2,
						  "header": "Project",
						  "perfect_score": 100,
						  "percentage": 10,
						  "base": 0
						},
						{
						  "id":4,
						  "component_id": 2,
						  "header": "RCT",
						  "perfect_score": 100,
						  "percentage": 10,
						  "base": 0
						},
					
				  ]
					
				
			}
		);
});