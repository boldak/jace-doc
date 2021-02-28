let util = require("util");

var ZipImplError = function(message) {
    this.message = message;
    this.name = "Command 'collection.zip' implementation error";
}
ZipImplError.prototype = Object.create(Error.prototype);
ZipImplError.prototype.constructor = ZipImplError;


module.exports = {
    name: "collection.zip",

    synonims: {
        "collection.zip": "collection.zip",
        "c.zip": "collection.zip"
    },

    "internal aliases":{
        "mapper": "mapper",
        "by": "mapper",
        "for": "mapper"
    },

    defaultProperty: {
        "collection.zip": "mapper",
        "c.zip": "mapper"
    },

    execute: function(command, state, config) {

        try {

            command.settings.mapper = (command.settings.mapper) ? command.settings.mapper : Object.keys(state.head.data[0])        
            command.settings.mapper = (util.isArray(command.settings.mapper)) ? command.settings.mapper : [command.settings.mapper];

            let res = {}
            command.settings.mapper.forEach( field => {
                res[field] = state.head.data.map( d => d[field])
            })
            
           state.head = {
                type: "json",
                data: res
            }

        } catch (e) {
            throw new ZipImplError(e.toString())
        }
        return state;
    },

    help: {
        synopsis: "Add rank",

        name: {
            "default": "rank",
            synonims: []
        },
        input:["table"],
        output:"table",
        "default param": "indexes",
        params: [{
            name: "direction",
            synopsis: "Direction of iteration (optional)",
            type:["Rows", "row", "Columns", "col"],
            synonims: ["direction", "dir", "for"],
            "default value": "Columns"
        }, {
            name: "indexes",
            synopsis: "Array of 0-based indexes of items that will be ranked (optional)",
            type:["array of numbers"],
            synonims: ["indexes", "items"],
            "default value": []
        }, {
            name: "asc",
            synopsis: "Define order (optional)",
            type:["A-Z", "az", "direct", "Z-A", "za", "inverse"],
            synonims: ["order", "as"],
            "default value": "A-Z"
        }],
        example: {
            description: "Rank first column values",
            code:   "load(\r\n    ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02',\r\n    as:\"dataset\"\r\n)\r\nproj([\r\n  { dim:'time', role:'row', items:[] },\r\n  { dim:'indicator', role:'col', items:[] }\r\n])\r\n\r\nrank(for:\"col\",items:[0],as:\"az\")\r\n\r\norder(by:0, as:\"az\")\r\n\r\n"
        }
    }
}

