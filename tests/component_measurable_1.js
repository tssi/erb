"use strict";
define(['model'],function($model){
	return new $model(
			{
				meta:{
					title: 'Measurable Items',
				},
				data:[
						{
							"component_id": 1,
							"header": "Q1",
							"perfect_score": 10,
							"percentage": 10,
							"base": 0,
							"is_item":true,
						},
						{ 
							"component_id": 1,
							"header": "Q2",
							"perfect_score": 10,
							"percentage": 10,
							"base": 0,
							"is_item":true
						},
					
				  ]
					
				
			}
		);
});