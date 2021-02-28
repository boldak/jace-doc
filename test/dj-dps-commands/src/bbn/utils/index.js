let _ = require("lodash-node");

let moment = require("moment");

let jsbayes = require("./apea-jsbayes");

let util = require("util");


var UNDEF_VALUE_NAME = "_undef";
var VIRTUAL_NODE_NAME_START = "_virtual-";

let makeBbn = bbnModel => {
	// var jsbayes = require("./apea-jsbayes");
	let bbn = jsbayes.newGraph();
	
	_.keys(bbnModel.variables).forEach( name => {
		bbn.addNode(name, bbnModel.variables[name].domain.concat([UNDEF_VALUE_NAME]))
	})

	_.keys(bbnModel.variables).forEach( name => {
		let variable = bbnModel.variables[name];
		let currNode = bbn.node(name);
		variable.causes.forEach( c => {
			currNode.addParent(bbn.node(c.ref));
		})
		// setting cpt
		let cpt = (util.isArray(variable.cpt))?variable.cpt.map(d=>d):null;
		if (!cpt) {
			cpt = _.fill(Array(currNode.values.length), 1 / currNode.values.length);
		} else if (util.isArray(cpt[0])) {
			cpt.forEach( row => {
				row.push(0);               // for _undef
			});
			// for _undef logic
			let row = _.fill(Array(currNode.values.length), 0);
			row[row.length-1] = 1;
			// period of inserting
			var l = 1;
			// how many insert rows: [0, 0, ..., 1]
			var n = 1;
			for (var i = currNode.parents.length-1; i>=0; i--) {	
				l = l*currNode.parents[i].values.length;
				for (var index=l-n; index <= cpt.length; index+=l) {
					for (var j = 1; j <= n; j++) {
						cpt.splice(index, 0, row);
					}
				}
				n = l;
			};
		} else {
			cpt.push(0);
		}
		currNode.setCpt(cpt);
	})		
		
	return bbn
}

let _create = bbnModel => {
	// validateBbnModel(bbnModel);
	let bbnObj = makeBbn(bbnModel);
	let addNodeF = bbnObj.addNode;
	bbnObj.addNode = function(nodeName, values) {
		let node = addNodeF.call(this, nodeName, values);
		this.nodeMap = undefined;
		return node;
	}

	/** 
	 * Adding virtual evidence using hidden child node.
	 * Evidence looks like: {nodeValue1:prob1,... nodeValueN:probN}.
	 * If sum of probs < 1, than _undef=(1 - sum). 
	 */
	bbnObj._setVirtual = function(nodeName, evidence) {
		let node = this.node(nodeName);
		let probs = node.probs();
		if (probs.length == 0) {
			this.sample(100);
			probs = node.probs();
		}
		let hiddenNodeName = VIRTUAL_NODE_NAME_START+nodeName;
		let hiddenNode = this.node(hiddenNodeName);
		if (!hiddenNode) {
			hiddenNode = this.addNode(hiddenNodeName, ["active"]);
			hiddenNode.addParent(node);
		}
		let desired = new Array(probs.length);
		let desiredSum = 0;
		node.values.forEach((valueName, index) => {
			desired[index] = evidence[valueName] ? evidence[valueName] : 0;
			desiredSum += desired[index];
		});

		if(desiredSum > 1){
			desired = desired.map( d => d/desiredSum)
			desiredSum = 1
		}

		desired[node.values.indexOf(UNDEF_VALUE_NAME)] = 1 - desiredSum;

		let hiddenNodeCpt = new Array(probs.length);
		let sum = 0;
		probs.forEach((prob, index) => {
			hiddenNodeCpt[index] = (prob) ? [desired[index] / prob] : [0];
			sum += hiddenNodeCpt[index][0];
		});
		hiddenNodeCpt = hiddenNodeCpt.map( r => {
			r[0] = r[0]/sum;
			return r
		})
		
		hiddenNode.setCpt(hiddenNodeCpt);
		
		this.observe(hiddenNodeName, "active");

	}

	bbnObj.setEvidence = function(nodeName, evidence) {
		if (typeof evidence === "object") {
			this._setVirtual(nodeName, evidence);
		} else {
			this.observe(nodeName, evidence);
		}
	}

	return bbnObj
}	


module.exports = bbnModel => {
	

	return {
		// bbn: _create(bbnModel),
		model:bbnModel,
		
		// hides everything about hidden nodes and undefined values
		getConclusions: function(evidences, sampleNum) {
			this.bbn = _create(bbnModel)
			sampleNum = sampleNum || 100;
			_.keys(evidences).forEach( nodeName => {
				this.bbn.setEvidence(nodeName, evidences[nodeName])
				// this.bbn.sample(sampleNum);
				// this.bbn.unobserve(nodeName)
			})
			
            this.bbn.sample(sampleNum);
            
            let conclusions = {};
            
            this.bbn.nodes.forEach( node => {

            	if (!node.name.startsWith(VIRTUAL_NODE_NAME_START)) {
	                let probs = node.probs();
	                let conclusion = {};
	                node.values.forEach((valueName, index) => {
	                    conclusion[valueName] = probs[index];
	                });
	                // conclusion[UNDEF_VALUE_NAME] = undefined;
	                conclusions[node.name] = conclusion;
            	}
            });
            return conclusions;
		},

		simulate: function(evidences, sampleNum){
			return this.getConclusions(evidences, sampleNum)
		}
	}
}		
