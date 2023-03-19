const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const methodOverride = require('method-override')
const Campground = require('./models/campground.js')
const ejsMate = require('ejs-mate')

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


app.get('/',(req,res)=>{
    res.render('home.ejs')
})

app.get('/campgrounds', async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', {campgrounds})
})

app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new.ejs')
})


app.post('/campgrounds', async(req,res)=>{
const newCamp = new Campground(req.body.campground);
await newCamp.save();
res.redirect(`/campgrounds/${newCamp._id}`)
})

app.get('/campgrounds/:id/edit', async (req,res)=>{
const campground = await Campground.findById(req.params.id);
console.log(campground)
res.render('campgrounds/edit.ejs',{campground})
})


app.put('/campgrounds/:id', async(req,res)=>{
    const {id} = req.params;
    const newCampground = await Campground.findByIdAndUpdate(id,req.body.campground,{new:true})
    res.redirect(`/campgrounds/${newCampground._id}`)
})

app.delete('/campgrounds/:id', async(req,res)=>{
const id = req.params.id;
await Campground.findByIdAndDelete(id);
console.log('DELETED!')
res.redirect('/campgrounds')
})


app.get('/campgrounds/:id', async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show.ejs',{campground})
})


app.listen(3000,()=>{
console.log('serving on port 3000')
})