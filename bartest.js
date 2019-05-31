const GIFEncoder = require('gifencoder');
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

let encoder = new GIFEncoder(this.width, this.height);
const frameRate = 30;

encoder.start();
encoder.setDelay(500);
encoder.setQuality(10);
encoder.setFrameRate(frameRate);
encoder.createReadStream().pipe(fs.createWriteStream('src/res/graph.gif'));

function BarGraph(ctx) {
    let that = this;
    let startArr;
    let endArr;
    let looping = false;

    let loop = () => {
        let delta;
        let animationComplete = true;

        // boolean to prevent update function from looping if already looping
        looping = true;

        // for each bar 
        for (let i = 0; i < endArr.length; i++) {
            // change the current bar height toward its target height
            delta = (endArr[i] - startArr[i]) / that.animationSteps;
            that.curArr[i] += delta;
            // if any change is made then flip a switch
            if (delta) {
                animationComplete = false;
            }
        }

        if (animationComplete) {
            looping = false;
        } else {
            // draw and call loopFun
            draw(that.curArr);
            encoder.addFrame(ctx);
            //setTimeout(loop, that.animationInterval / that.animationSteps);
        }
    }

    let draw = (arr) => {
        let numOfBars = arr.length;
        let barWidth;
        let barHeight;
        let border = 2;
        let ratio;
        let maxBarHeight;
        let gradient;
        let graphAreaX = 0;
        let graphAreaY = 0;
        let graphAreaWidth = that.width;
        let graphAreaHeight = that.height;

        // update the dimensions of the canvas only if they've changed
        if (ctx.canvas.width !== this.width || ctx.canvas.height !== this.height) {
            ctx.canvas.width = that.width;
            ctx.canvas.height = that.height;
        }

        // draw background color
        ctx.fillStyle = that.backgroundColor;
        ctx.fillRect(0, 0, that.width, that.height);

        // if z asis labels exist than make room
        if (that.xAxisLabelArr.length) {
            graphAreaHeight -= 40;
        }

        // calculate bar dimensions
        barWidth = graphAreaWidth / numOfBars - that.margin * 2;
        maxBarHeight = graphAreaHeight - 25;

        // find largest value in the bar 
        let largestValue = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] > largestValue) {
                largestValue = arr[i];
            }
        }

        // for each bar 
        for (let j = 0; j < arr.length; j++) {
            // set the ratio of the current bar compared to the max
            if (that.maxValue) {
                ratio = arr[j] / that.maxValue;
            } else {
                ratio = arr[j] / largestValue;
            }

            barHeight = ratio * maxBarHeight;

            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 2;
            ctx.shadowColor = "#999";

            // draw bar background
            ctx.fillStyle = "#333";
            ctx.fillRect(that.margin + j * that.width / numOfBars,
                graphAreaHeight - barHeight,
                barWidth,
                barHeight);
            
            // turn off shadow
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;

            // create gradient
            gradient = ctx.createLinearGradient(0, 0, 0, graphAreaHeight);
            gradient.addColorStop(1-ratio, that.colors[j % that.colors.length]);
            gradient.addColorStop(1, "#ffffff");

            ctx.fillStyle = gradient;
            // fill rectangle with gradient
            ctx.fillRect(that.margin + j * that.width / numOfBars + border,
                graphAreaHeight - barHeight + border,
                barWidth - border * 2,
                barHeight - border * 2);
            
            // write bar value
            ctx.fillStyle = "#333";
            ctx.font = "bold 12px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(parseInt(arr[j], 10),
                j * that.width / numOfBars + (that.width / numOfBars) / 2,
                graphAreaHeight - barHeight - 10);
            
            // draw bar label if it exists
            if (this.xAxisLabelArr[j]) {
                ctx.fillStyle ="#333";
                ctx.font = "bold 10px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(that.xAxisLabelArr[j],
                    j * that.width / numOfBars + (that.width / numOfBars) / 2,
                    that.height - 10);
            }
        }
    }

    this.width = 300; 
    this.height = 150;
    this.maxValue;
    this.margin = 5;
    this.colors = ["purple", "red", "green", "yellow"];
    this.curArr = [];
    this.backgroundColor = "#fff";
    this.xAxisLabelArr = [];
    this.yAxisLabelArr = [];
    this.animationInterval = 100;
    this.animationSteps = 10;

    this.update = (newArr) => {
        // if the length of target and current array is different
        if (that.curArr.length !== newArr.length) {
            that.curArr = newArr;
            draw(newArr);
        } else {
            // set the starting array to the current array 
            startArr = that.curArr;
            // set the target array to the new array
            endArr = newArr;
            // animate from the start array to the end array
            if (!looping) {
                loop();
            }
            encoder.finish();
        }
    }
}
const canvas = createCanvas(400, 400);
const ctx1 = canvas.getContext('2d');
let graph = new BarGraph(ctx1);
graph.maxValue = 30;
		graph.margin = 2;
		graph.colors = ["#49a0d8", "#d353a0", "#ffc527", "#df4c27"];
		graph.xAxisLabelArr = ["North", "East", "West", "South"];
graph.update([5, 8, 15, 34]);
