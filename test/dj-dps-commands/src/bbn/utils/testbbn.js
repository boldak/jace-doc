let bbn = require("./index")

let model = {
	"metadata":{
		"type":"bbn-model"
	},
	"variables": {
		"High" : {
	  		"domain":["true", "false"],
	  		"layer":"output",
	  		"causes":[{
	  			"ref": "Traffic",
	  			"metadata": {}
	  		}],
	  		"cpt":[
	  			[1,0],
	  			[0,1],
	  			[0,1]
	  		],
	  		"metadata": {}
	  	},
	  	"Medium": {
	  		"domain":["true", "false"],
	  		"layer":"output",
	  		"causes":[{
	  			"ref": "Traffic",
	  			"metadata": {}
	  		}],
	  		"cpt":[
	  			[0,1],
	  			[1,0],
	  			[0,1]
	  		],
	  		"metadata": {}
	  	},
	  	"Low": {
	  		"domain":["true", "false"],
	  		"layer":"output",
	  		"causes":[{
	  			"ref": "Traffic",
	  			"metadata": {}
	  		}],
	  		"cpt":[
	  			[0,1],
	  			[0,1],
	  			[1,0]
	  		],
	  		"metadata": {}
	  	},
	  	
	  	"Traffic": {
	  		"domain":["high", "medium", "low"],
	  		"layer":"model",
	  		"causes":[{
	  			"ref": "Day",
	  			"metadata": {}
	  		},{
	  			"ref": "Time",
	  			"metadata": {}
	  		}],
	  		"cpt":[
			   [0.70, 0.25, 0.05],
			   [0.20, 0.40, 0.40],
			   [0.75, 0.22, 0.03],
			   [0.15, 0.30, 0.55],

			   [0.70, 0.25, 0.05],
			   [0.20, 0.40, 0.40],
			   [0.75, 0.22, 0.03],
			   [0.15, 0.30, 0.55],
			   
			   [0.70, 0.25, 0.05],
			   [0.20, 0.40, 0.40],
			   [0.75, 0.22, 0.03],
			   [0.15, 0.30, 0.55],
			   
			   [0.70, 0.25, 0.05],
			   [0.20, 0.40, 0.40],
			   [0.75, 0.22, 0.03],
			   [0.15, 0.30, 0.55],
			   
			   [0.70, 0.25, 0.05],
			   [0.20, 0.40, 0.40],
			   [0.75, 0.22, 0.03],
			   [0.15, 0.30, 0.55],
			   
			   [0.70, 0.25, 0.05],
			   [0.20, 0.40, 0.40],
			   [0.75, 0.22, 0.03],
			   [0.15, 0.30, 0.55],
			   
			   [0.30, 0.40, 0.30],
			   [0.20, 0.35, 0.45],
			   [0.65, 0.30, 0.05],
			   [0.40, 0.50, 0.10]
		  	],
	  		"metadata": {}
	  	},
	  	"Day": {
	  		"domain":["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
	  		"layer":"input",
	  		"causes":[],
	  		"metadata": {}
	  	},
	  	"Time": {
	  		"domain":["morning", "day", "evening", "night"],
	  		"layer":"input",
	  		"causes":[],
	  		"metadata": {}
	  	}
	}
}


let simulator = bbn(model)
let m = simulator.model
let evd = {
	"Day": {
		"monday": 1,
		"tuesday": 0,
		"wednesday": 0,
		"thursday": 0,
		"friday": 0,
		"saturday": 0,
		"sunday": 0
	},
	"Time": {
		"morning": 1,
		"day": 0,
		"evening": 0,
		"night": 0
	}
}

let c = simulator.simulate(evd)

console.log(JSON.stringify(c,null,"\t"))

// evd.Time = "night"
// c = simulator.getConclusions(evd)

// console.log(JSON.stringify(c,null,"\t"))