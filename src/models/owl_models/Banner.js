'use strict';
const { Attachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

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
    constructor(homePrimaryColor, awayPrimaryColor, 
        homeLogo, awayLogo) {
            this._homePrimaryColor = homePrimaryColor;
            this._awayPrimaryColor = awayPrimaryColor;
            this._homeLogo = homeLogo;
            this._awayLogo = awayLogo;
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

            ctx.fillStyle = this._homePrimaryColor;
            ctx.fillRect(0, 0, 250, 250);

            ctx.fillStyle = this._awayPrimaryColor;
            ctx.fillRect(250, 0, 250, 250);

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
}
module.exports = Banner;