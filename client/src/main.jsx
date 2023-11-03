import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './login.jsx'
import Signup from './signup.jsx'
import Home from './home.jsx'
import { BrowserRouter, Route , Routes } from 'react-router-dom';
import './index.css'
import ChatPage from './app/chatPage.jsx'
import Chat from './app/chat.jsx'

<BrowserRouter>
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/home" element={<Home />} />
</Routes>
</BrowserRouter>
ReactDOM.createRoot(document.getElementById('root')).render(
  <> 
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home/>} />
    </Routes>
    </BrowserRouter>
  </>

)
