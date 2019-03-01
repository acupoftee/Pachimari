'use strict';
const { Attachment } = require('discord.js');
const Canvas = require('canvas');

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
        buildBanner() {
            const canvas = Canvas.createCanvas(500, 250);
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = this._homePrimaryColor;
            ctx.fillRect(0, 0, 250, 250);

            ctx.fillStyle = this._awayPrimaryColor;
            ctx.fillRect(250, 0, 250, 250);

            let homeLogo = new Image();
            homeLogo.src = this._homeLogo;
            homeLogo.onload = () => {
                ctx.drawImage(homeLogo, 
                    canvas.width / 4 - homeLogo.width / 4,
                    canvas.height / 2 - homeLogo.height / 2);
            }
            homeLogo.onerror = err => { throw err };

            let awayLogo = new Image();
            awayLogo.src = this._awayLogo;
            awayLogo.onload = () => {
                ctx.drawImage(awayLogo, 
                    (canvas.width / 4 - awayLogo.width / 4) * 3,
                    (canvas.height / 2 - awayLogo.height / 2));
            }
            awayLogo.onerror = err => { throw err };

            return new Attachment(canvas.toBuffer(), 'banner.png');
        }
}
module.exports = Banner;