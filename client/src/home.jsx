import React, { useEffect, useState } from 'react'
import './auth.css'
import AddFriendSearch from './app/addFriendSearch';
import FriendList from './app/friendList';
function home() {

  return (
    <>
      <AddFriendSearch/>
      <FriendList/>
    </>
  )

}

export default home