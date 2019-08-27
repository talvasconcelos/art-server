const db = require('./mongo')
const ObjectId = require('mongoose').Types.ObjectId
const crypto = require('crypto')

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

const updateImage = async (id) => {
    const Images = db.collection('items')
    const hasLink = await Images.findOne({_id: new ObjectId(id)})
    if(hasLink.downloadID) {return false}
    const randomURL = await crypto.randomBytes(64).toString('hex')
    const update = {downloadID: randomURL}
    const data = await Images.findOneAndUpdate({_id: new ObjectId(id)}, update, {new: true})
    return data
}

const getImageDownload = async (url) => {
    const Images = db.collection('items')
    const data = await Images.findOne({downloadID: url})
    .catch(console.error)

    return {error: false, message: data}
}

module.exports = {
    getImages,
    getSingleImage,
    updateImage,
    getImageDownload
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