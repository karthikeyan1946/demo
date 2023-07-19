let express = require('express')
let app=express()
const path=require('path')
const methodOverride = require('method-override')
const appError=require('./appError')
const flash = require('connect-flash');
const session = require('express-session')

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/farmStore')
.then(()=>{
    console.log('mongo connection open')
})
.catch((e)=>{
    console.log('mongo error',e)
})
const product=require('./models/product')
const farm=require('./models/farm')

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'))
app.use(flash());
app.use(session({secret:'secret'}));



let categories=['fruit','vegetable','dairy']
function wrapAsync(fn){
    return function (req,res,next){
        fn(req,res,next).catch((e)=>{
            return next(e)
        })
    }
}

app.use((req,res,next)=>{
    res.locals.messages=req.flash('success')
    next();
})
app.get('/',(req,res)=>{
    res.render('home')
})

///   ***************************************************  farm routes    ****************************************************************     /////
app.get('/farms',async (req,res)=>{
    const f=await farm.find();
    //console.log(f);
    res.render('farm/index',{f})
})

app.get('/farms/new',(req,res)=>{
    res.render('farm/new')
})
app.post('/farms',async (req,res)=>{
    const newFarm=new farm(req.body);
    await newFarm.save()
    req.flash('success','successfully your farm is added')
    res.redirect('/farms')

})



app.get('/farms/:id/show',async (req,res)=>{
    const {id}=req.params;
    const f=await farm.findById(id).populate('products')
    if(!f){
        next(new Error('Not available',404))
    }else{
        res.render('farm/show',{f})
    }
})
// If we want to delete farm the related products to it can be deleted specifically if we used mongoose middleware pre or post in the models folder see mongoose middleware docs for reference

///   ********************************************   product routes  ********************************************************************      /////
app.get('/products',async (req,res)=>{
    const p=await product.find({})
    //console.log(p)
    res.render('product/index',{p})
})

app.get('/products/:id/new',(req,res)=>{
    const {id}=req.params
    res.render('product/new',{id});
})
app.post('/products/:id',wrapAsync(async (req,res,next)=>{
        const {body}=req
        const {id}=req.params;
        //console.log(body)
        const newProduct = new product(body)
        await newProduct.save()
        const f=await farm.findById(id)
        f.products.push(newProduct);
        await f.save()
        res.redirect(`/farms/${id}/show`)
    

}))



app.get('/products/:id/show',async (req,res,next)=>{
    
    const {id}=req.params;
    const p=await product.findById(id)
    //console.log(p)
    if(!p){
         next(new Error('Not available',404))
     }else{
        res.render('product/show',{p})
    }
   

})


app.get('/products/:id/edit',async (req,res,next)=>{
    try{
        const {id}=req.params;
        const p=await product.findById(id)
        //console.log(p)
        res.render('product/edit',{p,categories})
    }catch(e){
        next(e)
    }
    
})
app.patch('/products/:id',async (req,res,next)=>{
    try{
        let update=req.body;
        let {id}=req.params
        //console.log(update)
        const count=await product.findByIdAndUpdate(id,update,{runValidators:true})
        //const p=await product.find({})
        res.redirect('/products')
        //res.render('product/index',{p})
    }catch(e){
        next(e)
    }

})


app.delete('/products/:id',async (req,res)=>{
    let {id}=req.params
    await product.findByIdAndDelete(id)
    res.redirect('/products')
}
)
app.use((err,req,res,next)=>{
    console.log(err.name)
    next(err)
})

app.use((err,req,res,next)=>{
    let {status=500,message='unkown error'}=err
    res.status(status).send(message)
})

app.listen('3000',(req,res)=>{
    console.log('listening on 3000')
})