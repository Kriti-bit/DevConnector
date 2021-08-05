const express= require('express')
const connectDB = require('./config/db')
var ObjectId = require('mongodb').ObjectID;

const app=express()

const PORT = process.env.PORT || 5000

connectDB() //Connect to the database

//Init Middleware using express as it includes the package
app.use(express.json({ extended : false })) //sending data

app.get('/',(req,res)=>{
    res.send("API is running")
})

app.use('/api/user',require('./routes/api/user'))
app.use('/api/posts',require('./routes/api/posts'))
app.use('/api/profile',require('./routes/api/profile'))
app.use('/api/auth',require('./routes/api/auth'))

app.listen(PORT,()=>{console.log('Server started on port '+PORT)})