import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://hostelhub-backend.onrender.com/api/v1/users/forgetPassword",
        {
          email: email,
        },
      );

      // console.log(response);
      localStorage.setItem("User", response.data.data._id); // Store access token in localStorage

      if (response.status === 200) {
        window.location.href = "/verify-forgot-otp";
        setSuccessMessage("Password reset link sent to your email.");
      } else {
        setError("Failed to send password reset link. Please try again later.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Failed to send password reset link. Please try again later.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-200">
      <div className="w-full max-w-xs rounded border bg-ofwhite p-8 shadow-md">
        <form onSubmit={handleResetPassword}>
          <h2 className="mb-6 text-center text-2xl">Forgot Password</h2>
          {error && <p className="mb-2 text-xs italic text-red-500">{error}</p>}
          {successMessage && (
            <p className="mb-2 text-xs italic text-green-500">
              {successMessage}
            </p>
          )}
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex items-center justify-between">
            <button
              className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="submit"
            >
              Reset Password
            </button>
            <button
              className="text-sm font-bold text-gray-600 focus:outline-none"
              type="button"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
