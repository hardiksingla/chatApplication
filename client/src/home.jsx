import React, { useEffect, useState } from 'react'
import './auth.css'
import AddFriendSearch from './app/addFriendSearch';
import FriendList from './app/friendList';
import ChatPage from './app/chatPage';
import './app/styles/home.css'

function home() {

  return (
    <div className='home'>
      <AddFriendSearch/>
      <ChatPage/>
    </div>
  )

}

export default home