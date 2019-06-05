'use strict';
const GIFEncoder = require('gifencoder');
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

class PrideGif {
    async buildPrideGif(profilePic, alpha) {
        registerFont('assets/BigNoodleTooOblique.ttf',
        { family: 'Big Noodle Too' });

        const encoder = new GIFEncoder(400, 400);
		encoder.createReadStream().pipe(fs.createWriteStream('src/res/pride.gif'));

		const canvas = createCanvas(400, 400);
        const ctx = canvas.getContext('2d');
		// const frames = 15;
	    const frameRate = 30;

		encoder.start();
		encoder.setRepeat(0);
		encoder.setDelay(500);
		encoder.setQuality(10);
        encoder.setFrameRate(frameRate);

        let colors = [
            '#db4535',
            '#f06c07',
            '#d4ca11',
            '#40c42b',
            '#138187',
            '#4831b0'
          ];
        let barHeight = Math.ceil(canvas.height/6);
        let image = await loadImage(profilePic);
        ctx.drawImage(image, 0, 0, 400, 400);
          
        ctx.globalAlpha = alpha/10;


        for (let j = 0; j < colors.length; j++) {
            ctx.fillStyle = colors[j];
            ctx.fillRect(0, j * barHeight, canvas.width, barHeight);
        }
        // ctx.globalAlpha = 1.0;
        // ctx.font = '50px "Big Noodle Too"';
        // ctx.strokeStyle = 'black';
        // ctx.lineWidth = 3;
        // let text = "#PRIDE2019";
        // let textWidth = ctx.measureText(text).width;
        // ctx.strokeText(text, (canvas.width - textWidth) / 2, 390);
        // ctx.fillStyle = 'white';
        // ctx.fillText(text, (canvas.width - textWidth) / 2, 390);
        // ctx.fillStyle = 'black';
        
        // let prideImage = await loadImage("assets/prideframes/frames/0.gif");
        // ctx.globalAlpha = 1;
        // ctx.drawImage(prideImage, (canvas.width - prideImage.width) / 2, 330);
        encoder.addFrame(ctx);
        encoder.finish();
    }
}
module.exports = PrideGif;
