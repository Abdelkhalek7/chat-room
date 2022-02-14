const path = require('path')
const http = require('http')
const express = require('express')
const User = require('./models/Users')
const Room = require('./models/room')
const socketio = require('socket.io')
require('./db/mongoose')

const { generateMessage, generateLocationMessage } = require('./utils/messages')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket) => {
    console.log('New WebSocket connection')

   ////////////////////////////////////////////////////////////////////////
   socket.on('roomdeleted',async (room) => {
    console.log('deleted')
    await Room.deleteOne({name:room})
    socket.broadcast.to(room).emit('deleted')
      })
   socket.on('chekjoin',async (username,roomname,password, callback) => {
        
    try{
      const room =await Room.findOne({name:roomname})
      if (!room){
        return callback("1")
      }
     if (room.password==password) {
      console.log(room)
      return callback()
     }
     return callback("2")

    }catch(err){
       return callback(err)
   }
})
   ///pZWsdC7ZCptbkKptAAAD/////////////////////////////////////////////////////////////////////

   socket.on('createroom',async (username,roomname,password, callback) => {
        
    try{
        const room =await Room.findOne({name:roomname})
        console.log('1')
       if(room){
         return callback('error')
        }    
        const rom=new Room({name:roomname,admin:username,password:password})
        await rom.save()
        callback() 
        console.log('2')
    }catch(err){
        callback(err) 
    }
     
})
  

   /////////////////////////////////
    socket.on('join',async (options, callback) => {
        
        try{
            console.log(options.room) 
          const user=new User({username: options.username,room: options.room,id: socket.id})
          console.log('join1')
          console.log(user)
          socket.join(user.room)
          await user.save()

          const usr =await User.find({room:user.room})
          const room =await Room.findOne({name:options.room})
          console.log(room)
          console.log('join1')

          
         const admin = room.admin
         if(admin!==options.username) {
            callback("1")
         } 


         socket.emit('beforeMessage', room.messages)
        
  
         socket.broadcast.to(user.room).emit('message', generateMessage('', `${user.username} has joined!`))
         io.to(user.room).emit('roomData', {
            room: user.room,
            users:usr,
            admin

        })

        callback()
        }catch(err){
           return callback(err)
       }
      

        
    })

    socket.on('sendMessage', async(messag, callback) => {
        console.log(socket.id)

        const user =await User.findOne({id:socket.id})
        console.log(user)
        const room =await Room.findOne({name:user.room})
       const message={
        msg: messag,
        owner: user.username
        }
      
        await Room.updateOne({name:user.room},{$push:{messages:{message:{
            msg: messag,
            owner: user.username,
            time:new Date().getTime()
            }}}})

            console.log('usermsed')
        io.to(user.room).emit('message', generateMessage(user.username, messag))
        const y=generateMessage(user.username, messag)
        console.log(y)
        callback()
    })

    socket.on('sendLocation', async(coords, callback) => {
        const user =await User.findOne({id:socket.id})
        console.log(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    
    socket.on('welcome', async(username) => {
        const user =await User.findOne({username:username})
        console.log(username)

        console.log(socket.id)
        console.log(user)

        console.log(user.id)

        user.id=socket.id
        user.save()
        socket.join(user.room)
        const usr =await User.find({room:user.room})
        io.to(user.room).emit('roomData', {
            room: user.room,
            users:usr,
            admin

        })
    })

    socket.on('disconnect', async() => {
        const user =await User.findOne({id:socket.id})
        await User.deleteOne({id:socket.id})

        if (user) {
            const usr =await User.find({room:user.room})
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users:usr
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})