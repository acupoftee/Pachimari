'use strict';

const { RichEmbed, TextChannel, GuildMember, Message, Attachment } = require('discord.js');
const { LeagueLogo } = require('../constants');

/**
 * @class PachimariEmbed
 * @description A custom embedded message creator 
 * for Pachimari 
 */
class PachimariEmbed {
    constructor(client) {
        this._client = client;
        this._title = null;
        this._description = null;
        this._color = null;
        this._thumbnail = null;
        this._footer = null;
        this._image = null;
        this._imageFileName = null;
        this._imageFilePath = null;
        this._fields = [];
        this._embed = new RichEmbed()
            .setColor('#FFB6E6')
            .setTimestamp()
            .setThumbnail(LeagueLogo.URL)
            .setFooter(this._client.user.username, this._client.user.avatarURL);
    }

    get getEmbed() {
        return this._embed;
    }

     addBlank() {
        this._embed.addBlankField();
        return this;
    }
    /**
     * Sets the embed title.
     * @param {string} title Embed Title
     * @returns {PachimariEmbed}
     */ 
    setTitle(title) {
        this._title = title;
        return this;
    }

    /**
     * Sets the embed description
     * @param {string} description Embed Description
     * @returns {PachimariEmbed}
     */ 
    setDescription(description) {
        this._description = description;
        return this;
    }

     /**
     * Sets the embed color
     * @param {string} color Embed Color
     * @returns {PachimariEmbed}
     */
    setColor(color) {
        this._color = color;
        return this;
    }

    /**
     * sets the footer given an 
     * @param {string} footer 
     */
    setFooter(footer) {
        this._footer = footer;
        return this;
    }

    /**
     * Sets the embed thumbnail given a URL
     * @param {string} thumbnail 
     */
    setThumbnail(thumbnail) {
        this._thumbnail = thumbnail;
        return this;
    }

    /**
     * Adds an image url. Must be an image from an online source.
     * Use setImageFileName() for local images
     * @param {string} image image url. 
     */
    setImage(image) {
        this._image = image;
        return this;
    }
    /**
     * Sets the filepath and name for a RichEmbed to read the local file. 
     * See https://discordjs.guide/popular-topics/embeds.html#local-images
     * @param {string|Attachment} filepath full image URI
     * @param {string} filename image filename with the extension. 
     */
    setImageFileName(filepath, filename) {
        this._imageFilePath = filepath;
        this._imageFileName = filename;
        return this;
    }

    /**
     * Adds a field to an Embed. Optional inline param.
     * @param {string} name the name of the field.
     * @param {string} value the value of the field
     * @param {boolean?} [inline=false] inline flag
     * @returns {PachimariEmbed}
     */
    addFields(name, value, inline=false) {
        this._fields.push(new Field(name, value, inline));
        return this;
    }

    /**
     * Builds a PachimariEmbed
     * @returns {PachimariEmbed}
     */
     buildEmbed() {
        if (this._title != null) {
            this._embed.setTitle(this._title);
        }
        if (this._description != null) {
            this._embed.setDescription(this._description);
        }
        if (this._color != null) {
            this._embed.setColor(this._color);
        }
        if (this._thumbnail != null) {
            this._embed.setThumbnail(this._thumbnail);
        }
        if (this._image != null) {
            this._embed.setImage(this._image); 
        }
        if (this._imageFileName != null && this._imageFilePath != null) {
            this._embed.attachFile({attachment: this._imageFilePath, name: this._imageFileName});
            this._embed.setImage(`attachment://${this._imageFileName}`);
        }
        if (this._footer != null) {
            this._embed.setFooter(this._footer);
        }
        for (const field of this._fields) {
            this._embed.addField(field.name, field.value, field.inline);
        }
        return this;
    }

    /**
     * Post the embed to a channel
     * @param {TextChannel|GuildMember} destination destination Channel for the embed
     * @returns {PachimariEmbed}
     */
    post(destination) {
        destination.send(this._embed);
        return this;
    }
    /**
     * Edits the embed to a channel
     * @param {TextChannel|GuildMember} destination destination Channel for the embed
     * @returns {PachimariEmbed}
     */
    edit(destination) {
        destination.edit(this._embed);
        return this;
    }

    /**
     * Reacts to an embedded message
     * @param {Message} destination destination Channel for the reaction 
     * @param {string|Emoji|ReactionEmoji} emojiname the emoji for the reaction
     */
    react(destination, emojiname) {
        destination.react(emojiname);
        return this;
    }
}

/**
 * Adds a field into an embedded object
 * @param {string} name The name of the field
 * @param {string} value The value of the field
 * @param {boolean} inline sets the field to display inline
 */
function Field(name, value, inline) {
    this.name = name;
    this.value = value;
    this.inline = inline;
}

module.exports = PachimariEmbed;