let util = require("util");
let _ = require("lodash-node");

let GroupByImplError = function(message) {
    this.message = message;
    this.name = "Command 'collection.groupby' implementation error";
}
GroupByImplError.prototype = Object.create(Error.prototype);
GroupByImplError.prototype.constructor = GroupByImplError;

module.exports = {
    name: "collection.groupby",
    synonims: {
        "collection.groupby": "collection.groupby",
        "collection.groupBy": "collection.groupby",
        "c.groupby": "collection.groupby",
        "c.groupBy": "collection.groupby",
        "c.group": "collection.groupby" 
    },

    "internal aliases": {
        "criteria": "criteria",
        "by": "criteria"
    },

    defaultProperty: {
        "collection.groupby": "criteria",
        "collection.groupBy": "criteria",
        "c.groupby": "criteria",
        "c.groupBy": "criteria",
        "c.group": "criteria" 
    },

    execute: function(command, state, config) {
        
        // if (state.head.type != "json") 
        //     throw new GroupImplError("Incompatible context type: '" + state.head.type + "' Use 'json()' command for convert context to 'json' type.")
        
        if (!util.isArray(state.head.data)) 
            throw new GroupByImplError("Incompatible context type: '" + (typeof state.head.data)+".")
        
        if(!command.settings.criteria)
            throw new GroupByImplError("Group criteria not defined.")
        
        if(!util.isFunction(command.settings.criteria)){
            let attr_name = command.settings.criteria
            command.settings.criteria = item => item[attr_name]
        }
        
        try {

            let res = _.unique(
                state.head.data.map( d => command.settings.criteria(d))
            )
            
            res = res.map(d => ({
                group: d,
                values: state.head.data.filter(item => command.settings.criteria(item) == d)
            }))
           
            state.head = {
                data: res,
                type: "json"
            }

        } catch (e) {
            throw new GroupByImplError(e.toString())
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
