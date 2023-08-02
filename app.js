const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const methodOverride = require('method-override')
const Campground = require('./models/campground.js')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync.js')
const expressError = require('./utils/expressError.js')
const {campgroundSchema} = require('./schemas.js')
const Joi = require('joi')

main().catch((err) =>{
    // console.log('ERROR CONNECTING TO MONGODB DATABASE')
    console.log(err)
})

async function main() {
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
console.log('successfully connected to mongoDB')
}

const db = mongoose.connection;
const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))


//function for validating a new/edited campground according to the Joi template we defined in the schemas.js file. 
const validateCampground = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body);
if(error){
    const msg = error.details.map(el=>el.message).join(',');
    throw new expressError(msg,400)
}else{next()}
}


app.get('/',(req,res)=>{
    res.render('home.ejs')
})

app.get('/campgrounds', catchAsync(async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', {campgrounds})
    console.log(campgrounds);
}))

app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new.ejs')
})


app.post('/campgrounds',validateCampground ,catchAsync(async(req,res,next)=>{
console.log(req.body);
const newCamp = new Campground(req.body.campground);
await newCamp.save();
res.redirect(`/campgrounds/${newCamp._id}`)
}))

app.get('/campgrounds/:id/edit', async (req,res)=>{
const campground = await Campground.findById(req.params.id);
console.log(campground)
res.render('campgrounds/edit.ejs',{campground})
})


app.put('/campgrounds/:id', validateCampground, catchAsync(async(req,res)=>{
    const {id} = req.params;
    const newCampground = await Campground.findByIdAndUpdate(id,req.body.campground,{new:true})
    res.redirect(`/campgrounds/${newCampground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async(req,res)=>{
const id = req.params.id;
await Campground.findByIdAndDelete(id);
console.log('DELETED!')
res.redirect('/campgrounds')
}))


app.get('/campgrounds/:id', catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show.ejs',{campground})
}))

//adding a catch all -> a route for ANY unrecognised request, be it a GET or a POST and so forth. very important to put this after all our other routes!

app.all('*',(err,req,res,next)=>{
    next(new expressError('404 page not found',404))
})

//when we catch an error and pass it onwards using next(err) -> this is the function that will run:

app.use((err, req, res, next) => {
    if(!err.message){err.message="There's been an error:"}
    res.render('error.ejs',{err})
});



app.listen(3000,()=>{
console.log('serving on port 3000')
})