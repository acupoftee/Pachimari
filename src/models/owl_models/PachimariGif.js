'use strict';
const { createCanvas, loadImage, registerFont } = require('canvas');
const GIFEncoder = require('gif-encoder');
const fs = require('fs');

/**
 * @class PachimariGif
 * @description defines a Pachimari gif object 
 */
class PachimariGif {
    static async buildGif(filename, baseImage, secondaryImage) {
        const canvas = createCanvas(250, 250);
        const ctx = canvas.getContext('2d');
        const gif = new GIFEncoder(250, 250);
    }
}