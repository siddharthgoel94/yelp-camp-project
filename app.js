if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}
const express=require('express');
const helmet=require('helmet');
const MongoStore = require('connect-mongo');


const app=express();
const bodyParser = require("body-parser");
const methodOverride=require('method-override');
const path=require('path');
const expressMongoSanitize=require('express-mongo-sanitize');

const ejsMate=require('ejs-mate');
const session=require('express-session')
const flash=require('connect-flash')
const passport=require('passport');
const LocalStrategy=require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const dbUrl=process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp2';
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisisasecret'
    }
});
store.on("error",function(e){
    console.log("SESSION STORE ERROR");
})
const sessionConfig={
    store,
    name:"mysession",
    secret:"thisisasecret",
    resave:false,
    saveUnitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7 // max age of 1 week of this cookie
    }
}


const mongoose=require('mongoose');
mongoose.set('strictQuery',true);
// mongoose.connect('mongodb+srv://siddharthgoel2105:sidd%402105@cluster0.kmlqzpv.mongodb.net/?retryWrites=true&w=majority',
// {
//     useNewUrlParser:true,
//     // useCreateIndex:true, 
//     useUnifiedTopology:true
// }
// )

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
app.use(session(sessionConfig));
app.use(flash());
app.use(expressMongoSanitize());

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));




const Joi=require('joi');
const catchAsync=require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');
const Campground=require('./models/campgrounds')
const Review=require('./models/reviews')
const User=require('./models/user')
passport.use(User.createStrategy());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



const campgrounds=require('./routes/campgrounds')
const reviews=require('./routes/reviews')
const userRoutes=require('./routes/user');
const { log } = require('console');
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dsslq2vi3/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.engine('ejs',ejsMate);


const validateReview=(req,res,next)=>{
    const reviewSchema=Joi.object({
        review:Joi.object({
            body:Joi.string().required(),
        rating:Joi.number().required()

        })
        
        
    })
    const {error}=reviewSchema.validate(req.body);
    if(error){
        console.log(error);
        // const msg=error.details.map(el=>el.message).join(',')
        
        throw new ExpressError(error,400)
        
    }
    else{
        next();
    }
}
// app.get('/fakeuser',async(req,res,next)=>{
//     const user=new User({username:'sid@goel',email:'sid@goel.com'});
//     const newUser=await User.register(user,'1234');
//     res.send(newUser);
// })
app.use((req,res,next)=>{
    // console.log(req.query);
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})
app.use('/campgrounds',campgrounds);
app.use('/',userRoutes);
app.use('/campgrounds/:id/reviews',reviews);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.get('/',(req,res)=>{
    // res.send("Hello from YelpifrkCamp");
    res.render('home');
})






app.use((err,req,res,next)=>{
    console.log(req.body);
    // res.send("Oh boy something went wrong!!")
    const {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode)
    // const {err}=
    res.render('error',{err});
})
app.listen(3000,()=>{
    console.log('We are listening!!');
})




