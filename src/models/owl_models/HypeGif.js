'use strict';
const GIFEncoder = require('gifencoder');
const { LeagueLogo } = require('../../constants');
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

/**
 * @class HypeGid
 * @description defines a HypeGif object showing a Discord User's profile
 * avatar with the appropriate hype hashtag and banner color
 */
class HypeGif {
    /**
     * Creates a random number
     * @param {number} min 
     * @param {number} max 
     */
    randomize(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    async buildHypeGif(profilePic, message) {
        const encoder = new GIFEncoder(400, 400);
        encoder.createReadStream().pipe(fs.createWriteStream('src/res/hype.gif'));

        const canvas = createCanvas(400, 400);
        const ctx = canvas.getContext('2d');
        const frames = 15;
        const frameRate = 30;

        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(500);
        encoder.setQuality(10);
        encoder.setFrameRate(frameRate);

        // https://stackoverflow.com/questions/13627111/drawing-text-with-an-outer-stroke-with-html5s-canvas 
        registerFont('assets/BigNoodleTooOblique.ttf',
            { family: 'Big Noodle Too' });

        registerFont('assets/Impact.ttf',
            { family: 'Impact' });
        let text, textWidth;
        let hashtag = "#OWL2019 - by @PachimariApp";

        let image = await loadImage(profilePic);
        let owllogo = await loadImage(LeagueLogo.URL);
            for (let i = 0; i < frames; i++) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let d = this.randomize(10, 40);
                ctx.save();
                let dx = this.randomize(0, d);
                let dy = this.randomize(0, d);
    
                ctx.drawImage(image, -d + dx, -d + dy, 400 + d, 400 + d);
                ctx.font = '50px Impact';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 3;
                text = "[HYPE INTENSIFIES]";
                textWidth = ctx.measureText(text).width;
                ctx.strokeText(text, (canvas.width - textWidth) / 2, 330);
                ctx.fillStyle = 'white';
                ctx.fillText(text, (canvas.width - textWidth) / 2, 330);
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 350, 400, 50);
                ctx.fillStyle = 'white';
                ctx.font = '30px "Big Noodle Too"';
                textWidth = ctx.measureText(hashtag).width;
                ctx.drawImage(owllogo, 20, 358, owllogo.width / 30, owllogo.height / 30);
                ctx.fillText(hashtag, ((canvas.width - textWidth) / 2) + 20, 385);
                encoder.addFrame(ctx);
            }
        encoder.finish();
    }
}
module.exports = HypeGif;