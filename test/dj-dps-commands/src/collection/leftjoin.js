let util = require("util");
let _ = require("lodash-node");
let JoinError = require("./joinerror")



module.exports = {
    name: "collection.leftjoin",
    synonims: {
        "collection.leftjoin": "collection.leftjoin",
        "collection.leftJoin": "collection.leftjoin",
        "c.leftjoin": "collection.leftjoin",
        "c.leftJoin": "collection.leftjoin" 
    },

    "internal aliases": {
        "criteria": "criteria",
        "by": "criteria",
        "on": "criteria",
        "with": "collection",
        "as": "mapper",
        "map": "mapper"
    },

    defaultProperty: {},

    execute: function(command, state, config) {
        
        // if (state.head.type != "json") 
        //     throw new GroupImplError("Incompatible context type: '" + state.head.type + "' Use 'json()' command for convert context to 'json' type.")
        
        if (!util.isArray(state.head.data)) 
            throw new JoinError("Incompatible context type: '" + (typeof state.head.data)+".")
        
        if(!command.settings.criteria)
            throw new JoinError("Join criteria not defined.")
        
        if(!util.isFunction(command.settings.criteria)){
            let attr_name = command.settings.criteria
            command.settings.criteria = (a,b) => a[attr_name] == b[attr_name]
        }

        if (!command.settings.collection) 
            throw new JoinError("Joined collection not defined.")
      
        if (!util.isArray(command.settings.collection)) 
            throw new JoinError("Incompatible collection type: '" + (typeof command.settings.collection)+".")
        
        command.settings.mapper = (command.settings.mapper) ? command.settings.mapper : item=>item 
        
        if(!util.isFunction(command.settings.mapper))
            throw new JoinError("Unexpected mapper type: '" + (typeof command.settings.mapper)+".")
        
        try {

           let result = []
           state.head.data.forEach( d => {
             let left = JSON.parse(JSON.stringify(d))
             let right_parts = command.settings.collection.filter( r => command.settings.criteria(d,r))
             if(right_parts.length == 0) right_parts = [null];
             right_parts.forEach( right => {
                result.push({left,right})
             })
           }) 

           result = result.map(command.settings.mapper)
           
            state.head = {
                data: result,
                type: "json"
            }

        } catch (e) {
            throw new JoinError(e.toString())
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
