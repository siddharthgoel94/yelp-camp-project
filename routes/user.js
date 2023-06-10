const express=require('express');
const router=express.Router();
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync');
const passport = require('passport');
const {storeReturnTo}=require('../middleware');

router.get('/register',(req,res)=>{
    res.render('User/register');
})
router.get('/login',(req,res)=>{
    res.render('User/login');
})
router.post('/register',catchAsync(async(req,res)=>{
    // res.send(req.body);
    try{
    const {username,email,password}=req.body;
    const user=new User({username,email});
    const regUser=await User.register(user,password);
    req.login(regUser,err=>{
        if(err) return next(err)
        console.log(regUser);
        req.flash('success',"welcome to yelp camp");
         res.redirect('/campgrounds');
        
    })
    
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
}))
router.post('/reg',storeReturnTo, passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}) , async (req,res)=>{
    // const user=await User.findOne({username:req.body.username});
    // console.log(user);
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    req.flash('success',"Logged in successfully Good Job!")
   res.redirect(redirectUrl);
  
    
  })

router.get('/logout', (req, res, next) => {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Goodbye!');
            res.redirect('/campgrounds');
        });
    }); 











module.exports=router;