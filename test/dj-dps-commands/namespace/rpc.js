module.exports = {
	namespace: "rpc",
	commands: 	require("./src/help")
				.concat(require("./src/var"))
		        .concat(require("./src/context"))
       			.concat(require("./src/json"))
     		    .concat(require("./src/version"))
        		.concat(require("./src/dps"))
        		.concat(require("./src/log"))
        		.concat(require("./src/javascript"))
}