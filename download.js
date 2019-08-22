const tf = require('@tensorflow/tfjs')

const loadModel = async () => {
    const model = await tf.loadLayersModel('http://localhost/model/model.json')
    model.summary()
}

loadModel()