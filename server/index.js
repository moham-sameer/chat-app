const express = require('express')
const app = express()
const mongoose = require('mongoose')
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io')
const Message = require('./model/product')
require('./db/connect')
const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        origin:"http://localhost:5173",
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

    socket.on("join_room",(data)=>{
        socket.join(data)
        console.log(`User with ID: ${socket.id} joined room`)
    })
    socket.on("send_message",async(data)=>{
        try {
            const message = new Message(data)
            await message.save();
            io.to(data.room).emit("receive_message",data)
        } catch (error) {
            console.error("Error saving message:",error)
        }
        
    })
    socket.on("disconnect",()=>{
        console.log("User disconnected",socket.id)
    })
})

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  const PORT = 3000;
    // Start listening for connections
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
