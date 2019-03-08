'use strict';
const { Attachment } = require('discord.js');
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

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
     */
    async buildBanner(filename) {
        // TODO resolve bug where it loads a previously saved image
        // const fnt = registerFont('/Users/deedee/Desktop/Coding/Web Dev/Pachimari/assets/industry-medium.ttf',
        //     {family: 'Industry'});
        const canvas = createCanvas(500, 250);
        const ctx = canvas.getContext('2d');
        let side1 = 15, side2 = 15;

        ctx.fillStyle = this._homePrimaryColor;
        ctx.fillRect(0, 0, 250, 250);

        ctx.fillStyle = this._awayPrimaryColor;
        ctx.fillRect(250, 0, 250, 250);

        ctx.fillStyle = this._homeSecondaryColor;
        ctx.fillRect(0, 0, side1, 250);

        ctx.fillStyle = this._awaySecondaryColor;
        ctx.fillRect(canvas.width - side2, 0, side2, 250);

        // ctx.fillStyle = '#ffffff';
        // ctx.fillRect((canvas.width / 2) - 20, (canvas.height / 2) - 10, 40, 20);

        // ctx.fillStyle = '#000000';
        // ctx.font = '20px Calibri bold';
        // ctx.fillText("VS", (canvas.width / 2) - 20, (canvas.height/2) + 5);

        // https://jsfiddle.net/dustybutton/Ljdbtk79/2/
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


        //const fileName = 'src/res/banner.png';

        //canvas.toBuffer();
        const out = fs.createWriteStream(`src/res/${filename}`);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => console.log('The File was created'));
    
        //return stream;
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