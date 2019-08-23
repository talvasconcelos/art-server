const tf = require('@tensorflow/tfjs')
const pixels = require('image-pixels')
const { createCanvas, loadImage, createImageData } = require('canvas')

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
    const canvas = createCanvas(128, 128)
    const ctx = canvas.getContext('2d')
    const img = await loadImage('http://localhost:8080/assets/images/xntcgcohjg.png')
    ctx.drawImage(img, 0, 0)
    // console.log(canvas)
    const tensor = await tf.browser.fromPixels(canvas)
    tensor.print()
}

// test()

loadModel().then(async (model) => {
    const canvas = createCanvas(128, 128)
    const ctx = canvas.getContext('2d')
    const img = await loadImage('http://localhost:8080/assets/images/xntcgcohjg.png')
    ctx.drawImage(img, 0, 0)
    const imgTensor = tf.browser.fromPixels(canvas).toFloat().div(tf.scalar(255)).expandDims()
    console.log(imgTensor)
    const upscaledImg = await model.predict(imgTensor).clipByValue(0, 1).mul(tf.scalar(255)).data()
    console.log(upscaledImg)
    // upscaledImg.print()
}).catch(console.error)

// upscale('http://localhost:8080/assets/images/xntcgcohjg.png').then(img => {
//     //tf.tensor3d(img.data, [128, 128, 4]).squeeze().print()
//     console.log(img.data.map(c => ))
// })

