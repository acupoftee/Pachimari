'use strict'

/**
 * @class Article
 * @description Represents an Overwatch League Article
 */
class Article {
  /**
   * Instantiates a new Article object
   * @constructor
   * @param {number} blogId blog integer identifier
   * @param {number} publish date published
   * @param {string} title Article title
   * @param {string} author Article author
   * @param {string} summary Article summary
   * @param {string} defaultUrl default Article URL
   */
  constructor (blogId, publish, title, author, summary, defaultUrl) {
    this._blogId = blogId
    this._publish = publish
    this._title = title
    this._author = author
    this._summary = summary
    this._defaultUrl = defaultUrl
  }

  /**
   * Returns an article ID
   * @returns {number} an article id
   */
  get blogId () {
    return this._blogId
  }

  /**
   * Returns an integer representing the publish date
   * @returns {number} publish date
   */
  get publish () {
    return this._publish
  }

  /**
   * Returns the title of the article
   * @returns {string} article title
   */
  get title () {
    return this._title
  }

  /**
   * Returns the author of the article
   * @returns {string} article author
   */
  get author () {
    return this._author
  }

  /**
   * Returns the summary of the article
   * @returns {string} article summary
   */
  get summary () {
    return this._summary
  }

  /**
   * Returns the default url of the article
   * @returns {string} article default url
   */
  get defaultUrl () {
    return this._defaultUrl
  }
}
module.exports = Article
