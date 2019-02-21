'use strict';

/**
 * Class for retrieving an emoji from a Guild
 * https://anidiots.guide/coding-guides/using-emojis
 */
class EmojiUtil {
    /**
     * Instantiates a new Emoji utility for finding Guild Emojis
     * @constructor
     */
    constructor() {}

    /**
     * Returns an emoji representation of a team
     * @param {Client} client a Discord client
     * @param {string} emojiName the Emoji to search for
     */
    static getEmoji(client, emojiName) {
        return client.emojis.find(emoji => emoji.name === emojiName);
    }
}
module.exports = EmojiUtil;
