import React from 'react'
import { useNavigate } from 'react-router-dom';

function account() {
  const Navigate = useNavigate();
  return (
    <div>
      <div>
        <button onClick={()=>Navigate("/login")}>Login</button>
      </div>
      <div>
        <button onClick={()=>Navigate("/signup")}>Signup</button>
      </div>
    </div>
  )
}

export default account
