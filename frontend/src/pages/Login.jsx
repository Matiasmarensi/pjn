import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="max-w-sm w-full bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-sm text-gray-200 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 text-sm text-gray-200 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <div className="flex justify-between items-center">
            <Link to="/forgot-password" className="text-sm text-orange-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            type="submit"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-orange-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
