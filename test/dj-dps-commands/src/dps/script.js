let Promise = require("bluebird");
let _ = require("lodash-node");
let Script = require("../../../dj-dps-interpreter");
let http = require('axios');
let util = require("util")

let DPSRunError = function(message) {
    this.message = message;
    this.name = "Command 'run' implementation error";
}
DPSRunError.prototype = Object.create(Error.prototype);
DPSRunError.prototype.constructor = DPSRunError;

let getUrl = (url, body) => new Promise( (resolve, reject) => {
        var options = {
            method: 'POST',
            url: url,
            data: body
        }
        
        try{
            http(options)
                .then(result => { resolve(result.data) })
                .catch(e => { reject(new DPSRunError(url+" > "+e.toString())) })
        } catch(e){
            reject (new DPSRunError(e.toString()))
        }        
    })


let remoteCall = (script, args, state, config) => {
    try{
            
            var storage = copy(state.storage);
            storage._arguments = copy(args)
            
            var remoteState = {
                _lib: state._lib,
                locale: state.locale,
                storage: storage,
                head: copy(state.head)
            }
            var url = args.host + "/api/script"
            return getUrl(url,{state: remoteState, script: script, client: state.client, locale:state.locale})
                .then(result => {
                    state.head = result;
                    return state;
                })
        }catch (e){
            throw new DPSRunError(e.toString())
        }
}

let copy = object => {
    
    if( util.isArray(object)) return res.map(d => d)
    if( util.isString(object)) return object
    if( util.isObject(object)) return _.defaultsDeep( {} , object )
    return res    
}



var implementation = (script, args, state, config)  => new Promise( (resolve, reject) => {
        
        var parent = state.instance;
        var storage = copy(state.storage);
        storage._arguments = copy(args)

        var s = new Script()
            .config(state.instance.config())
            .script(script)
       
        s._state =   
        {
            locale: state.locale,
            client: state.client,
            instance: s,
            storage: storage,
            logger: state.logger,
            head: copy(state.head),
            _lib: state._lib
        }

        s.run()
            .then(result => {
                state.head = result;
                state.storage._args = undefined;
                resolve(state)
            })
            .catch(e => { reject(e) })
    
    })


module.exports = {
    name: "run",
    synonims: {
        "run": "run",
        "execute": "run",
        "exec": "run"
    },
    "internal aliases": {
        "script": "script",
        "at": "host",
        "on": "host",
        "host": "host",
        "server":"host"
    },

    implementation: implementation,

    defaultProperty: {
        "run": "script",
        "execute": "script",
        "exec": "script"

    },

    execute: (command, state, config) => {

        try {
            return new Promise( (resolve, reject) => {
                if (!command.settings.script && state.head.type != "dps")
                    throw new DPSRunError("Incompatible context type: '" + state.head.type + "'. Use 'dps()' command to convert context to 'dps' type")
                var script = (command.settings.script) ? command.settings.script : state.head.data;
                var host = command.settings.host;
                if(host){

                    remoteCall(script, command.settings, state, config)
                        .then(result => { resolve(result) })
                        .catch(e => {reject(e)})
                }else{
                
                    implementation(script, command.settings, state, config)
                        .then( result => { resolve(result) })
                        .catch(e => {reject(e)})
                }        

            })
        } catch (e) {
            throw e
        }

    },

    help: {
        synopsis: "Run DJ DP script",

        name: {
            "default": "run",
            synonims: ["run", "execute", "exec"]
        },
        input: ["any", "dps (if script is not assigned)"],
        output: "output context of executed script",

        "default param": "script",
        params: [{
            name: "script",
            synopsis: "Bindable script (optional). If script is not assigned then input context will be interpreted as script.",
            type: ["bindable"],
            synonims: [],
            "default value": "script context"
        },{
            name: "host",
            synopsis: "Provision of client-server format in server mode.",
            type: ["bindable"],
            synonims: ["at", "on", "server"],
            "default value": "none"
        }],
        example: {
            description: "Run script",
            code: "<?javascript\r\n    \r\n    $context.rowMapper = function(d){\r\n      return \"<tr>\"+ d.value.map(function(v){\r\n         return \"<td style=\\\\\"font-size:x-small\\\\\">\"+v+\"</td>\"\r\n      }).join(\"\")+\"</tr>\"\r\n    };\r\n\r\n?>\r\n\r\n<?dps\r\n\r\n    map({{rowMapper}})\r\n    concat()\r\n    html()\r\n    wrapHtml(tag:\"table\", class:\"skin\", style:'background:#ded;')\r\n\r\n?>\r\nset(\"t2html\")\r\n\r\n\r\n\r\nload(\r\n    ds:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\",\r\n    as:'dataset'\r\n)\r\n\r\nproj([\r\n    {dim:\"time\", as:\"row\"},\r\n    {dim:\"indicator\",as:\"col\"}\r\n])\r\n\r\nformat(2)\r\njson()\r\nselect(\"$.body.*\")\r\nrun({{t2html}})\r\n"

        }
    }
}
