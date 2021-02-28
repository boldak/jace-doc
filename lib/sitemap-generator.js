const p = require("path");

const _ = require("lodash");

const sm = require("sitemap");
const writeFile = require("./fs/write-file");

class SitemapGenerator {
  /**
   * Create a new SitemapGenerator instance.
   * @param  {String} options.output - The output path.
   */
  constructor({ output }) {
    this.output = output;
  }

  /**
   * Generate the sitemap.
   * @param  {Array} options.posts - List of posts data.
   * @param  {Array} options.pages - List of pages data.
   * @return {Promise}
   */
  async generate({ posts, pages }) {
    const postUrls = posts.map(post => SitemapGenerator.formatItem(post));

    const pageUrls = pages.map(page =>
      SitemapGenerator.formatItem(page, {
        changefreq: "daily"
      })
    );

    const sitemap = sm.createSitemapsAndIndex({
      urls: [...pageUrls.filter(Boolean), ...postUrls.filter(Boolean)]
    });

    const path = p.join(this.output, "sitemap.xml");

    return writeFile(path, sitemap.toString());
  }

  /**
   * Format page item.
   * @param  {Object} item         - The page data.
   * @param  {Object} defaultValue - The default value to set.
   * @return {Object}
   */
  static formatItem(item, defaultValue = {}) {
    if (_.get(item, "frontMatter.sitemap") === false) {
      return null;
    }

    const obj = {
      url: item.url,
      ...defaultValue,
      ..._.get(item, "frontMatter.sitemap", {})
    };

    if (_.has(item, "frontMatter.modifiedAt")) {
      obj.lastmodISO = item.frontMatter.modifiedAt.toISOString();
    } else if (_.has(item, "frontMatter.date")) {
      obj.lastmodISO = item.frontMatter.date.toISOString();
    }

    return obj;
  }
}

module.exports = SitemapGenerator;
