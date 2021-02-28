
var PresetImplError = function(message) {
    this.message = message;
    this.name = "";
}
PresetImplError.prototype = Object.create(Error.prototype);
PresetImplError.prototype.constructor = PresetImplError;


module.exports = {
    name: "preset",
    synonims: {
        "preset": "preset"
    },

    
    defaultProperty: {
        "preset": "commandset",
    },

    help: {
        synopsis: "Get deep copy of variable and set context",
        name: {
            "default": "return",
            synonims: []
        },
        input:["any"],
        output:"type of variable",
        "default param": "path",
        params: [
            {
                name: "path",
                synopsis: "Json path to selected value (optional). If 'value' is not assigned then storage will be restored.",
                type:["json-path"],
                synonims: ["var"],
                "default value": "$"
            },{
                name: "as",
                synopsis: "Json as to selected value (optional). If 'value' is not assigned then storage will be restored.",
                type:["json-path"],
                synonims: ["type"],
                "default value": "$"
            }
        ],
        example: {
            description: "Inspect variables",
            code:  "<?json \r\n    \"Hello\" \r\n?>\r\nset(\"str\")\r\n\r\n<?javascript \r\n    var notNull = function(item){\r\n        return item != undefined\r\n        \r\n    }; \r\n?>\r\nset(\"functions\")\r\n\r\nload(\r\n    ds:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\", \r\n    as:'json'\r\n)\r\n\r\nselect(\"$.metadata.dataset.commit\")\r\n\r\nset(var:\"commitNote\", val:\"$[0].note\")\r\nget(\"str\")\r\ninfo()\r\nget(\"functions.notNull\")\r\ninfo()\r\nget(\"commitNote\")\r\ninfo()\r\n// equals for previus\r\nget(\"$.commitNote\")\r\ninfo()\r\nlog()\r\n"

        }

    },


    execute: function(command, state, script) {
        if(command.settings.commandset){
            if(command.settings.commandset == 'data management'){
                state.head = {
                    data: {preset:'data management'},
                    type: "json"
                }
                return state
            }else{
                throw new PresetImplError("Preset '"+command.settings.commandset+"' is not available. Current preset is 'data managenment'")
            }
        }
        state.head = {
                    data: {preset:'data management'},
                    type: "json"
                }
        return state
    }    
}
