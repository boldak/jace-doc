const p = require("path");
const { URL } = require("url");

const UrlGenerator = require("./url-generator");

const PRODUCTION = "production";

const PROTOCOL = /^http[s]?:\/\//i;

class Config {
  /**
   * Create new config instance.
   * @param {Object} options - The site configuration options.
   */
  constructor(options = {}) {
    this.options = { ...Config.defaultOptions, ...options };

    this.parseOptions(this.options);

    return new Proxy(this, {
      get(config, prop) {
        return prop in config ? config[prop] : config.options[prop];
      }
    });
  }

  /**
   * Parse the config options.
   * @param  {Object} options - The config options.
   * @return {Void}
   */
  parseOptions(options) {
    this.cwd = p.resolve(options.cwd);
    this.source = p.resolve(this.cwd, options.source);
    this.output = p.resolve(this.cwd, options.output);
    this.templatesPath = (options.templates) ? p.resolve(options.templates) : require.resolve("jace-doc/templates");
    this.assetsPath = (options.assets) ? p.resolve(options.assets) : require.resolve("jace-doc/assets");
    this.includes = options.includes

    const url = PROTOCOL.test(options.url)
      ? options.url
      : `${options.protocol || "http"}://${options.url}`;

    this.url = new URL(url);
    console.log(JSON.stringify(options, null," "))
    console.log("baseUrl", this.url)
    
    if (!this.isProduction()) {
      this.url.protocol = "http:";
      this.url.hostname = "localhost";
      this.url.pathname = "/";

      if (!this.url.port) {
        this.url.port = 4000;
      }
    }

    this.urlGenerator = new UrlGenerator(this.url);
  }

  /**
   * Check if it's a production environment.
   * @return {Boolean}
   */
  isProduction() {
    return this.options.env.toLowerCase() === "production";
  }

  /**
   * Get the default config options.
   * @return {Object}
   */
  static get defaultOptions() {
    return {
      env: process.env.NODE_ENV ? process.env.NODE_ENV : PRODUCTION,
      watch: false,
      url: "http://localhost:4000/",
      cwd: process.cwd(),
      verbose: true,
      source: "src",
      includes:["**/*.(md|markdown)","!**/node_modules"],
      output: "public",
      templates: "",
      assets:"",
      defaultDateFormat: "YYYY-MM-DD HH:mm:ss",
      defaultTemplate: "post.njk",
      copyFiles: ["**/*.*","!**/*.css"],//["images/**", "robot.txt", "**/*.html"],
      markdown: {},
      markdownAnchor: {
        permalink: true
      },
      markdownToc: {
        containerHeaderHtml: "<h2>Table of Contents</h2>",
        includeLevel: [2, 3, 4]
      },
      postcssPresetEnv: {
        stage: 3,
        preserve: false
      }
    };
  }
}

module.exports = Config;
