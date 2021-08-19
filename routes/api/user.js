const express = require('express')
const router = express.Router()
const { check,validationResult } = require('express-validator')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
require('dotenv').config();
//@route    POST api/users
//@desc     Register user route
//@access   Public

router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Enter a valid Email').isEmail(),
    check('password','Enter password with 6 or more characters').isLength({ min : 6 })
], async (req,res)=> 
{
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }
    
    const { name, email, password} = req.body

    try
    {
        //Check if the user exists
        let user=await User.findOne({ email })

        if(user)
        {
            return res.status(400).json({ errors: [{msg : 'User Already exists' }] })
        }

        //Get user's Gravatar
        const avatar= gravatar.url (email,{
            s:'200', //size
            r:'pg', //rating
            d:'mm'  //default
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        //Hashing Password with salt
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password,salt)
        await user.save()

        //JWT Creation
        
        const payload = {
            user :
            {
                id: user.id //same as _id
            }
        }

        jwt.sign(payload,process.env.JWT_Secret, //jwtSecret defind in default.json
        {expiresIn : 360000},
        (err,token)=>{
            if (err) throw err
            res.json({ token })
        })
    } 
    catch(err)
    {
        console.error(err.message)
        res.status(500).send('Server Error')
    }    
})


//@route    POST api/user/login
//@desc     Authenticate user & get token
//@access   Public

router.post('/login',[
    check('email','Enter a valid Email').isEmail(),
    check('password','Password Invalid').exists()
], async (req,res)=> 
{
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }
    
    const { email, password} = req.body

    try
    {
        //Check if the user exists
        let user=await User.findOne({ email })

        if(!user)
        {
            return res.status(400).json({ errors: [{msg : 'User not found' }] })
        }
        
        //JWT Creation

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch)
        {
            return res.status(400).json({ errors: [{msg : 'Invalid Credentials' }] })
        }
        
        const payload = {
            //user :
            //{
                id: user.id, //same as _id
                name: user.name, 
                avatar: user.avatar
            //}
        }

        jwt.sign(payload,process.env.JWT_Secret, //jwtSecret defind in default.json
        {expiresIn : 360000},
        (err,token)=>{
            if (err) throw err
            res.json({ token })
        })
    } 
    catch(err)
    {
        console.error(err.message)
        res.status(500).send('Server Error')
    }    
})



module.exports = router