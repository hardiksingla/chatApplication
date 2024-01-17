import { useState,useEffect } from 'react'
import "./styles/addFriendSearch.css"
import Name from "./name.jsx"
import { isExpired, decodeToken } from "react-jwt";


function AddFriendSearch(){
  const [search, setSearch] = useState("")
  const [foundPeople, setFoundPeople] = useState([])
  useEffect(() => {
    
  }, []);
  const user = decodeToken(localStorage.getItem("token"));

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  async function handleSubmit(e){
    e.preventDefault()
    const names = document.getElementById("names")
    names.style.display = names.style.display == "flex" ? "none" : "flex"
    const response = await fetch("https://chatapp-4xir.onrender.com/api/search",
    // const response = await fetch("http://localhost:3000/api/search",
    {method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"search":search})})

    var res = await response.json()
    setFoundPeople(res.users)
  }
    const foundPeopleElement = foundPeople.map(data=>{
          
      return <Name
      key={data._id}
      prop={data}  />     //{...data} equal to previous
    })

  return(
    <>
    <nav>
    <div className='logout'>
      <p className="title">{user.username}</p>
      <button onClick={logout} >Logout</button>
    </div>
    <div className='search  '>
      <input type="text" id="search" name="search" value={search} onChange={(e)=>setSearch(e.target.value)} required />
      <button onClick={handleSubmit} type='submit' >Search</button>
    </div>
    </nav>
      <div id="names">
        {foundPeopleElement}
      </div>
    </>
  )
} 

export default AddFriendSearch