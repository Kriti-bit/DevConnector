const mongoose = require('mongoose')
const Schema = mongoose.Schema //Instead of using mongoose.Schema now use Schema

const PostSchema = new Schema ({
    user : {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text :{
        type: String,
        required: true,
        name: {
            type: String
        },
        avatar: {
            type: String
        }
    },

    likes: [
        {
            user : {
                type: Schema.Types.ObjectId,
                ref: 'users' //To keep a track of the user who like the post
                                //Ensuring a user likes a certain post only once
            },

            comments :
            [
                {
                    user : {
                        type: Schema.Types.ObjectId,
                        ref: 'users'
                    },

                    text: {
                        type: String,
                        required:true
                    },
                    name: {
                        type: String
                    },
                    avatar: {
                        type: String
                    },
                    date:{
                        type :Date,
                        default: Date.now
                    }
                }
            ]
        }
    ],
    date:{
        type :Date,
        default: Date.now
    }
})

module.exports = Post = mongoose.model('post', PostSchema)