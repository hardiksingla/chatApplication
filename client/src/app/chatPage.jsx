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
    console.log("useEffect")
    getMessages();
  }, [activeMessage]);

  async function getMessages(){
    const response = await fetch("https://chatapp-4xir.onrender.com/api/getMessages", 
    {method: "POST", 
    headers: {"Content-Type": "application/json"}, 
    body: JSON.stringify({userJWT:localStorage.getItem("token"),friendID:activeMessage.id})})
    var res = await response.json();
    console.log(res)
    setMessages(res.messages)
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