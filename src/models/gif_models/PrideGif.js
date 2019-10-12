'use strict'
const GIFEncoder = require('gifencoder')
const { createCanvas, loadImage, registerFont } = require('canvas')
const fs = require('fs')

class PrideGif {
  async buildPrideGif (profilePic, alpha) {
    registerFont('assets/BigNoodleTooOblique.ttf',
      { family: 'Big Noodle Too' })

    const encoder = new GIFEncoder(400, 400)
    encoder.createReadStream().pipe(fs.createWriteStream('src/res/pride.gif'))

    const canvas = createCanvas(400, 400)
    const ctx = canvas.getContext('2d')
    // const frames = 15;
    const frameRate = 30

    encoder.start()
    encoder.setRepeat(0)
    encoder.setDelay(500)
    encoder.setQuality(10)
    encoder.setFrameRate(frameRate)

    const colors = [
      '#db4535',
      '#f06c07',
      '#d4ca11',
      '#40c42b',
      '#138187',
      '#4831b0'
    ]
    const barHeight = Math.ceil(canvas.height / 6)
    const image = await loadImage(profilePic)
    ctx.drawImage(image, 0, 0, 400, 400)

    ctx.globalAlpha = alpha / 10

    for (let j = 0; j < colors.length; j++) {
      ctx.fillStyle = colors[j]
      ctx.fillRect(0, j * barHeight, canvas.width, barHeight)
    }
    encoder.addFrame(ctx)
    encoder.finish()
  }
}
module.exports = PrideGif
