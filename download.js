const tf = require('@tensorflow/tfjs')
const pixels = require('image-pixels')
const { createCanvas, loadImage, createImageData } = require('canvas')

var startTime, endTime;

function start() {
  startTime = new Date();
};

function end() {
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds 
  var seconds = Math.round(timeDiff);
  console.log(seconds + " seconds");
}

//require('@tensorflow/tfjs-node')

const loadModel = async () => {
    const model = await tf.loadLayersModel('http://tvasconcelos.eu/upscale/model/model.json')
    // model.summary()
    return model
}

const upscale = async (url) => {
    let {data, width, heigth} = await pixels(url)
    return {data, width, heigth}
}

const test = async () => {
    start()
    const canvas = createCanvas(128, 128)
    const ctx = canvas.getContext('2d')
    const img = await loadImage('http://localhost:8080/assets/images/xntcgcohjg.png')
    ctx.drawImage(img, 0, 0)
    // console.log(canvas)
    const tensor = await tf.browser.fromPixels(canvas)
    tensor.print()
    end()
}

// test()

loadModel().then(async (model) => {
    start()
    const canvas = createCanvas(128, 128)
    const ctx = canvas.getContext('2d')
    const img = await loadImage('https://nudeart.sparkpay.pt/assets/images/xjazegeyny.png')
    await ctx.drawImage(img, 0, 0)
    const imgTensor = await tf.browser.fromPixels(canvas).toFloat().div(tf.scalar(255)).expandDims()
    console.log(imgTensor)
    console.log(canvas)
    end()
    // console.log('Starting inference...')
    // start()
    // let upscaledImg = await model.predict(imgTensor)
    // upscaledImg = await model.predict(upscaledImg).clipByValue(0, 1).mul(tf.scalar(255)).data()
    // console.log(upscaledImg)
    // end()
    // upscaledImg.print()
}).catch(console.error)

// upscale('http://localhost:8080/assets/images/xntcgcohjg.png').then(img => {
//     //tf.tensor3d(img.data, [128, 128, 4]).squeeze().print()
//     console.log(img.data.map(c => ))
// })

