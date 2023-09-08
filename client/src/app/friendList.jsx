import { useState , useEffect } from 'react'
import Name from "./name.jsx"

function FriendList() {
  const [friendList, setFriendList] = useState([{name:"hello",username:"hello1",email:"hello2"}])
  useEffect( async () => {
    const response = await fetch("http://localhost:3000/api/friendList",
    {method: "GET",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"currentUserID":localStorage.getItem("token")})})

    var res = await response.json()
    console.log(res)
  }, []);
  const friendListElement = friendList.map(data=>{
          
    return <>
      <p>{data.name}</p>
    </>
  })

  return (
    <>
      <div >
        {friendListElement}
      </div>  
    </>
  )
}

export default FriendList