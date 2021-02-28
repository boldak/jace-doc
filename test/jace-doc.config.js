module.exports = {
      url: "http://localhost:8098/doc/",
      source: "./test/dj-dps-commands",
      includes:["**/*.(md|markdown)","!**/node_modules","!**/public"],
      output: "./test/.tmp/public/doc",
      templates: "./templates",
      assets:"./assets"
}