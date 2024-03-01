import React, { useEffect, useState,useRef } from 'react'

const Chat = ({socket,username,room,users}) => {
 const [currentMessage,setCurrentMessage] = useState("")
 const [messageList,setMessageList] = useState([])
 const sendMessage = async()=>{
  if(currentMessage.trim() !== ""){
    const messageData = {
      room: room,
      author: username,
      message: currentMessage,
      time:new Date(Date.now()).getHours()+":"+ new Date(Date.now()).getMinutes(),
    }
    await socket.emit("send_message",messageData);
    // setMessageList((list)=>[...list,messageData])
    setCurrentMessage("")
  }
 }
 const messageRef = useRef(null)
 useEffect(()=>{
  socket.on("receive_message",(data)=>{
    setMessageList((list)=>[...list,data])
    console.log(data)
    if(messageRef.current){
      messageRef.current.scrollIntoView({behavior:'smooth'})
    }
  })
  return () => {
    socket.off("receive_message");
  };
 },[socket])
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
            <div className='fixed left-[2rem] top-4'>
              {users.map((user,index)=>{
                return(
                  <li key={index}>{user}</li>
                )
              })}
            </div>
      <div className='w-[18rem] sm:w-[26rem] md:w-[34rem] lg:w-[45rem]   h-[30rem] overflow-y-auto  scrollbar-none scrollbar-thumb-gray-400 scrollbar-track-gray-100'>
      {messageList.map((messageContent,index)=>{
        const messageClass = username === messageContent.author ? 'bg-blue-500 text-white':'bg-gray-200 text-black'
        const messagePosition = username === messageContent.author ? 'items-end':'items-start'
        return(
          <div className='p-2' key={index} id={username === messageContent.author ? "you":"other"}>
            <div ref={messageRef} className={`flex flex-col ${messagePosition} `}>
              <div className={` p-2  max-w-md  my-2 rounded-lg ${messageClass}`}>
                <p className=''>{messageContent.message}</p>
              </div>
              <div className='flex pl-1 space-x-2 text-[10px]'>
                <p>{messageContent.time}</p>
                <p>{messageContent.author}</p>
              </div>
            </div>
          </div>
        )
      })}
      </div>
      <div className='border px-4 sm:w-[26rem] md:w-[34rem] border-slate-300 rounded-2xl flex justify-center items-center  h-[3.5rem]  w-[18rem] lg:w-[45rem]'>
        <input className='w-[24rem] md:w-[36rem] lg:w-[45rem] h-[3rem]  outline-none ' type='text' value={currentMessage} placeholder='Hey...' onChange={(e)=>setCurrentMessage(e.target.value)} onKeyPress={(e)=>{e.key === "Enter" && sendMessage()}}/>
        <button onClick={sendMessage} className=' ml-2 text-xl bg-gray-300 rounded-lg'>&#9658;</button>
      </div>
    </div>
  )
}

export default Chat
