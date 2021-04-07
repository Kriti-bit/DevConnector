const express = require('express')
const router = express.Router()
const {check , validationResult} = require('express-validator')
const auth = require('../../middleware/auth')
const config = require('config')
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

//@route    POST api/posts
//@desc     Crate a post
//@access   Private

router.post('/',[auth, [check ('text','Text is required').not().isEmpty() ]], async (req,res) => 
{
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json( { errors: errors.array() } )
    }


    try {
        const user = await User.findById(req.user.id).select('-password')

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })
        
        const post = await newPost.save()
        res.json(post)
    } catch (err) {
        console.error(err.message)        
        return res.status(500).send('Server Error')
    }
}),

//@route    GET api/posts
//@desc     Get all posts
//@access   Private
router.get('/',auth, async (req,res) => {
    try {
        const posts = await Post.find().sort({ date: -1 }) //Set date -1 to get recent posts first
        res.json(posts)
    } catch (err) {
        console.error(err.message)        
        return res.status(500).send('Server Error')               
    }
})

//@route    GET api/posts
//@desc     Get post by Id
//@access   Private
router.get('/:id',auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id) //Set date -1 to get recent posts first
    
        if(!post)
        {
            return res.status(404).json({ msg: 'Post not found' })
        }

        res.json(post)

    } catch (err) {
        if(err.kind==='ObjectId')
        {
            return res.status(404).json({ msg: 'Post not found' })
        }
        console.error(err.message)        
        return res.status(500).send('Server Error')               
    }
})

//@route    DELETE api/posts
//@desc     Delete a post
//@access   Private

router.delete('/:id',auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(!post)
        {
            return res.status(404).json({ msg: 'Post not found' })
        }
        
        //Check if user is deleting someone else's post
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'User not authorised' })
        }

        await post.remove()

        res.json({ msg: 'Post removed' })
    } catch (err) {
        console.error(err.message) 
        if(err.kind==='ObjectId')
        {
            return res.status(404).json({ msg: 'Post not found' })
        }       
        return res.status(500).send('Server Error')               
    }
})


//@route    PUT api/like/:id
//@desc     Like a post
//@access   Private

router.put('/like/:id',auth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)

        //Check if the post has already been liked
        if( post.likes.filter(like=> like.user.toString() === req.user.id).length > 0)
        {
            return res.status(400).json( {msg: 'Post already liked'} ) 
        }

    post.likes.unshift( {user: req.user.id } )
    await post.save()
    res.json(post.likes)
    } catch (err) {
        console.error(err.message)        
        return res.status(500).send('Server Error') 
    }
})

//@route    PUT api/unlike/:id
//@desc     Like a post
//@access   Private

router.put('/unlike/:id',auth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)

        //Check if the post has already been liked
        if( post.likes.filter(like=> like.user.toString() === req.user.id).length === 0)
        {
            return res.status(400).json( {msg: 'Post not yet liked'} ) 
        }

        //Get index of post to be unliked
    const removeIndex = post.likes.map(like => like.user.toString().indexOf(req.user.id))

    //removing 1 splice(like)
        post.likes.splice(removeIndex,1)

    await post.save()
    res.json(post.likes)
    
    } catch (err) {
        console.error(err.message)        
        return res.status(500).send('Server Error') 
    }
})

//@route    POST api/posts/comment/:id
//@desc     Comment on a post
//@access   Private

router.post('/comment/:id',[auth, [check ('text','Text is required').not().isEmpty() ]], async (req,res) => 
{
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json( { errors: errors.array() } )
    }


    try {
        const user = await User.findById(req.user.id).select('-password')
        const post = await Post.findById(req.params.id)
        
        const newComment = { 
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }//Not a database collection, this is just an oject so we removed 'new' keyword
        
        //console.log(post)

       post.comments.unshift(newComment)
        
        await post.save()

        res.json(post.comments) //sending back all comments

    } catch (err) {
        console.error(err.message)        
        return res.status(500).send('Server Error')
    }
})

//@route    DELETE api/posts/comment/:id/:comment_id (We need both comment and post id)
//@desc     Delete a post
//@access   Private

router.delete('/comment/:id/:comment_id', auth , async (req,res) =>{

    try {
        const post = await Post.findById(req.params.id)

        //Pull out the comment to be deleted
        const comment = post.comments.find(comment => comment.id === req.params.comment_id) //comment => will check for check for each comment's id
        // This return the comment if it exists otherwise it will return false
    
        //If comment does not exist
        if(!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' })
        }

        //check if the user who created the comment is the one deleting it
        if(comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User is not authorized' })
        }

        //Get index of post from which comment is to be deleted
        const removeIndex = post.comments.map(comment => comment.user.toString().indexOf(req.user.id))
    
        //removing 1 splice(like)
            post.comments.splice(removeIndex,1)
    
        await post.save()
        res.json(post.comments)
        
    
    } catch (err) {
        console.error(err.message)        
        return res.status(500).send('Server Error')
    }
})

module.exports = router