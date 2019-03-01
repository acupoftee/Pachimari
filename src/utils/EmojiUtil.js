'use strict';
require('dotenv').config();

/**
 * Class for retrieving an emoji from a Guild
 * https://anidiots.guide/coding-guides/using-emojis
 */
class EmojiUtil {

    /**
     * Returns a Emoji from a specific guild given an Emoji name
     * @param {Client} client a Discord client
     * @param {string} emojiName the Emoji to search for
     */
    static getEmoji(client, emojiName) {
        return client.guilds.get(process.env.ORIGIN_GUILD_ID).emojis.find(emoji => emoji.name === emojiName.toLowerCase());
    }

     /**
     * Returns a country's flag as an emoji
     * @param {string} countryCode ISO 3166-1 country code.
     * @returns {string} country emoji
     */
    static getFlag(countryCode) {
        if (countryCode) {
            return `:flag_${countryCode.toLowerCase()}:`;
        }
    }
}
module.exports = EmojiUtil;
