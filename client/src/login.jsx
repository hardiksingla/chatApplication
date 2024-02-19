import { useState } from 'react'
import './auth.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from './config.js'


function Login() {
  const [login, setLogin] = useState({  username: '', password: ''})
    
  async function handleSubmit(e){
    e.preventDefault()
    const response = await fetch(`${SERVER_URL}/api/auth/login`, 
    {method: "POST", 
    headers: {"Content-Type": "application/json"}, 
    body: JSON.stringify(login)})
    const data = await response.json() 
    console.log(data)

    if (data.status === "ok") {
      localStorage.setItem("token", data.user);
      window.location.href = "/home";
    } else {
      toast.error(data.error)
    }

  }

  return (
    <>
      <ToastContainer />
      <div className="container" >
          <h2 className="title">Login</h2>
        <form>
          <div className="input">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" value={login.username} onChange={e => setLogin({ ...login, username: e.target.value })} />
          </div>
          <div className="input">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} />
          </div>
          <button onClick={handleSubmit} >Login</button>
        </form>
      </div>
    </>
  )
}

export default Login