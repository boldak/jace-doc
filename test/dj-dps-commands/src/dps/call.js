var Promise = require("bluebird");
let _ = require("lodash-node");
var http = require('axios');
// var set = require("../var/set").implementation;
var jp = require("jsonpath");
// var Script = require("../../index");
// var copy = require("../modules/dj-utils").copy;
var util = require("util");

var CallImplError = function(message) {
    this.message = message;
    this.name = "Command 'call' implementation error";
}
CallImplError.prototype = Object.create(Error.prototype);
CallImplError.prototype.constructor = CallImplError;

var getUrl = function(url, body) {
    return new Promise(function(resolve, reject) {
        var options = {
            method: 'POST',
            url: url,
            data: body
        }
        
        http(options)
            .then(function(result) {
                // console.log("resolve call "+ JSON.stringify(result))
                resolve(result.data)
            })
            .catch(function(e) {
                reject(new CallImplError(url+" > "+e.toString()))
            })
    })
}



let copy = object => {
    
    if( util.isArray(object)) return res.map(d => d)
    if( util.isString(object)) return object
    if( util.isObject(object)) return _.defaultsDeep( {} , object )
    return res    
}



module.exports = {
    name: "call",
    synonims: {
        "call": "call",
        "ext": "call",
        "extension": "call"
    },


    "internal aliases": {
        "path": "path",
        "extension": "path",
        "ext": "path"
    },

    defaultProperty: {
        "call": "path",
        "ext": "path",
        "extension": "path"
    },

    execute: function(command, state, config) {
    	
    	if (!state._lib)
            throw new CallImplError("Library not defined"
            	)
        if (!command.settings.path)
            throw new CallImplError("Cannot call undefined extension")
        
        
        var extention = _.get(state._lib, command.settings.path);
        // console.log("call for "+extention.name)
        if(!extention) 
            throw new CallImplError("Extension "+command.settings.path+" not found")
        
        var url = extention.call;
        if(!url)
            throw new CallImplError("Extension "+command.settings.path+"cannot be called on server side")
            
        try{
            
            var storage = copy(state.storage);
            storage._arguments = copy(command.settings)
            
            var remoteState = {
                locale: state.locale,
                storage: storage,
                head: copy(state.head)
            }

            return getUrl(url,{state: remoteState})
                .then(result => {
                    state.head = result;
                    return state;
                })
        }catch (e){
        	throw new CallImplError(e.toString())
        }
    },

    help: {
        synopsis: "Call from server",
        name: {
            "default": "call",
            synonims: []
        },
        input: ["any"],
        output: "type of variable",
        "default param": "path",
        params: [{
            name: "path",
            synopsis: "Json path to selected value (optional). If 'value' is not assigned then storage will be restored.",
            type: ["json-path"],
            synonims: ["path", "extension", "ext"],
            "default value": "$"
        }],
        example: {
            description: "Inspect variables",
            code: "<?json \r\n    \"Hello\" \r\n?>\r\nset(\"str\")\r\n\r\n<?javascript \r\n    var notNull = function(item){\r\n        return item != undefined\r\n        \r\n    }; \r\n?>\r\nset(\"functions\")\r\n\r\nload(\r\n    ds:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\", \r\n    as:'json'\r\n)\r\n\r\nselect(\"$.metadata.dataset.commit\")\r\n\r\nset(var:\"commitNote\", val:\"$[0].note\")\r\nget(\"str\")\r\ninfo()\r\nget(\"functions.notNull\")\r\ninfo()\r\nget(\"commitNote\")\r\ninfo()\r\n// equals for previus\r\nget(\"$.commitNote\")\r\ninfo()\r\nlog()\r\n"

        }

    }
}
