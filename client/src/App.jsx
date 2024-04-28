import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Chat from './pages/Chat'
const socket = io.connect('https://chat-app-two-rho-45.vercel.app')
const App = () => {
  const [username,setUsername] = useState("")
  const [room,setRoom] = useState("")
  const [showChat,setShowChat] = useState(false)
  const [users,setUsers] = useState([])
  
  useEffect(()=>{
    socket.on('updateUserList',(userList) =>{
      setUsers(userList)
      
    })
    // Cleanup on unmount or disconnect 
    return ()=>{
      socket.off('updateUserList')
    }
  },[])


  const joinRoom = ()=>{
    if(username !== "" && room !== ""){
      socket.emit("join_room",room);
      setShowChat(true)
     
    }
  }

  return (
    <div>
    {!showChat? (<div className='flex  items-center  justify-center h-screen'>
      <div className='flex shadow-lg space-y-4 flex-col border justify-center w-[18rem] h-[20rem] items-center border-gray-400'>

      <h3 className='text-red-600 text-2xl pt-3 font-serif font-bold'>Join a chat</h3>
      <input className='w-[12rem] border outline-none p-1  border-gray-200' type='text' placeholder='John...' onChange={(e)=>{setUsername(e.target.value)}}/>
      <input className='w-[12rem] border border-gray-200 p-1 outline-none' type='text' placeholder='Room ID...' onChange={(e)=>{setRoom(e.target.value)}}/>
      <button onClick={joinRoom} className='p-3 bg-green-900 text-white rounded-lg border  border-gray-200'>Enter Room</button>
      </div>
    </div>):(<Chat users={users} socket={socket} room={room} username={username}/>)}
    </div>
  )
}

export default App
