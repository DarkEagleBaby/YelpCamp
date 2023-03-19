const cities = require('./cities.js');
const Campground = require('../models/campground.js');
const {descriptors, places} = require('./seedHelpers.js')
const mongoose = require('mongoose')

main().catch((err) =>{
    // console.log('ERROR CONNECTING TO MONGODB DATABASE')
    console.log(err)
})

async function main() {
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
console.log('successfully connected to mongoDB')
}

const sample = (array)=>{return array[Math.floor(Math.random()*array.length)]}

const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*50 + 10);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://source.unsplash.com/random/?campground`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam libero doloremque commodi, esse possimus nihil tenetur magni neque itaque praesentium nostrum dolores dolor nobis et hic aliquam dolorum error voluptates!',
            price: price
        })
        try{
        await camp.save();}catch{err=>{console.log(err)}}
    }

}

seedDB().then(()=>{
    console.log('CLOSING CONNECTION');
    mongoose.connection.close();
})