import React from 'react'
import { useNavigate } from 'react-router-dom'

function Header() {
    const navigate = useNavigate();
  return (
    <div className="flex bg-black text-white p-4 items-center">
      <div className="flex justify-start space-x-3">
        <div onClick={()=>navigate("/")}>HomeLogo</div>
        <div>Category</div>
      </div>
      <div className="flex w-full px- justify-end ">
        <div className="flex flex-row">
          <ul className="flex flex-row space-x-3">
            <li onClick={()=>navigate("/storeLocator")}>StoreLocator</li>
            <li onClick={()=>navigate("/aboutUs")}>AboutUs</li>
            <li onClick={()=>navigate("/blog")}>Blog</li>
            <li onClick={()=>navigate("/support")}>Support</li>
          </ul>
        </div>
        <div className="flex flex-row px-5">
          <ul className="flex flex-row space-x-3">
            <li>Search</li>
            <li onClick={()=>navigate("/account")}>Account</li>
            <li>Cart</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header
