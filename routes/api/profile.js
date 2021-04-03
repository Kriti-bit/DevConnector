const express = require('express')
const request = require('request')
const router = express.Router()
const config = require('config');
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const {check , validationResult } = require ('express-validator')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')

//@route    GET api/profile/me
//@desc     Get current user's profile
//@access   Private

router.get('/me',auth, async (req,res)=> {
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar'])

        if(!profile)
        {
            return res.status(400).json({ msg: 'There is no profile for this user'})
        }

        res.json(profile)

    }catch(err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//@route    POST api/profile
//@desc     Create or Update a user's profile
//@access   Private

router.post('/', [auth,[ 
  check( 'status', 'Status is required').not().isEmpty(), // Status is a compulsory field here
    check('skills','Skills is required').not().isEmpty()
]], async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){ // In case errors exist
        console.errors(errors)
        return res.status(400).json({ errors: errors.array() }) }

    // destructure the request
    const {
        website,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
        company,
        location,
        githubusername,
        bio,
        status

        // spread the rest of the fields we don't need to check
        //...rest
      } = req.body;

      //Build profile object
      const profileFields = {}
      profileFields.user = req.user.id
      if (company) profileFields.company = company
      if (website) profileFields.website = website
      if (location) profileFields.location = location
      if (bio) profileFields.bio = bio
      if (status) profileFields.status = status
      if (githubusername) profileFields.githubusername = githubusername

      if(skills) {
          profileFields.skills = await skills.split(',').map(skills => skills.trim()) //convert skills to an array and remove spaces in every element of array
      }

      //Build social object
      profileFields.social = {}
      if (youtube) profileFields.social.youtube = youtube
      if (twitter) profileFields.social.twitter = twitter
      if (facebook) profileFields.social.facebook = facebook
      if (linkedin) profileFields.social.linkedin = linkedin
      if (instagram) profileFields.social.instagram = instagram

      try {
          let profile = await Profile.findOne( { user : req.user.id } )

        if(profile) {
            //Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            )

            return res.json(profile)
        }

        //Create
        profile = new Profile(profileFields)

        await profile.save()
        res.json(profile)

    }catch (err){
         console.error(err.message)
         res.status(500).send('Server Error')   
    }
})


//@route    GET api/profile
//@desc     Get all profiles (using profile id)
//@access   Public


router.get('/', async (req,res) =>{
    try {
        const profiles = await Profile.find().populate('user', [ 'name','avatar' ] ) //From user collection, bring name and avatar
        res.json(profiles)
    } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')   
    }
})

//@route    GET api/profile/user/:user_id    //Here :user_id represents a place holder
//@desc     Get all profiles (using user id)
//@access   Public


router.get('/user/:user_id', async (req,res) =>{
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', [ 'name','avatar' ] ) //From user collection, bring name and avatar

        if(!profile)
            return res.status(400).json({ msg: 'Profile Not found'})

            res.json(profile)

    } catch (err) {

        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile Not found'})
        }

    console.error(err.message)
    res.status(500).send('Server Error')   
    }
})

//@route    DELETE api/profile
//@desc     Delete profile and posts
//@access   Private


router.delete('/',auth , async (req,res) =>{
    try {
        //todo = remove user posts

        //Remove Profile
        await Profile.findOneAndRemove({ user : req.user.id })
        await User.findOneAndRemove({ _id : req.user.id })
        res.json({msg:'User Removed'})
    } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')   
    }
})

//@route    PUT api/profile/experience
//@desc     Add profile experience
//@access   Private

router.put('/experience',[auth,[
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]],async(req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() })
    }

    //Destructuring the request

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

        try {
            const profile = await Profile.findOne({ user: req.user.id })
            profile.experience.unshift(newExp) //Add elements from the beginning instead of adding them from the end. Or, in reverse order. Most recent elements are added first
            await profile.save()
            res.json(profile)
            
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')
        }
    

})

//@route    DELETE api/profile/experience/:exp_id
//@desc     Delete experience from profile
//@access   Private

router.delete('/experience/:exp_id',auth, async (req,res) => 
{
    try {

        const profile = await Profile.findOne({ user: req.user.id })

        //Get Remove Index
        const removeIndex = profile.experience.map( item => item.id ).indexOf(req.params.exp_id)

        profile.experience.splice(removeIndex ,1) //As we want to remove only a splice 

        await profile.save()

        res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error') 
    }
}) 

//@route    PUT api/profile/education
//@desc     Add profile education
//@access   Private

router.put('/education',[auth,[
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('fieldofstudy', 'fieldofstudy is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]],async(req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() })
    }

    //Destructuring the request

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

        try {
            const profile = await Profile.findOne({ user: req.user.id })
            profile.education.unshift(newEdu) //Add elements from the beginning instead of adding them from the end. Or, in reverse order. Most recent elements are added first
            await profile.save()
            res.json(profile)
            
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')
        }
    

})

//@route    DELETE api/profile/education/:edu_id
//@desc     Delete education from profile
//@access   Private

router.delete('/education/:edu_id',auth, async (req,res) => 
{
    try {

        const profile = await Profile.findOne({ user: req.user.id })

        //Get Remove Index
        const removeIndex = profile.education.map( item => item.id ).indexOf(req.params.edu_id)

        profile.experience.splice(removeIndex ,1) //As we want to remove only a splice 

        await profile.save()

        res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error') 
    }
})

//@route    GET api/profile/github/:username
//@desc     Get user repos from GitHub
//@access   Public

router.get('/github/:username' , (req,res) =>{
    try {
        const options = {
            uri : `http://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secrets=${config.get('githubSecret')}`, // `` is used here and not this ''
            method : 'GET',
            headers: {'user-agent' : 'node.js' }
        }

        request(options,(error, response, body) =>{
            if(error) console.error(error)

            if(response.statusCode !== 200)
            {
                return res.status(404).json({ msg: 'No GitHub profile found' })
            }

                res.json(JSON.parse(body))

        })

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')       
    }
})

module.exports = router