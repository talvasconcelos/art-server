const db = require('./mongo')
const ObjectId = require('mongoose').Types.ObjectId
const crypto = require('crypto')

const key = process.env.SECRET
const algo = process.env.ALGO

const encrypt = (str) => {
    const input = str.toString()
    const cipher = crypto.createCipher(algo, key)
    let crypted = cipher.update(input, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
}

const decrypt = (str) => {
    const input = str.toString()
    const decipher = crypto.createDecipher(algo, key)
    try {
        let decrypted = decipher.update(input, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted
    } catch {
        return false
    }
}

const getImages = async (pageNo = 1, size = 12) => {
    const Images = db.collection('items')
    if(pageNo < 0 || pageNo === 0) {
        return {error: true, message: 'invalid page number, should start with 1'}
    }
    const skip = size * (pageNo - 1)
    const totalCount = await Images
        .countDocuments({})
        .then(res => Math.ceil(res / size))
        .catch({error: true, message: 'Error fetching data'})
    const data = await Images
        .find()
        .skip(+skip)
        .limit(+size)
        .toArray()
        .catch({error: true, message: 'Error fetching data'})
    
    // const imgs = data.map(v => {
    //     delete v.latent
    //     return v
    // })

    // console.log(data[0])
    // console.log(data)
    data.map(i => delete i.latent)

    return {error: false, message: data, pages: totalCount}
}

const getSingleImage = async (id) => {
    const Images = db.collection('items')
    // const data = await Images.findOne({image: `${id}.png`})
    //     .catch(console.error)
    const data = await Images.findOne({_id: new ObjectId(id)})
    .catch(console.error)

    return {error: false, message: data}
}

const markImagePaid = async (id) => {
    const Images = db.collection('items')
    const randomURL = encrypt(id)
    const update = {paid: true, downloadID: randomURL}
    const data = await Images.findOneAndUpdate({_id: new ObjectId(id)}, {$set: update}, {new: true})
        .catch(err => {
            console.error(err)
            return false
        })
    return data.value
}

const updateImage = async (id) => {
    const Images = db.collection('items')
    const hasLink = await Images.findOne({_id: new ObjectId(id)}).catch(console.error)
    // console.log(hasLink)
    if(hasLink.paid && hasLink.confirmed) {
        console.log(hasLink.downloadID)
        return false
    }
    const update = {confirmed: true, exclusive: false}
    const data = await Images.findOneAndUpdate({_id: new ObjectId(id)}, {$set: update}, {new: true})
        .catch(err => {
            console.error(err)
            return false
        })
    return data.value
}

const imageUpdateNotExclusive = async (url) => {
    const Images = db.collection('items')
    const id = await decrypt(url)
    console.log('not exclusive', id)
    if(!id) {return false}
    const update = {confirmed: '', paid: '', downloadID: ''}
    const data = await Images.updateOne({_id: new ObjectId(id)}, {$unset: update})
        .catch(err => {
            console.error(err)
            return false
        })
    return data.value
}

const deleteImage = async (id) => {
    console.log('deleting image', decrypt(id))
    const Images = db.collection('items')
    const deleteImg = await Images.findOneAndDelete({downloadID: id})
        .catch(err => {
            console.error(err)
            return false
        })
    return deleteImg.value
}

const getImageDownload = async (url) => {
    const Images = db.collection('items')
    const id = await decrypt(url)
    console.log(id)
    if(!id) {return {error: true, message: 'Not a valid link!'}}
    const data = await Images.findOne({_id: new ObjectId(id), confirmed: true})
        .catch(err => {
            console.error(err)
            return false
        })
    return data
}

module.exports = {
    getImages,
    getSingleImage,
    markImagePaid,
    updateImage,
    getImageDownload,
    deleteImage,
    imageUpdateNotExclusive
}

/*

router.get('/users',(req,res) => {
  var pageNo = parseInt(req.query.pageNo)
  var size = parseInt(req.query.size)
  var query = {}
  if(pageNo < 0 || pageNo === 0) {
        response = {"error" : true,"message" : "invalid page number, should start with 1"};
        return res.json(response)
  }
  query.skip = size * (pageNo - 1)
  query.limit = size
  // Find some documents
       mongoOp.count({},function(err,totalCount) {
             if(err) {
               response = {"error" : true,"message" : "Error fetching data"}
             }
         mongoOp.find({},{},query,function(err,data) {
              // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                var totalPages = Math.ceil(totalCount / size)
                response = {"error" : false,"message" : data,"pages": totalPages};
            }
            res.json(response);
         });
       })
})

app.use('/api',router)
app.listen(3000)
*/