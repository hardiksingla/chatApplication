import { useState } from 'react'
import './auth.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const [signup, setSignup] = useState({  username: '', password: '', email: '', name: ''})
  async function handleSubmit(e){
    e.preventDefault()
    if(!signup.username || !signup.password || !signup.email || !signup.name){
      toast.error("Please fill all the fields");
      return
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    emailRegex.test(email);
    if (!emailRegex.test(signup.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const response = await fetch("http://localhost:3000/api/auth/signup", 
    {method: "POST", 
    headers: {"Content-Type": "application/json"}, 
    body: JSON.stringify(signup)})
    const data = await response.json()
    if(data.status === "ok"){
      window.location.href = "/login";
  }else{
    toast.error(data.error)
  }
}
  
  return (
    <>
      <ToastContainer />
      <div className="container" >
          <h2 className="title">Signup</h2>
        <form>
          <div className="input">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={signup.name} onChange={e => setSignup({ ...signup, name: e.target.value })} required />
          </div>
          <div className="input">
          <label htmlFor="email">Email</label>
          <input type="Email" id="email" name="email" value={signup.email} onChange={e => setSignup({ ...signup, email: e.target.value })} required/>
          </div>

          <div className="input">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" value={signup.username} onChange={e => setSignup({ ...signup, username: e.target.value })} required />
          </div>
          <div className="input">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={signup.password} onChange={e => setSignup({ ...signup, password: e.target.value })} required />
          </div>
          <button onClick={handleSubmit} type='submit'>Signup</button>
        </form>
      </div>
    </>
  )
}

export default Signup