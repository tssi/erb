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
						  "measurable_item_count":5,
						  "measurable_items": [
							{
							  "id":1,
							  "header": "Q1",
							  "perfect_score": 10,
							  "percentage": 10,
							  "base": 0
							},
							{
							  "id":2,
							  "header": "Q2",
							  "perfect_score": 10,
							  "percentage": 10,
							  "base": 0
							}
						  ]
						},
						{
						  "id": 2,
						  "name": "Performance Task",
						  "percentage": 30,
						  "measurable_item_count":5,
						  "measurable_items": [
							{
							  "id":3,
							  "header": "Project",
							  "perfect_score": 100,
							  "percentage": 10,
							  "base": 0
							},
							{
							  "id":4,
							  "header": "RCT",
							  "perfect_score": 100,
							  "percentage": 10,
							  "base": 0
							}
						  ]
						},
						{
						 "id": 3,
						  "name": "Quarterly Assessment",
						  "percentage": 30,
						  "measurable_item_count":4,
						  "measurable_items": [
							{
							  "id":5,
							  "header": "DT",
							  "perfect_score": 100,
							  "percentage": 10,
							  "base": 0
							}
						  ]
						}
					  ]
					}
					
				
			}
		);
});