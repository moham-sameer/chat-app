const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io')
require('./db/connect')
const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        origin:"*",
        methods: ["GET", "POST"],
    }
})

// mongoose.connect('mongodb://127.0.0.1:27017/MyDb')
// const db = mongoose.connection;
// db.once('open',()=>{
//     console.log("Connected to MongoDB")

// })
// ? Middleware
app.use(express.json())
app.use(cors())

// ? Routes
// app.use('/api/auth',require('./routes/auth'))
// app.use('/api/message',require('./routes/messages'))

// ? Socket.io
io.on("connection",(socket)=>{
    console.log(`User Connected: ${socket.id}`)
     //! Handle joining room
    socket.on("join_room",(data)=>{
        socket.join(data)
        console.log(`User with ID: ${socket.id} joined room`)
        io.to(data).emit('updateUserList', getUsersInRoom(data))
    })
    //! Handle Leaving the room
    socket.on('leaveRoom',(room)=>{
        socket.leave(room);
        // update list of users in the room
        io.to(room).emit('updateUserList',getUsersInRoom(room))
    })
    socket.on("send_message",(data)=>{
        try {
            
            io.to(data.room).emit("receive_message",data)
        } catch (error) {
            console.error("Error saving message:",error)
        }
        
    })
    socket.on("disconnect",()=>{
        console.log("User disconnected",socket.id)
    })
})

function getUsersInRoom(room){
 const clients = io.sockets.adapter.rooms.get(room)
  if(clients){
    return Array.from(clients).map(socketId => io.sockets.sockets.get(socketId).username)
  }
  return[];
}

  const PORT = 3000;
    // Start listening for connections
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
