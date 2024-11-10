const express=require('express')
const Official=require('../models/official')
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const fetchofficial=require('../middleware/fetchofficial')

const JWT_SECRET='Bennyi$ag00dguy'

const router=express.Router();


//route-1: create a new user /api/auth/createuser
router.post('/createofficial', [
    body('name', 'Enter a valid name').isLength({ min: 5 }).trim(),
    body('email', 'Enter a valid email').isEmail().trim(),
    body('phone', 'Enter a valid phone number').matches(/^[0-9]{10}$/).trim(),
    body('password', 'Password must contain at least 5 characters').isLength({ min: 5 }).trim(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    
    //checks if there exists already a user with same email
    
    try {
        
        let official=await Official.findOne({email: req.body.email});
        if(official){
            return res.status(400).json({error: "Sorry an Officer with this email already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const secPass=await bcrypt.hash(req.body.password,salt);
        official =await Official.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: secPass,
        })
        
        
        const data={
            official:{
                id:official.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET)
        console.log(authtoken);
        
        
        res.json({authtoken})
    } catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured")
    }
    //   .then(user => res.json(user))
    //   .catch(err=>{console.log(err)
    //     res.json({error:"Please enter a unique value for email",message:err.message})
    //   })
    
    
    // without validator
    // console.log(req.body)
    // const user=User(req.body)
    // user.save()
    // res.send(req.body)
})


//route-2: login a user /api/auth/login
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
],async (req,res)=>{
    //if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body
    try{ 
        let official=await Official.findOne({email});
        if(!official){
            return res.status(400).json({error:"Please try to login with correct credentials"})
        }
        const passwordCompare=await bcrypt.compare(password,official.password);
        if(!passwordCompare){
            return res.status(400).json({error:"Please try to login with correct credentials"})
        }
        const data={
            official:{
                id:official.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET)
        console.log(authtoken);
        res.json({authtoken})
        
    }catch(error){
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})  




router.post('/getofficial', fetchofficial, async (req, res) => {
    try {
        const officerId = req.official.id;
        const official = await Official.findById(officerId).select("-password");

        if (!official) {
            return res.status(404).send("Officer not found");
        }

        res.send(official);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports=router