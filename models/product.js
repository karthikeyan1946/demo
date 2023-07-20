const mongoose = require('mongoose');
const {Schema}=mongoose;
const productSchema=new Schema({
    name:{
        type: 'string',
        required: true
    },
    price:{
        type:'number',
        required:true,
        min:0
    },
    category:{
        type:'string',
        lowercase:true,
        enum:['fruit','vegetable','dairy']
    },
    farm:{
        type: Schema.Types.ObjectId,
        ref: 'Farm'
    }
})
const product= mongoose.model('Product',productSchema)

module.exports =product