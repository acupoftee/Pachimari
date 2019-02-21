'use strict';

/**
 * Class for retrieving an emoji from a Guild
 */
class Emojis {
    constructor() {}

    /**
     * Returns an emoji representation of a team
     * @param {Client} client a Discord client
     * @param {string} emojiName the Emoji to search for
     */
    static getEmoji(client, emojiName) {
        const emote = client.emojis.find(emoji => emoji.name === emojiName);
        return emote;
    }
}
module.exports = Emojis;
