"use strict";
define(['model'],function($model){
	return new $model(
			{
				meta:{
					title: 'Components',
				},
				data:[
						{
						  "id": "WWRK",
						  "name": "Written Work"
						},
						{
						  "id": "PTSK",
						  "name": "Performance Task"
						},
						{
						 "id": "QAST",
						  "name": "Quarterly Assessment"
						}
					]
			}
		);
});