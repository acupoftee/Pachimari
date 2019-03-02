'use strict';
const { Attachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

/**
 * @class Banner
 * @description defines a Banner image object showing the logos 
 * of  two Overwatch League Teams facing off
 */
class Banner {
    /**
     * Instantiates a new Banner object
     * @constructor
     * @param {string} homePrimaryColor home team bg color
     * @param {string} awayPrimaryColor away team bg color
     * @param {string} homeLogo home team logo URL
     * @param {string} awayLogo away team logo URL
     */
    constructor(homePrimaryColor, awayPrimaryColor, homeSecondaryColor, awaySecondaryColor, 
        homeLogo, awayLogo) {
            this._homePrimaryColor = homePrimaryColor;
            this._awayPrimaryColor = awayPrimaryColor;
            this._homeSecondaryColor = homeSecondaryColor;
            this._awaySecondaryColor = awaySecondaryColor;
            this._homeLogo = homeLogo;
            this._awayLogo = awayLogo;
        }

    /**
     * Returns the home team's primary color
     * @returns {string} home primaryColor
     */
    get homePrimaryColor() {
        return this._homePrimaryColor;
    }

    /**
     * Returns the away team's primary color
     * @returns {string} away primaryColor
     */
    get awayPrimaryColor() {
        return this._awayPrimaryColor;
    }

    /**
     * Returns the home team's secondary color
     * @returns {string} home secondary color
     */
    get homeSecondaryColor() {
        return this._awaySecondaryColor;
    }

    /**
     * Returns the away team's secondary color
     * @returns {string} away secondary color
     */
    get awaySecondaryColor() {
        return this._awaySecondaryColor;
    }
    /**
     * Constructs a banner displaying the teams that are 
     * currently facing off in an Overwatch League Match
     * @returns {Attachment} a new Image attachment
     */
    async buildBanner() {
        const canvas = createCanvas(500, 250);
        const ctx = canvas.getContext('2d');
        let width = 150, height = 150;
        let side1 = 20, side2 = 20;

        ctx.fillStyle = this._homePrimaryColor;
        ctx.fillRect(0, 0, 250, 250);

        ctx.fillStyle = this._awayPrimaryColor;
        ctx.fillRect(250, 0, 250, 250);

        ctx.fillStyle = this._homeSecondaryColor;
        ctx.fillRect(0, 0, side1, 250);

        ctx.fillStyle = this._awaySecondaryColor;
        ctx.fillRect(canvas.width - side2, 0, side2, 250);

        let homeLogo = await loadImage(this._homeLogo);
        ctx.drawImage(homeLogo, 
                ((canvas.width / 2) - width) / 2,
                canvas.height / 2 - height / 2, width, height);
        homeLogo.onerror = err => { throw err };

        let awayLogo = await loadImage(this._awayLogo);
            ctx.drawImage(awayLogo, 
            ((canvas.width / 2) - width) * 3,
                canvas.height / 2 - height / 2, width, height);
        awayLogo.onerror = err => { throw err };

        const out = fs.createWriteStream('./src/res/banner.png');
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => console.log('The File was created'));

    }

    /**
     * Deletes a file from the directory
     */
     deleteFile() {
        fs.unlink('./src/res/banner.png', (err) => {
            if (err) throw err;
            console.log('banner was deleted');
        });
    }
}
module.exports = Banner;