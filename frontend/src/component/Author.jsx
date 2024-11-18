import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const Author = () => {
    const {currentUser,error,loading}= useSelector((state)=>state.user)
    useEffect(()=>{
        console.log(currentUser)
    },[currentUser])
  return (
    <div>
      <h1>{currentUser.followedUsers}</h1>
    </div>
  )
}

export default Author
