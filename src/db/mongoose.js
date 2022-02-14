const { append } = require('express/lib/response')
const mongoose =require('mongoose')
// const validator =require('validator')


mongoose.connect(process.env.MONGOCONNECT,{
    useNewUrlParser:true

    
})