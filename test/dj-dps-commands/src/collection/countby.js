let util = require("util");
let _ = require("lodash-node");

let CountByImplError = function(message) {
    this.message = message;
    this.name = "Command 'collection.map' implementation error";
}
CountByImplError.prototype = Object.create(Error.prototype);
CountByImplError.prototype.constructor = CountByImplError;


module.exports = {
    name: "collection.countby",
    synonims: {
        "collection.countby": "collection.countby",
        "collection.countBy": "collection.countby",
        "c.countby": "collection.countby",
        "c.countBy": "collection.countby",
        "c.count": "collection.countby"
    },

    "internal aliases": {
        "mapper": "mapper",
        "by": "mapper"
    },

    defaultProperty: {
        "collection.countby": "mapper",
        "collection.countBy": "mapper",
        "c.countby": "mapper",
        "c.countBy": "mapper",
        "c.count": "mapper"
          
    },

    execute: function(command, state, config) {
        
        if (!util.isArray(state.head.data)) 
            throw new CountByImplError("Incompatible context type: '" + (typeof state.head.data)+".")
             
        command.settings.mapper = (command.settings.mapper) ? command.settings.mapper : item => item 
        
        // if(!util.isFunction(command.settings.mapper))
        //     throw new CountByImplError("Unexpected mapper type: '" + (typeof command.settings.mapper)+".")
        
        
        try {

            state.head = {
                data: _.countBy(state.head.data, command.settings.mapper),
                type: "json"
            }

        } catch (e) {
            throw new CountByImplError(e.toString())
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
