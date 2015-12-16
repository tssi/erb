"use strict";
define(['model'],function($model){
	return new $model(
			{
				meta:{
					title: 'General Components',
				},
				data:{
					  "Component": [
						{
						  "id": 1,
						  "name": "Written Work",
						  "percentage": 30,
						  "measurable_item_count":4,
						},
						{
						  "id": 2,
						  "name": "Performance Task",
						  "percentage": 30,
						  "measurable_item_count":4,
						},
						{
						 "id": 3,
						  "name": "Quarterly Assessment",
						  "percentage": 30,
						  "measurable_item_count":4,
						}
					  ]
					
					}
			}
		);
});