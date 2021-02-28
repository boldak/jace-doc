let bbn = require("./utils");
let util = require("util");
let _ = require("lodash-node");

let BBNImplError = function(message) {
    this.message = message;
    this.name = "Command 'collection.map' implementation error";
}
BBNImplError.prototype = Object.create(Error.prototype);
BBNImplError.prototype.constructor = BBNImplError;


module.exports = {
    name: "bbn.create",
    synonims: {
        "bbn.create": "bbn.create"
    },

    "internal aliases": {
        "options": "options"
    },

    defaultProperty: {
        "bbn.create": "options"
    },

    execute: function(command, state, config) {
        
        if(!command.settings.options)
            throw new BBNImplError("Undefined bayes network options")
                
        try {

            state.head = {
                data: bbn(command.settings.options),
                type: "json"
            }

        } catch (e) {
            throw new BBNImplError(e.toString())
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
