import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendOtp,
  verifyOtp,
  setEmail,
} from "../../redux/authentication/action";

function Signup() {
  const dispatch = useDispatch();
  const { email, showOtp, isVerified, loading } = useSelector(
    (state) => state.auth
  );
  const [otp, setOtp] = useState("");

  const handleSendOtp = () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    dispatch(sendOtp(email));
  };

  const handleVerifyOtp = () => {
    dispatch(verifyOtp(email, otp));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
        <h2 className="text-gray-800 text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <form className="flex flex-col space-y-4">
          {/* Username */}
          <label htmlFor="username" className="text-gray-700 font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            className="p-2 rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          />

          {/* Email + Send OTP */}
          <label htmlFor="email" className="text-gray-700 font-medium">
            Email
          </label>
          <div className="flex space-x-2">
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => dispatch(setEmail(e.target.value))}
              className="flex-1 p-2 rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className={`${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white px-3 rounded transition`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>

          {/* OTP Section */}
          {showOtp && (
            <>
              <label htmlFor="otp" className="text-gray-700 font-medium">
                Enter OTP
              </label>
              <div className="flex space-x-2">
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 p-2 rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className={`${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white px-3 rounded transition`}
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </>
          )}

          {/* Password */}
          <label htmlFor="password" className="text-gray-700 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="p-2 rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          />

          {/* Sign Up */}
          <button
            type="submit"
            disabled={!isVerified}
            className={`font-semibold py-2 rounded transition ${
              isVerified
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
