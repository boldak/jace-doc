module.exports = 

    require("./src/help")
        // .concat(require("./src/dataset"))
        .concat(require("./src/nlp"))
        .concat(require("./src/context"))
        .concat(require("./src/var"))
        .concat(require("./src/json"))
        // .concat(require("./src/table"))
        // .concat(require("./src/stat"))
        // .concat(require("./src/chart"))
        .concat(require("./src/export"))
        .concat(require("./src/version"))
        .concat(require("./src/dps"))
        .concat(require("./src/log"))
        // .concat(require("./src/time-serie"))
        .concat(require("./src/javascript"))
        .concat(require("./src/html"))
        .concat(require("./src/xml"))
        .concat(require("./src/csv"))
        .concat(require("./src/text"))
        .concat(require("./src/permissions"))
        .concat(require("./src/storage"))
        .concat(require("./src/sendmail"))
        .concat(require("./src/profile"))
        .concat(require("./src/file"))
        .concat(require("./src/collection"))
        .concat(require("./src/matrix"))
        .concat(require("./src/statistic"))
        .concat(require("./src/timeline"))
        .concat(require("./src/bbn"))
        .concat(require("./src/service"))
        .concat(require("./src/markdown"))
        .concat(require("./src/lexer"))
        
        
        
console.log("SUPPORTED COMMANDS")
console.log(module.exports.map(item => item.name).join("\r\n"))



    
  