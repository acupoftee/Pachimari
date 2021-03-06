'use strict'
const GIFEncoder = require('gifencoder')
const { createCanvas, loadImage, registerFont } = require('canvas')
const fs = require('fs')
const cover = require('canvas-image-cover')

/**
 * @class WambulanceGif
 * @description defines a Wambulance object showing a Mercy meme
 */
class WambulanceGif {
  async buildWambulanceGif () {
    const imageNumber = Math.floor(Math.random() * (4 - 1) + 1)
    const mercyImage = `assets/mercy_faces/${imageNumber}.jpg`
    const encoder = new GIFEncoder(400, 400)
    encoder.createReadStream().pipe(fs.createWriteStream('src/res/waa.gif'))

    const canvas = createCanvas(400, 400)
    const ctx = canvas.getContext('2d')
    const frames = 60
    const frameRate = 30

    encoder.start()
    encoder.setRepeat(0)
    encoder.setDelay(500)
    encoder.setQuality(10)
    encoder.setFrameRate(frameRate)

    // https://stackoverflow.com/questions/13627111/drawing-text-with-an-outer-stroke-with-html5s-canvas
    registerFont('assets/BigNoodleTooOblique.ttf',
      { family: 'Big Noodle Too' })

    registerFont('assets/Impact.ttf',
      { family: 'Impact' })
    let text1, text2, textWidth1, textWidth2
    const hashtag = '#OverwatchAnniversary - by @PachimariApp'

    let scaleFactor = 0.001
    const image = await loadImage(mercyImage)
    // let owllogo = await loadImage(LeagueLogo.URL);
    for (let i = 0; i < frames; i++) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()

      cover(image, 0, 0, 400, 400).zoom(1 + scaleFactor).render(ctx)
      // ctx.drawImage(image, dx, dy, 400, 400);
      ctx.font = '50px Impact'
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 3

      text1 = 'SOMEONE CALL THE'
      text2 = 'WHAMBULANCE'
      textWidth1 = ctx.measureText(text1).width
      ctx.strokeText(text1, (canvas.width - textWidth1) / 2, 50)
      ctx.fillStyle = 'white'
      ctx.fillText(text1, (canvas.width - textWidth1) / 2, 50)
      ctx.fillStyle = 'black'

      textWidth2 = ctx.measureText(text2).width
      ctx.strokeText(text2, (canvas.width - textWidth2) / 2, 100)
      ctx.fillStyle = 'white'
      ctx.fillText(text2, (canvas.width - textWidth2) / 2, 100)
      ctx.fillStyle = 'black'

      ctx.fillRect(0, 370, 400, 50)
      ctx.fillStyle = 'white'
      ctx.font = '15px "Big Noodle Too"'
      const textWidth = ctx.measureText(hashtag).width
      // ctx.drawImage(owllogo, 20, 358, owllogo.width / 30, owllogo.height / 30);
      ctx.fillText(hashtag, ((canvas.width - textWidth) / 2), 390)
      encoder.addFrame(ctx)
      scaleFactor += 0.002
    }
    encoder.finish()
  }
}
module.exports = WambulanceGif
