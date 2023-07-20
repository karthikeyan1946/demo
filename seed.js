const mongoose = require('mongoose');
const product=require('./models/product')
const farm=require('./models/farm')
mongoose.connect('mongodb://127.0.0.1:27017/farmStore')
.then(()=>{
    console.log('mongo connection open')
})
.catch((e)=>{
    console.log('mongo error',e)
})
const seedProduct= [
    {
        name:'apple',
        price:15,
        category:'fruit'
    },
    {
        name:'potato',
        price:15,
        category:'vegetable'
    },
    {
        name:'orange',
        price:15,
        category:'fruit'
    },
    {
        name:'onion',
        price:15,
        category:'vegetable'
    },
    {
        name:'berries',
        price:15,
        category:'fruit'
    }

]
/*product.insertMany(seedProduct)
    .then((res)=>{
        console.log(res);
    }
    )
    .catch((e)=>{
        console.log(e)
    }

    )*/
const makeFarm=async ()=>{
        const newFarm=new farm({
            name:'cherry blossoms',
            city:'japan',
            email:'sakura11@gmail.com'
        })
        const p=await product.findOne({name:'apple'});
        //console.log(p);
        newFarm.products.push(p)
        console.log(newFarm)
        await newFarm.save()
}
const addProduct=async ()=>{
        const f=await farm.findOne({name:'cherry blossoms'})
        const p=await product.findOne({name:'potato'})
        f.products.push(p)
        await f.save()
}
//makeFarm()
//addProduct()