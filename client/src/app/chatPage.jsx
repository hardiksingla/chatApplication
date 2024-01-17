import React, { StrictMode, useEffect, useState, version } from 'react'
import FriendList from './friendList'
import AddFriendSearch from './addFriendSearch';
import Chat from './chat'
import './styles/chatPage.css'

function ChatPage() {
  const [activeMessage, setActiveMessage] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  
  function GetActiveMessage(data) {
    // console.log("GetActiveMessage")
    setActiveMessage(data);
    // getMessages();
  }
  useEffect(() => {
    let didCancel = false;
    console.log("useEffect")
    getMessages(didCancel);
    return () => { didCancel = true; }
  }, [activeMessage]);

  

  async function getMessages(didcancel){
    console.log("get message zxdetyfcgvuhbinjo",activeMessage,didcancel)
    // const response = await fetch("http://localhost:3000/api/getMessages", 
    const response = await fetch("https://chatapp-4xir.onrender.com/api/getMessages", 
    {method: "POST", 
    headers: {"Content-Type": "application/json"}, 
    body: JSON.stringify({userJWT:localStorage.getItem("token"),friendID:activeMessage.id})})
    var res = await response.json();
    if(!didcancel){
      console.log(res)
      console.log("setMessageschatpage")
      setMessages(res.messages)
    }else{
      console.log("true")
    }
    setIsLoading(false)
  }

  return (
      <div className="chatArea" >
      <FriendList getActiveMessage={GetActiveMessage} activeMessage={activeMessage} />
      {activeMessage !=0 && <Chat activeMessage={activeMessage} getMessages={getMessages} messages={messages} isLoading={isLoading} />}
      </div>
  );
}

export default ChatPage;