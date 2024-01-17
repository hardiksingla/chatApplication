import { useState , useEffect } from 'react'
import Name from "./name.jsx"
import "./styles/friendList.css"

function FriendList({ getActiveMessage,activeMessage }) {
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    async function getFriends() {
      // const response = await fetch("http://localhost:3000/api/friendList", {
      const response = await fetch("https://chatapp-4xir.onrender.com/api/friendList", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "currentUserID": localStorage.getItem("token") })
    });

    var res = await response.json();
    setFriendList(res.friends);
    // console.log(res);
    }
    getFriends();
    
  }, []);

  const friendListElement = friendList.map(data => (
    <div key={data.username} onClick={() => getActiveMessage(data)} 
      className={data.id == activeMessage.id ? 'activeChat chatName' : 'chatName'} >
      <p>{data.name}</p>
    </div>
  ));


  return (
    <>
      <div className='friend-list'>
        {friendListElement}
      </div>
    </>
  );
}

export default FriendList;