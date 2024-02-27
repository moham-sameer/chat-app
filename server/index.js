const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io')


const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        origin:"http://localhost:3000",
        methods: ["GET", "POST"],
    }
})

// mongoose.connect('mongodb://127.0.0.1:27017/MyDb')
// const db = mongoose.connection;
// db.once('open',()=>{
//     console.log("Connected to MongoDB")

// })
// ? Middleware
// app.use(express.json())
// app.use(cors())

// ? Routes
// app.use('/api/auth',require('./routes/auth'))
// app.use('/api/message',require('./routes/messages'))

// ? Socket.io
io.on('connection',(socket)=>{
    console.log(`User Connected: ${socket.id}`)

    socket.on('join_room',(data)=>{
        socket.join(data)
        console.log(`User with ID: ${socket.id}`)
    })
    socket.on('sendMessage',(data)=>{
        socket.to(data.room).emit('receive_message',data)
        
    })
    socket.on('disconnect',()=>{
        console.log("User disconnected",socket.id)
    })
})

server.listen(3000,console.log("Server is listening on port 3000"))
