let bbn = require("./utils")

let model = 
{
	"metadata":{
		"type":"bbn-model"
	},
	"variables": {
		
	  	"Traffic": {
	  		"domain":["high", "medium", "low"],
	  		"layer":"model",
	  		"causes":[
	  		{
	  			"ref": "Day",
	  			"metadata": {}
	  		},
	  		{
	  			"ref": "Time",
	  			"metadata": {}
	  		}],
	  		"cpt":[
			   
			   
			   [0, 0, 1],
			   [1, 0, 0],
			   [1, 0, 0],
			   [0, 0, 1],
			   
			   [0, 1, 0],
			   [0, 0, 1],
			   [1, 0, 0],
			   [0, 0, 1],
			   
			  // [1, 0, 0],
			  // [0, 1, 0],
			  // [1, 0, 0],
			  // [0, 0, 1],

			  // [1, 0, 0],
			  // [0, 1, 0],
			  // [1, 0, 0],
			  // [0, 0, 1]


			 //  [0.1, 0.1, 0.8],
			 //  [0.20, 0.70, 0.10],
			 //  [0.70, 0.20, 0.10],
			 //  [0.00, 0.05, 0.95]
			 //  ,
			   
			 //  [0.70, 0.25, 0.05],
			 //  [0.20, 0.50, 0.30],
			 //  [0.75, 0.22, 0.03],
			 //  [0.02, 0.02, 0.94],
			   
			 //  [0.70, 0.25, 0.05],
			 //  [0.20, 0.40, 0.40],
			 //  [0.75, 0.22, 0.03],
			 //  [0.15, 0.30, 0.55],
			   
			 //  [0.70, 0.25, 0.05],
			 //  [0.20, 0.40, 0.40],
			 //  [0.75, 0.22, 0.03],
			 //  [0.15, 0.30, 0.55],
			   
			 //  [0.70, 0.25, 0.05],
			 //  [0.20, 0.40, 0.40],
			 //  [0.75, 0.22, 0.03],
			 //  [0.15, 0.30, 0.55],
			   
			 //  [0.70, 0.25, 0.05],
			 //  [0.20, 0.40, 0.40],
			 //  [0.75, 0.22, 0.03],
			 //  [0.15, 0.30, 0.55]
		  	],
	  		"metadata": {}
	  	},
	  	"Day": {
	  		"domain":["work", "weekend"],//"monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
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
let evd = [
	// {Day:"work", Time:"day"},
	// {Day:"weekend", Time:"day"},
	// {Day:"weekend", Time:"morning"}
	{
		"Day": {
			"work": 1,
			"weekend": 0
		},
		"Time": {
			"morning": 1,
			"day": 0,
			"evening": 0,
			"night": 0
		}
	},
	{
		"Day": {
			"work": 0,
			"weekend": 1
		},
		"Time": {
			"morning": 1,
			"day": 0,
			"evening": 0,
			"night": 0
		}
	},
	// {
	// 	"Day": {
	// 		"work": 1,
	// 		"weekend": 0
	// 	},
	// 	"Time": {
	// 		"morning": 0,
	// 		"day": 1,
	// 		"evening": 0,
	// 		"night": 0
	// 	}
	// },
	// {
	// 	"Day": {
	// 		"work": 1,
	// 		"weekend": 0
	// 	},
	// 	"Time": {
	// 		"morning": 0,
	// 		"day": 0,
	// 		"evening": 1,
	// 		"night": 0
	// 	}
	// },{
	// 	"Day": {
	// 		"work": 1,
	// 		"weekend": 0
	// 	},
	// 	"Time": {
	// 		"morning": 0,
	// 		"day": 0,
	// 		"evening": 0,
	// 		"night": 1
	// 	}
	// },
	// {
	// 	"Day": {
	// 		"work": 0,
	// 		"weekend": 1
	// 	},
	// 	"Time": {
	// 		"morning": 1,
	// 		"day": 0,
	// 		"evening": 0,
	// 		"night": 0
	// 	}
	// },{
	// 	"Day": {
	// 		"work": 0,
	// 		"weekend": 1
	// 	},
	// 	"Time": {
	// 		"morning": 0,
	// 		"day": 1,
	// 		"evening": 0,
	// 		"night": 0
	// 	}
	// },{
	// 	"Day": {
	// 		"work": 0,
	// 		"weekend": 1
	// 	},
	// 	"Time": {
	// 		"morning": 0,
	// 		"day": 0,
	// 		"evening": 1,
	// 		"night": 0
	// 	}
	// }

]

evd.forEach( d => {
	let c = simulator.simulate(d)

	console.log(JSON.stringify(c,null,"\t"))

})

// evd.Time = "night"
// c = simulator.getConclusions(evd)

// console.log(JSON.stringify(c,null,"\t"))