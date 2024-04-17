import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  localStorage.removeItem("User");
  localStorage.removeItem("productId");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuthentication = () => {
    const userId = localStorage.getItem("user");
    if (userId) {
      setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://hostelhub-backend.onrender.com/api/v1/users/login",
        {
          username_email: username,
          password: password,
        },
        {
          withCredentials: true,
        },
      );

      if (!response.data.data.isVerified) {
        localStorage.setItem("User", response.data.data._id);
        window.location.href = "/verify-otp";
      } else if (response.status === 200) {
        localStorage.removeItem("User");
        localStorage.setItem("user", JSON.stringify(response.data.data));
        window.location.href = "/";
        setIsLoggedIn(true);
      } else {
        throw new Error("Failed to login");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid Credentials || Sign Up if you don't have an account");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSignUp = () => {
    navigate("/signup"); // Navigate to signup page
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        backgroundImage: `url('https://img.freepik.com/free-photo/desk-concept-cyber-monday_23-2148292116.jpg?w=1800&t=st=1713384818~exp=1713385418~hmac=9f979eb376c7ac696c59609dae229106a0e25cea9cff6ffc18f4f99323299ab8')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-offwhite mt-[-120px] w-full max-w-xs p-8 shadow-md">
        <form onSubmit={handleLogin}>
          <h2 className="mb-6 text-center text-2xl">Login</h2>
          {error && <p className="mb-2 text-xs italic text-red-500">{error}</p>}
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="username"
            >
              Username || Email
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={5}
            />
          </div>
          <div className="mb-6">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="focus:shadow-outline mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="submit"
            >
              Login
            </button>
            <button
              className="text-sm font-bold text-gray-600 focus:outline-none"
              type="button"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>
          {!isLoggedIn && ( // Render signup link if not logged in
            <p className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <span
                className="cursor-pointer text-blue-500"
                onClick={handleSignUp}
              >
                Sign Up
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
