import React, { StrictMode, useEffect, useState, version } from 'react'
import Split from 'react-split'
import FriendList from './friendList'
import FriendList2 from './test'
import './chatapp.css'

function ChatPage(){
  

  return(
    <>
    <StrictMode>
      <div className='chatapp'>
        <FriendList/>
        <FriendList2/>
      </div>
    </StrictMode>

    </>
  )
}

export default ChatPage