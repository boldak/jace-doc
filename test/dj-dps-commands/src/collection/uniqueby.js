let util = require("util");
let _ = require("lodash-node");

var UniqueByImplError = function(message) {
    this.message = message;
    this.name = "Command 'collection.uniqueby' implementation error";
}
UniqueByImplError.prototype = Object.create(Error.prototype);
UniqueByImplError.prototype.constructor = UniqueByImplError;

module.exports = {
    name: "collection.uniqueby",
    synonims: {
        "collection.uniqueby": "collection.uniqueby",
        "collection.uniqueBy": "collection.uniqueby",
        "c.uniqueby": "collection.uniqueby",
        "c.uniqueBy": "collection.uniqueby",
        "c.unique": "collection.uniqueby",
           
    },

    "internal aliases": {
        "criteria": "criteria",
        "by": "criteria"
    },

    defaultProperty: {
        "collection.uniqueby": "criteria",
        "collection.uniqueBy": "criteria",
        "c.uniqueby": "criteria",
        "c.uniqueBy": "criteria",
        "c.unique": "criteria" 
    },

    execute: function(command, state, config) {
        
        // if (state.head.type != "json") 
        //     throw new GroupImplError("Incompatible context type: '" + state.head.type + "' Use 'json()' command for convert context to 'json' type.")
        
        if (!util.isArray(state.head.data)) 
            throw new UniqueByImplError("Incompatible context type: '" + (typeof state.head.data)+".")
        
        if(!command.settings.criteria)
            throw new UniqueByImplError("Unique criteria not defined.")
        
        if(!util.isFunction(command.settings.criteria)){
            let attr_name = command.settings.criteria
            command.settings.criteria = item => item[attr_name]
        }
        
        try {

            let res = _.unique(
                state.head.data.map( d => command.settings.criteria(d))
            )
            
            // res = res.map( d => _.find(state.head.data, item => command.settings.criteria(item) == d))
           
            state.head = {
                data: res,
                type: "json"
            }

        } catch (e) {
            throw new UniqueByImplError(e.toString())
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
