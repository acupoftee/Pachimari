'use strict';

const { RichEmbed, TextChannel, GuildMember } = require('discord.js');
const PachimariClient = require('./PachimariClient');
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
        this._fields = [];
        this._embed = new RichEmbed()
            .setColor('#FFB6E6')
            .setTimestamp()
            .setThumbnail(LeagueLogo.URL)
            .setFooter(this._client.user.username, this._client.user.avatarURL);
        //this._spaceChar = '\u200B';
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

    setFooter(footer) {
        this._footer = footer;
        return this;
    }

    setThumbnail(thumbnail) {
        this._thumbnail = thumbnail;
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