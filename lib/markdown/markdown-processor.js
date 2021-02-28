const p = require("path");

const globby = require("globby");
const _ = require("lodash");

const generateOutputPath = require("../util/generate-output-path");
const MarkdownParser = require("./markdown-parser");
const writeFile = require("../fs/write-file");
const micromatch = require('micromatch');

const INDEX_FILENAME = /index.html$/i;

class MarkdownProcessor {
  /**
   * Create MarkdownProcessor instance.
   * @param  {String}       options.source          - The markdown source directory.
   * @param  {String}       options.output          - The output directory.
   * @param  {UrlGenerator} options.urlGenerator    - The UrlGenerator instance.
   * @param  {String}       options.defaultTemplate - The default template to use.
   * @param  {Renderer}     options.renderer        - The Renderer instance.
   * @param  {Object}       options.parserOptions   - The markdown parser options.
   */
  constructor({
    source = process.cwd(),
    includes,
    output,
    urlGenerator,
    defaultTemplate = "post.njk",
    renderer,
    parserOptions = {}
  }) {
    this.source = source;
    this.includes = includes;
    
    this.output = output;
    this.urlGenerator = urlGenerator;
    this.defaultTemplate = defaultTemplate;
    this.renderer = renderer;
    this.parser = new MarkdownParser(parserOptions);
  }

  /**
   * Process all markdown files.
   * @return {Object}
   */
  async processAll() {
    const pages = await this.collectData();

    this.renderer.addGlobal("pages", pages);
    // this.renderer.addGlobal("posts", posts);
    // this.renderer.addGlobal("collections", collections);

    // await Promise.all(posts.map(post => this.writeHtml(post)));

    await Promise.all(pages.map(page => this.writeHtml(page)));

    return { pages };
  }

  /**
   * Collect parsed markdown data.
   * @return {Object}
   */
  async collectData() {
    const items = await this.parseAllFiles();

    
    items.forEach(item => {
      if(!item.frontMatter.refs) return
      item.frontMatter.dir = p.dirname(item.outputPath)
      let pattern = item.frontMatter.refs
      item.frontMatter.refs = {
        pattern,
        items: items.filter( f => {
          if(f.outputPath == item.outputPath) return false
          return micromatch.isMatch(f.outputPath.replace(item.frontMatter.dir,"").replace(/\\/g,"/").substring(1), pattern)
        }).map( f => ({
          title: f.frontMatter.title,
          url: f.url
        }))
      }
    })

    
    // const pages = items.filter(item => item.frontMatter.page);

    // const posts = _.orderBy(
    //   items.filter(item => !item.frontMatter.page),
    //   "frontMatter.date",
    //   "desc"
    // );

    // const collections = _.groupBy(posts, "collectionName");

    return items;
  }

  /**
   * Write the markdown data to HTML file.
   * @param  {Object} data - The parsed markdown data.
   * @return {Promise}
   */
  async writeHtml(data) {
    const template = data.frontMatter.template
      ? data.frontMatter.template
      : this.defaultTemplate;

    const html = this.renderer.render(template, {
      ...data
      // ,
      // collection: this.renderer.getGlobal("collections")[data.collectionName]
    });

    return writeFile(data.outputPath, html);
  }

  /**
   * Parse all markdown files.
   * @return {Array}
   */
  async parseAllFiles() {
    const files = await this.getFiles();
    console.log(files)
    return Promise.all(files.map(file => this.parseFile(file)));
  }

  /**
   * Parse the given markdown file.
   * @param  {String} path - The markdown file to parse.
   * @return {Object}
   */
  async parseFile(path) {
    const sourcePath = p.resolve(this.source, path);

    const { frontMatter, html } = await this.parser.parseFile(sourcePath);

    const outputPath = generateOutputPath(sourcePath, {
      sourceRoot: this.source,
      outputRoot: this.output,
      ext: ".html"
    });

    const outputPathRel = p.relative(this.output, outputPath);
    const { dir } = p.parse(outputPathRel);

    const urlPath = INDEX_FILENAME.test(outputPathRel)
      ? outputPathRel.replace(INDEX_FILENAME, "")
      : outputPathRel;

    return {
      frontMatter,
      content: html,
      outputPath,
      url: this.urlGenerator.to(urlPath),
      relativeUrl: this.urlGenerator.relative(urlPath),
      collectionName: dir || "root"
    };
  }

  /**
   * Get all markdown files.
   * @return {Array}
   */
  async getFiles() {
    console.log(`Process ${this.source} ${this.includes}`)
    return globby(this.includes, {
      cwd: this.source
    });
  }
}

module.exports = MarkdownProcessor;
