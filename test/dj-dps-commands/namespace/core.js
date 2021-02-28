module.exports = {
	namespace: "core",
	commands: 	require("./src/help")
				.concat(require("./src/var"))
		        .concat(require("./src/context"))
       			.concat(require("./src/json"))
     		    .concat(require("./src/version"))
        		.concat(require("./src/dps"))
        		.concat(require("./src/log"))
        		.concat(require("./src/javascript"))
        		.concat(require("./src/html"))
        		.concat(require("./src/xml"))
        		.concat(require("./src/csv"))
        		.concat(require("./src/text"))
}