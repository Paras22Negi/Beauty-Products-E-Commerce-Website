// src/pages/Account.jsx
import React from "react";

function Account() {
  const token = localStorage.getItem("token");
  const decodeToken = (token) => {
    try {
      const base = JSON.parse(atob(token.split(".")[1]));
      const username = base.username;
      const email = base.email;
      return `Username: ${username}, Email: ${email}`;
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Account</h1>
        <p>Welcome! Your decoded token is: {decodeToken(token)}</p>
        <button className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Account;
