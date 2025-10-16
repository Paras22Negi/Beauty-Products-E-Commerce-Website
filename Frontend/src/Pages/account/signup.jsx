import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendOtp,
  verifyOtp,
  setEmail,
} from "../../redux/authentication/action";
import {Link, useNavigate } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { signup } from "../../redux/account/action";

function Signup() {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false)
  const [FormData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  }
  )
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

  const handleSignup = ()=>{
    try {
      dispatch(signup(FormData));
    } catch (error) {
      console.error(error);
      alert("Signup failed");
    } finally {
      Navigate("/login");
    }
  }

  const handleChange = (e) => {
    if (e.target.name === "email") {
      dispatch(setEmail(e.target.value));
    }
    setFormData({
      ...FormData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex items-center justify-center h-[40rem] bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-gray-800 text-3xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <form className="flex flex-col space-y-4" onSubmit={handleSignup}>
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="text-gray-700 font-medium block mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              name="username"
              value={FormData.username}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Email + Send OTP */}
          <div>
            <label
              htmlFor="email"
              className="text-gray-700 font-medium block mb-1"
            >
              Email
            </label>
            <div className="flex space-x-2">
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={FormData.email}
                name="email"
                onChange={handleChange}
                className="flex-1 p-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className={`px-4 rounded-lg font-medium transition ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </div>

          {/* OTP Section */}
          {showOtp && (
            <div>
              <label
                htmlFor="otp"
                className="text-gray-700 font-medium block mb-1"
              >
                Enter OTP
              </label>
              <div className="flex space-x-2">
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 p-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className={`px-4 rounded-lg font-medium transition ${
                    loading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="text-gray-700 font-medium block mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                value={FormData.password}
                name="password"
                onChange={handleChange}
                className="w-full p-2 pr-10 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={!isVerified}
            className={`font-semibold py-2 rounded-lg transition ${
              isVerified
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            Sign Up
          </button>

          {/* Login Link */}
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
