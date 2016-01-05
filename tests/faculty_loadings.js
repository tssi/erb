"use strict";
define(['model'],function($model){
	return new $model(
			{
				meta:{
					title: 'Faculty Loadings',
				},
				data:[
					{
						"id": 1,
						"subject":{
						  "id":"ENGLSH1",
						  "name":" English",
						  "description":"English 1"
						},
						"sy": 2015,
						"educ_level":{
						  "name":"High School",
						  "id":"HS"
						},
						"section":{
							"id":1001,
							"name": "PILOT"
						},
						"year_level":{
							"id":"G7",
							"name":"Grade 7"
						}
					},
					{
						"id": 2,
						"subject":{
						  "id":"FILIP1",
						  "name":" Filipino",
						  "description":"Filipino 1"
						},
						"sy": 2015,
						"educ_level":{
						  "name":"High School",
						  "id":"HS"
						},
						"section":{
							"id":1001,
							"name": "PILOT"
						},
						"year_level":{
							"id":"G7",
							"name":"Grade 7"
						}
					},
					{
						"id": 3,
						"subject":{
						  "id":"SCIENCE1",
						  "name":" Science",
						  "description":"Science 1"
						},
						"sy": 2015,
						"educ_level":{
						  "name":"High School",
						  "id":"HS"
						},
						"section":{
							"id":1001,
							"name": "PILOT"
						},
						"year_level":{
							"id":"G7",
							"name":"Grade 7"
						}
					},
					{
						"id": 4,
						"subject":{
						  "id":"MATH1",
						  "name":"Mathematics",
						  "description":"Mathematics 1"
						},
						"sy": 2015,
						"educ_level":{
						  "name":"High School",
						  "id":"HS"
						},
						"section":{
							"id":1001,
							"name": "PILOT"
						},
						"year_level":{
							"id":"G7",
							"name":"Grade 7"
						}
					},
				]
			}
		);
});