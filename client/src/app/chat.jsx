import React, { useState } from 'react'
import './styles/chat.css'
import { io } from "socket.io-client";

function Chat({activeMessage , getMessages, messages, isLoading }){
  const [messagesInput, setMessagesInput] = useState("")

  useState(() => {    
    var socket = io("http://localhost:3000");
  }, []);
  


  async function sendChat(){
    if(messagesInput != ""){
    const data = {user:localStorage.getItem("token"),
      to:activeMessage.id,  
      message:messagesInput
      }
      console.log(data)

      const response = await fetch("http://localhost:3000/api/sendMessage", 
      {method: "POST", 
      headers: {"Content-Type": "application/json"}, 
      body: JSON.stringify(data)})
      var res = await response.json();
      console.log(res)
      getMessages();
      setMessagesInput("")
    }
  }
  var messagesElement = <div></div>;
  if(messages){  
    messagesElement = messages.map(data => (
      <li key={data.id } className={data.sender ? "sender message" : "receiver message"} >
        <p>{data.message}</p>
      </li>
    ));
  }




  return(
    <div className='chat'>
      <ol className="messages">
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