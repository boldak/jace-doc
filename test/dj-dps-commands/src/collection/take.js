let util = require("util");
let _ = require("lodash-node");

let TakeImplError = function(message) {
    this.message = message;
    this.name = "Command 'collection.take' implementation error";
}
TakeImplError.prototype = Object.create(Error.prototype);
TakeImplError.prototype.constructor = TakeImplError;


module.exports = {
    name: "collection.take",
    synonims: {
        "collection.take": "collection.take",
        "collection.limit": "collection.take",
        "c.take": "collection.take",
        "c.limit": "collection.take",
          
    },

    "internal aliases": {
        "start": "start",
        "stop": "stop",
        "range":"range"
    },

    defaultProperty: {
        "collection.take": "stop",
        "collection.limit": "stop",
        "c.take": "stop",
        "c.limit": "stop"
    },

    execute: function(command, state, config) {
        
        // if (state.head.type != "json") 
        //     throw new GroupImplError("Incompatible context type: '" + state.head.type + "' Use 'json()' command for convert context to 'json' type.")
        
        if (!util.isArray(state.head.data)) 
            throw new TakeImplError("Incompatible context type: '" + (typeof state.head.data)+".")
             
       command.settings.start = command.settings.start || 1;
       command.settings.stop =  command.settings.stop || 5;

       if(command.settings.range && util.isArray(command.settings.range) && command.settings.range.length == 2){
            command.settings.start = command.settings.range[0];
            command.settings.stop =  command.settings.range[1];
       }
        
        
        try {

            state.head = {
                data: state.head.data.filter( (v,idx) => idx >= (command.settings.start-1) && idx <= (command.settings.stop-1)),
                type: "json"
            }

        } catch (e) {
            throw new TakeImplError(e.toString())
        }

        return state;
    },

    help: {
        synopsis: "Build groups from context via javascript callback",

        name: {
            "default": "group",
            synonims: []
        },
        input:["json"],
        output:"json",
        "default param": "mapper",

        params: [{
            name: "transform",
            synopsis: "javascript callback function(item){<return {key, value}>} via bindable (required)",
            type:["bindable"],
            synonims: [],
            "default value": "none"
        }],

        example: {
            description: "Build list of tags",
            code:   "<?javascript\r\n   \r\n   $context.mapper = function(d){\r\n       return {\r\n           key:d, \r\n           value:d\r\n           \r\n       }\r\n   };\r\n   \r\n   $context.transform = function(d){\r\n        return {\r\n            key:d.key, \r\n            count: d.values.length\r\n        }\r\n   };\r\n   \r\n   $context.criteria = function(a,b){\r\n       return b.count-a.count\r\n   };\r\n   \r\n?>\r\n\r\nmeta('$..dataset.topics.*')\r\n\r\ngroup({{mapper}})\r\nmap({{transform}})\r\nsort({{criteria}})\r\n\r\nextend()\r\ntranslate()\r\n"

        }
    }
}
