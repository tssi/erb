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
							"header": "Total",
							"is_item":false,
							"is_abbrev":false,
						},
						{
							"header": "P.S",
							"tooltip": "Perfect Score",
							"is_item":false,
							"is_abbrev":true,
						},
						{
							"header": "W.S",
							"tooltip": "Weighted Score",
							"is_item":false,
							"is_abbrev":true,
						},
						{
							"component_id": 2,
							"header": "Project",
							"perfect_score": 100,
							"percentage": 10,
							"base": 0,
							"is_item":true
						},
						{
							"header": "Total",
							"is_item":false,
							"is_abbrev":false,
						},
						{
							"header": "P.S",
							"tooltip": "Perfect Score",
							"is_item":false,
							"is_abbrev":true,
						},
						{
							"header": "W.S",
							"tooltip": "Weighted Score",
							"is_item":false,
							"is_abbrev":true,
						},
						{
							"component_id": 3,
							"header": "DT",
							"perfect_score": 100,
							"percentage": 10,
							"base": 0,
							"is_item":true
						},
						{
							"header": "Total",
							"is_item":false,
							"is_abbrev":false,
						},
						{
							"header": "P.S",
							"tooltip": "Perfect Score",
							"is_item":false,
							"is_abbrev":true,
						},
						{
							"header": "W.S",
							"tooltip": "Weighted Score",
							"is_item":false,
							"is_abbrev":true,
						}
					
				  ]
					
				
			}
		);
});