const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const config = require('config')
const { check,validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require ('../../models/User')

//@route    GET api/auth
//@desc     Test Route
//@access   Public

router.get('/',auth, async (req,res)=> {
    try{
    const user = await User.findById(req.user.id).select('-password') //Since we don't want to return the password, we return everything minus password
    res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//@route    POST api/auth
//@desc     Authenticate user & get token
//@access   Public

router.post('/',[
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
            user :
            {
                id: user.id, //same as _id
            }
        }

        jwt.sign(payload,config.get('jwtSecret'), //jwtSecret defind in default.json
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