"use strict";
define(['model'],function($model){
	return new $model(
			{
				meta:{
					title: 'Template',
				},
				data:[
					{
					  "name": "K12 Science",
					  "sy": 2015,
					  "educ_level":{
						  "name":"High School",
						  "id":"HS"
					  },
					"subjects":["SIENCE1","SIENCE2","SIENCE3","SIENCE4"],
					"year_level":["G7","G8","G9","GX"]
					},
					{
					  "name": "K12 English",
					  "sy": 2015,
					  "educ_level": {
						  "name":"High School",
						  "id":"HS"
					  },
					 "subjects":["ENGLISH1","ENGLISH2","ENGLISH3","ENGLISH4"],
					  "year_level":["G7","G8","G9","GX"]
					},
					{
					  "name": "K12 Filipino",
					  "sy": 2015,
					  "educ_level": {
						  "name":"High School",
						  "id":"HS"
					  },
					  "subjects":["FILIPINO1","FILIPINO2","FILIPINO3","FILIPINO4"],
					 "year_level":["G7","G8","G9","GX"]
					},
					{
					  "name": "K12 Mathematics",
					  "sy": 2015,
					  "educ_level": {
						  "name":"High School",
						  "id":"HS"
					  },
					  "subjects":["MATH1","MATH2","MATH3","MATH4"],
					  "year_level":["G7","G8","G9","GX"]
					},
				]
			}
		);
});