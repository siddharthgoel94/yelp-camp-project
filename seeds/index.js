descriptors = [
    'Forest',
    'Ancient',
    'Petrified',
    'Roaring',
    'Cascade',
    'Tumbling',
    'Silent',
    'Redwood',
    'Bullfrog',
    'Maple',
    'Misty',
    'Elk',
    'Grizzly',
    'Ocean',
    'Sea',
    'Sky',
    'Dusty',
    'Diamond'
]

places = [
    'Flats',
    'Village',
    'Canyon',
    'Pond',
    'Group Camp',
    'Horse Camp',
    'Ghost Town',
    'Camp',
    'Dispersed Camp',
    'Backcountry',
    'River',
    'Creek',
    'Creekside',
    'Bay',
    'Spring',
    'Bayshore',
    'Sands',
    'Mule Camp',
    'Hunting Camp',
    'Cliffs',
    'Hollow'
]

const mongoose=require('mongoose');
const Campground=require('../models/campgrounds')
const cities=require('./cities');
// const {descriptors,places}=require('./seedHelpers');
// console.log(descriptors);
const dbUrl="mongodb+srv://siddharthgoel2105:sidd%402105@cluster0.kmlqzpv.mongodb.net/?retryWrites=true&w=majority";
// 'mongodb://localhost:27017/yelp-camp2'
mongoose.connect(dbUrl,
{
    useNewUrlParser:true,
    // useCreateIndex:true, 
    useUnifiedTopology:true
}
)
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connectioon error:"));
db.once("open",()=>{
    console.log("Database connected");
});
const sample=array=> {
    const num=Math.floor(Math.random()*array.length);
    return array[num];
}
const makeName=(arr)=>{
    const num=Math.floor(Math.random()*arr.length);
    return arr[num];
}

const seedDb=async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const calcPrice=Math.floor(Math.random()*20)+10;
        const newCamp=new Campground({location:`${cities[random1000].city}, ${cities[random1000].state}`,
        title:`${makeName(descriptors)} ${makeName(places)}`,
        author:"6484228b1ce86223ac5d7285",
        price:calcPrice,
        geometry: { type: 'Point', coordinates: [cities[random1000].longitude,cities[random1000].latitude] },
        images: [
            {
              url: 'https://res.cloudinary.com/dsslq2vi3/image/upload/v1686376919/YelpCamp/xzr3igl66cimealn5hk3.jpg',
              name: 'YelpCamp/xzr3igl66cimealn5hk3',
              
            },
            {
              url:'https://res.cloudinary.com/dsslq2vi3/image/upload/v1686376921/YelpCamp/g6rjpivxmyqbiaplmd5d.jpg' ,
              name:'YelpCamp/g6rjpivxmyqbiaplmd5d',
             
            }
          ],
        
description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero doloribus sequi officiis ducimus velit similique itaque! Officia assumenda repellat cum quod, illum esse consequatur expedita, alias porro autem earum dolorem!"
    });
        await newCamp.save();

        

    }
    
    
    
    
}
seedDb().then(()=>{
    mongoose.connection.close();
})