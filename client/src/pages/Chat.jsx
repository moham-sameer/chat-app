import React, { useEffect, useState } from 'react'

const Chat = ({socket,username,room}) => {
 const [currentMessage,setCurrentMessage] = useState("")
 const [messageList,setMessageList] = useState([])

 const sendMessage = async()=>{
  if(currentMessage !== ""){
    const messageData = {
      room: room,
      author: username,
      message: currentMessage,
      time:new Date(Date.now()).getHours()+":"+ new Date(Date.now()).getMinutes(),
    }
    await socket.emit("send_message",messageData);
    setMessageList((list)=>[...list,messageData])
    setCurrentMessage("")
  }
 }
 useEffect(()=>{
  socket.on("receive_message",(data)=>{
    setMessageList((list)=>[...list,data])
    console.log(data)
  })
 },[socket])
  return (
    <div>
      <div>
      {messageList.map((messageContent,index)=>{
        return(
          <div key={index} id={username === messageContent.author ? "you":"other"}>
            <div>
              <div>
                <p>{messageContent.message}</p>
              </div>
              <div>
                <p>{messageContent.time}</p>
                <p>{messageContent.author}</p>
              </div>
            </div>
          </div>
        )
      })}
      </div>
      <div>
        <input type='text' value={currentMessage} placeholder='Hey...' onChange={(e)=>setCurrentMessage(e.target.value)} onKeyPress={(e)=>{e.key === "Enter" && sendMessage()}}/>
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  )
}

export default Chat
