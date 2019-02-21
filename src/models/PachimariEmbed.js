'use strict';

const {
    RichEmbed,
    TextChannel,
    GuildMember
} = require('discord.js');
const PachimariClient = require('./PachimariClient');

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
            .setColor('#FF69B4')
            .setFooter("Pachimari", null);
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
        for (const field of this._fields) {
            this._embed.addField(field.name, field.value. field.inline);
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