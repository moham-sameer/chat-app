import React, { useState } from 'react'
import io from 'socket.io-client'
import Chat from './pages/Chat'
const socket = io.connect('http://localhost:3000')
const App = () => {
  const [username,setUsername] = useState("")
  const [room,setRoom] = useState("")
  const [showChat,setShowChat] = useState(false)
  const joinRoom = ()=>{
    if(username !== "" && room !== ""){
      socket.emit("join_room",room);
      setShowChat(true)
    }
  }
  // useEffect(()=>{
  //   // listen for coming messages
  //   socket.on('message',(message)=>{
  //      setMessages(prevMessages =>[...prevMessages,message])
  //   })
  //   return ()=>{
  //     socket.off('message')
  //   }
  // },[])
  // const sendMessage = ()=>{
  //   if(input.trim() !== ''){
  //     // emit messages to the server
  //     socket.emit('sendMessage',input)
  //     setInput('')
  //   }
  // }
  return (
    <div>
    {!showChat? (<div>
      <h3>Join a chat</h3>
      <input type='text' placeholder='John...' onChange={(e)=>{setUsername(e.target.value)}}/>
      <input type='text' placeholder='Room ID...' onChange={(e)=>{setRoom(e.target.value)}}/>
      <button onClick={joinRoom}>Join A Room</button>
    </div>):(<Chat socket={socket} room={room} username={username}/>)}
    </div>
  )
}

export default App
