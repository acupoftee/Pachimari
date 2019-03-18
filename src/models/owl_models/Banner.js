'use strict';
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

/**
 * @class Banner
 * @description defines a Banner image object showing the logos 
 * of two Overwatch League Teams facing off
 */
class Banner {
    /**
     * Instantiates a new Banner object
     * @constructor
     * @param {string} homePrimaryColor home team bg color
     * @param {string} awayPrimaryColor away team bg color
     * @param {string} homeSecondaryColor home team bg color
     * @param {string} awaySecondaryColor away team bg color
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

    setHomePrimaryColor(color) {
        this._homePrimaryColor = color;
    }

    /**
     * Returns the away team's primary color
     * @returns {string} away primaryColor
     */
    get awayPrimaryColor() {
        return this._awayPrimaryColor;
    }

    setAwayPrimaryColor(color) {
        this._awayPrimaryColor = color;
    }

    /**
     * Returns the home team's secondary color
     * @returns {string} home secondary color
     */
    get homeSecondaryColor() {
        return this._awaySecondaryColor;
    }

    setHomeSecondaryColor(color) {
        this._homeSecondaryColor = color;
    }

    /**
     * Returns the away team's secondary color
     * @returns {string} away secondary color
     */
    get awaySecondaryColor() {
        return this._awaySecondaryColor;
    }

    setAwaySecondaryColor(color) {
        this._awaySecondaryColor = color;
    }

    /**
     * Constructs a banner displaying the teams that are 
     * currently facing off in an Overwatch League Match
     * @returns {string} filepath
     */
    async buildBanner(filename, first="", second="") {
        registerFont('assets/ApexMk2-Regular.otf',
            { family: 'Apex Regular' });
        const canvas = createCanvas(500, 250);
        const ctx = canvas.getContext('2d');
        let side1 = 10, side2 = 10;

        ctx.fillStyle = this._homePrimaryColor;
        ctx.fillRect(0, 0, 250, 250);

        ctx.fillStyle = this._awayPrimaryColor;
        ctx.fillRect(250, 0, 250, 250);

        ctx.fillStyle = this._homeSecondaryColor;
        ctx.fillRect(0, 0, side1, 250);

        ctx.fillStyle = this._awaySecondaryColor;
        ctx.fillRect(canvas.width - side2, 0, side2, 250);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect((canvas.width / 2) - 20, (canvas.height / 2) - 25 / 2, 40, 25);

        ctx.fillStyle = '#000';
        ctx.font = '20px "Apex Regular"';
        let text = "VS";
        let textWidth = ctx.measureText(text).width;
        ctx.fillText("VS", (canvas.width / 2) - (textWidth / 2), (canvas.height / 2) + 7);

        // basic algorithm: https://jsfiddle.net/dustybutton/Ljdbtk79/2/
        let homeLogo = await loadImage(this._homeLogo);
        let homeWidth = homeLogo.width / 3, homeHeight = homeLogo.height / 3;
        ctx.drawImage(homeLogo,
            ((canvas.width / 2) - homeWidth) / 2,
            canvas.height / 2 - homeHeight / 2, homeWidth, homeHeight);
        homeLogo.onerror = err => { throw err };

        let awayLogo = await loadImage(this._awayLogo);
        let awayWidth = awayLogo.width / 3, awayHeight = awayLogo.height / 3;
        ctx.drawImage(awayLogo,
            (((canvas.width / 2) * 3) - awayWidth) / 2,
            canvas.height / 2 - awayHeight / 2, awayWidth, awayHeight);
        awayLogo.onerror = err => { throw err };

        if (first != "" && second != "") {
            ctx.font = '40px "Apex Regular"';
            let color = this.hex2RGB(this._homePrimaryColor);
            ctx.fillStyle = this.colorIsLight(color) ? "#000" : "#FFF";
            let firstWidth = ctx.measureText(first).width;
            ctx.fillText(first, ((canvas.width / 2) - firstWidth) / 2), (canvas.height / 2 - 20);

            color = this.hex2RGB(this._awatPrimaryColor);
            ctx.fillStyle = this.colorIsLight(color) ? "#000" : "#FFF";
            let secondWidth = ctx.measureText(second).width;
            ctx.fillText(second, (((canvas.width / 2) * 3) - secondWidth) / 2), (canvas.height / 2 - 20);
        }
        const fileName = `src/res/${filename}`;
        fs.writeFile(fileName, canvas.toBuffer(), (err) => {
            if (err) throw err;
            console.log(`${filename} was created`);
        });
        return fileName;
    }

    /**
     * Converts a hex string into an rgb array
     * @param {string} str hex string
     */
    hex2RGB(str) {
        const RGB_HEX = /^#?(?:([\da-f]{3})[\da-f]?|([\da-f]{6})(?:[\da-f]{2})?)$/i;
        const [, short, long] = String(str).match(RGB_HEX) || [];

        if (long) {
            const value = Number.parseInt(long, 16);
            return [value >> 16, value >> 8 & 0xFF, value & 0xFF];
        } else if (short) {
            return Array.from(short, s => Number.parseInt(s, 16)).map(n => (n << 4) | n);
        }
    }
    /**
     * Determines the contrast of a color. See https://www.w3.org/TR/AERT/#color-contrast
     * @param {number} r red value
     * @param {number} g green value 
     * @param {number} b blue value
     * @returns {boolean} true if the luminance is below 0.5 (lighter)
     */
    colorIsLight(r, g, b) {
        // Counting the perceptive luminance
        // human eye favors green color... 
        let a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return (a < 0.5);
    }

}
module.exports = Banner;