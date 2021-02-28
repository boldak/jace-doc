let util = require("util");
let _ = require("lodash-node")

var orderByImplError = function(message) {
    this.message = message;
    this.name = "Command 'collection.orderby' implementation error";
}
orderByImplError.prototype = Object.create(Error.prototype);
orderByImplError.prototype.constructor = orderByImplError;

module.exports = {
    name: "collection.orderby",
    synonims: {
        "collection.orderby": "collection.orderby",
        "collection.orderBy": "collection.orderby",
        "c.orderby": "collection.orderby",
        "c.orderBy": "collection.orderby",
         "c.order": "collection.orderby"
    },

    "internal aliases": {
        "criteria": "criteria",
        "by":"criteria",
        "order":"order",
        "as":"order"
    },

    defaultProperty: {
        "collection.orderby": "criteria",
        "collection.orderBy": "criteria",
        "c.orderby": "criteria",
        "c.orderBy": "criteria",
        "c.order": "criteria"
    },

    execute: function(command, state, config) {
        if (!util.isArray(state.head.data)) 
            throw new orderByImplError("Incompatible context type: '" + (typeof state.head.data)+"'.")
        
        // if(!command.settings.criteria) 
        //     throw new SortImplError("Criteria js callback not defined.")
        // if(!util.isFunction(command.settings.criteria))
        //     throw new SortImplError("Criteria js callback shuld be a js function.")
        command.settings.criteria = (util.isArray(command.settings.criteria)) ? command.settings.criteria : [command.settings.criteria]
        if(!command.settings.order) command.settings.order = command.settings.criteria.map( d => "asc")
        command.settings.order = (util.isArray(command.settings.order)) ? command.settings.order : [command.settings.order]


        try {
            state.head = {
                data: _.sortByOrder(state.head.data, command.settings.criteria, command.settings.order),
                type: "json"
            }
        } catch (e) {
            throw new orderByImplError(e.toString())
        }

        return state;
    },

    help: {
        synopsis: "Sort context items via javascript callback",

        name: {
            "default": "sort",
            synonims: []
        },
        input:["json"],
        output:"json",
        "default param": "criteria",

        params: [{
            name: "criteria",
            synopsis: "javascript callback function(a, b){< return  positive number if a>b >} via bindable (required)",
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
