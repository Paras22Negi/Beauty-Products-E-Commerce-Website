import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendOtp,
  verifyOtp,
  setEmail,
} from "../../redux/authentication/action";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { signup } from "../../redux/account/action";

function Signup() {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { email, showOtp, isVerified, loading } = useSelector(
    (state) => state.auth
  );

  const [otp, setOtp] = useState("");
  const [emailLocked, setEmailLocked] = useState(false);
  const [error, setError] = useState(""); // <-- new state for errors
  const [success, setSuccess] = useState(""); // <-- optional success message

  const handleSendOtp = async () => {
    setError("");
    setSuccess("");
    if (!formData.email) {
      setError("Please enter your email first.");
      return;
    }
    try {
      const res = await dispatch(sendOtp(formData.email));
      if (res?.payload?.message === "OTP sent successfully") {
        setSuccess("OTP sent successfully! Check your email.");
        setEmailLocked(true);
      } else if (res?.payload?.message) {
        setError(res.payload.message); // show backend message (e.g., "Email already in use")
      }
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please try again later.");
    }
  };

  const handleVerifyOtp = () => {
    setError("");
    dispatch(verifyOtp(formData.email, otp));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isVerified) {
      setError("Please verify your email first.");
      return;
    }

    try {
      const result = await dispatch(signup(formData));
      if (result?.jwt) {
        setSuccess("Signup successful!");
        setFormData({
          username: "",
          email: "",
          password: "",
        });
        setEmailLocked(false);
        setOtp("");
        Navigate("/login");
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Signup failed. Please try again.";
      setError(errorMessage);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "email") {
      dispatch(setEmail(e.target.value));
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex items-center justify-center h-[40rem] bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-gray-800 text-3xl font-bold mb-6 text-center">
          Create Account
        </h2>

        {/* Error & Success Messages */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded-md mb-3 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-600 p-2 rounded-md mb-3 text-center">
            {success}
          </div>
        )}

        <form className="flex flex-col space-y-4" onSubmit={handleSignup}>
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
                value={formData.email}
                name="email"
                onChange={handleChange}
                disabled={emailLocked}
                className={`flex-1 p-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none ${
                  emailLocked ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              {!emailLocked && (
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
              )}
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

          {/* Username + Password (only after OTP verified) */}
          {isVerified && (
            <>
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
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

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
                    value={formData.password}
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
                className="font-semibold py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Sign Up
              </button>
            </>
          )}

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
