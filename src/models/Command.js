'use strict'

/**
 * Super class for all command objects
 */
class Command {
  /**
 * Instantiates a new Command object via subclass
 * @constructor
 */
  constructor () {
    /**
     * Sets the name of the Command
     * @type {String}
     * @public
     */
    this._name = null

    /**
     * Sets the Command description
     * @type {String}
     * @public
     */
    this._description = null

    /**
     * Sets the Command instructions
     * @type {String}
     * @public
     */
    this._usage = null

    /**
     * Sets the Command aliases
     * @type {Stringp[]}
     * @public
     */
    this._aliases = null

    /**
     * Sets the Command permissions
     * @type {Stringp[]}
     * @public
     */
    this._permissions = null
  }

  /**
     * Returns the Command name.
     * @type {String}
     */
  get name () {
    return this._name
  }

  /**
     * Updates the Command name.
     * @type {String}
     */
  set name (val) {
    this._name = val
  }

  /**
     * Returns the Command description.
     * @type {String}
     */
  get description () {
    return this._description
  }

  /**
     * Updates the Command description.
     * @type {String}
     */
  set description (val) {
    this._description = val
  }

  /**
     * Returns the Command usage.
     * @type {String}
     */
  get usage () {
    return this._usage
  }

  /**
     * Updates the Command usage.
     * @type {String}
     */
  set usage (val) {
    this._usage = val
  }

  /**
     * Returns the Command name.
     * @type {String[]}
     */
  get aliases () {
    return this._aliases
  }

  /**
     * Updates the Command name.
     * @type {String[]}
     */
  set aliases (val) {
    this._aliases = val
  }

  /**
     * Returns the Command permissions.
     * @type {String[]}
     */
  get permissions () {
    return this._permissions
  }

  /**
     * Returns the Command permissions.
     * @type {String[]}
     */
  set permissions (val) {
    this._permissions = val
  }

  /**
 * Executes a Command.
 * @param {Client} client a Discord bot client.
 * @param {Message} message a Command origin message
 * @param {String[]} args Arguments for the Command.
 */
  async execute (client, message, args) {}
}
module.exports = Command
