import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEmail } from "../../redux/authentication/action";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.auth);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace with your backend login request
      console.log("Logging in with:", email, password);
      alert("Login successful (mock)");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    } finally {
      setLoading(false);
      Navigate("/account");
    }
  };

  return (
    <div className="flex items-center justify-center h-[40rem] bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-100">
        <h2 className="text-gray-800 text-2xl font-bold mb-6 text-center">
          Login
        </h2>
        <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
          {/* Email */}
          <label htmlFor="email" className="text-gray-700 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
            className="p-2 rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            required
          />

          {/* Password */}
          <label htmlFor="password" className="text-gray-700 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`font-semibold py-2 rounded transition ${
              loading
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Switch to Signup */}
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
