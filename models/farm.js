const mongoose = require('mongoose');
const {Schema}=mongoose;
const farmSchema=new Schema({
    name:{
        type:'string',
        required:[true,'Farm must have a name!']
    },
    city:{
        type:'string'
    },
    email:{
        type:'string',
        required:[true,'Email required']
    },
    products:[
        {
            type: Schema.Types.ObjectId,
            ref:'Product'
        }
    ]
})
// for deleting products we need to use pre or post middleware
const farm=mongoose.model('Farms',farmSchema)
module.exports =farm