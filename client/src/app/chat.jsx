import React, { useEffect, useState, useRef } from 'react'
import './styles/chat.css'
import { io } from "socket.io-client";

function Chat({activeMessage , getMessages, messages, isLoading }){
  const [messagesInput, setMessagesInput] = useState("")
  const [socket, setSocket] = useState(null);


  const messagesEndRef = useRef(null);
  const messagesListRef = useRef(null);


  useEffect(() => {    
    const newSocket = io('https://chatapp-4xir.onrender.com');
    setSocket(newSocket);
    newSocket.on("message", () => {
      getMessages();  
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
    }
  };




  async function sendChat(){
    if(messagesInput != ""){
    const data = {user:localStorage.getItem("token"),
      to:activeMessage.id,  
      message:messagesInput
      }
      console.log(data)

      const response = await fetch("https://chatapp-4xir.onrender.com/api/sendMessage", 
      {method: "POST", 
      headers: {"Content-Type": "application/json"}, 
      body: JSON.stringify(data)})
      var res = await response.json();
      console.log(res)
      getMessages();
      setMessagesInput("")
      console.log("socket" ,socket)
      socket.emit('message', 'world');
    }
  }
  var messagesElement = <div></div>;
  if (messages) {
    messagesElement = messages.map((data,index) => (
      <li key={data.id} className={data.sender ? 'sender message' : 'receiver message'} ref={index === messages.length - 1 ? messagesEndRef : null}>
        <p>{data.message}</p>
      </li>
    ));
  }



  return(
    <div className='chat'>
      <ol className="messages" ref={messagesListRef}>
        {messagesElement}
      </ol>
      <div className="chatInput">
        <input type="text" value={messagesInput} onChange={(e) => setMessagesInput(e.target.value)} />
        <button onClick={sendChat}>Send</button> 
      </div>   
    </div>
    )
}

export default Chat;