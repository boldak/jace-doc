let util = require("util");
let _ = require("lodash-node");

let MapCollImplError = function(message) {
    this.message = message;
    this.name = "Command 'collection.map' implementation error";
}
MapCollImplError.prototype = Object.create(Error.prototype);
MapCollImplError.prototype.constructor = MapCollImplError;


module.exports = {
    name: "collection.map",
    synonims: {
        "collection.map": "collection.map",
        "collection.transform": "collection.map",
        "c.map": "collection.map",
        "c.transform": "collection.map"
    },

    "internal aliases": {
        "mapper": "mapper",
        "as": "mapper",
        "map": "mapper"
    },

    defaultProperty: {
        "collection.map": "mapper",
        "collection.transform": "mapper",
        "c.map": "mapper",
        "c.transform": "mapper"
    },

    execute: function(command, state, config) {
        
        // if (state.head.type != "json") 
        //     throw new GroupImplError("Incompatible context type: '" + state.head.type + "' Use 'json()' command for convert context to 'json' type.")
        
        if (!util.isArray(state.head.data)) 
            throw new MapCollImplError("Incompatible context type: '" + (typeof state.head.data)+".")
             
        command.settings.mapper = (command.settings.mapper) ? command.settings.mapper : item=>item 
        
        if(!util.isFunction(command.settings.mapper))
            throw new MapCollImplError("Unexpected mapper type: '" + (typeof command.settings.mapper)+".")
        
        
        try {

            state.head = {
                data: state.head.data.map(command.settings.mapper),
                type: "json"
            }

        } catch (e) {
            throw new MapCollImplError(e.toString())
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
