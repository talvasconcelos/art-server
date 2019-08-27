let sr

const loadModel = async () => {
    const model = await tf.loadLayersModel('./model/model.json')
    // model.summary()
    return model
}

const getImage = async (url) => {
    
    return new Promise((resolve, rej) => {
        const img = new Image()
        img.onload = function(){
            resolve({
                url: img,
                width: this.width,
                height: this.height
            })
        }
        img.onerror = (err) => console.error(err)
        img.src = url
        img.id = 'original'
    })
    
    // const img = await tf.browser.fromPixels(url)
    // .toFloat()
    // .div(tf.scalar(255))
    // .expandDims()
}

loadModel().then(async (m) => {
    sr = m
    const img = await getImage('https://nudeart.sparkpay.pt/assets/images/xjazegeyny.png')
    const url = img.url
    const width = img.width
    const height = img.height
    // await document.body.appendChild(img)
    // const image = document.getElementById('original')
    const tensor = tf.browser.fromPixels(url)
                     .toFloat()
                     .div(tf.scalar(255))
                     .expandDims()
    tensor.print()
})

