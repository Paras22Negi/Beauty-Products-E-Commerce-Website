// src/pages/Account.jsx
import React from "react";

function Account() {
  const token = localStorage.getItem("token");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Account</h1>
        <p>Welcome! Your token is: {token}</p>
      </div>
    </div>
  );
}

export default Account;
