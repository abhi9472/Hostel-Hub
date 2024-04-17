import React, { useState } from "react";
import axios from "axios";

function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    try {
      // Validate password and confirm password
      if (password !== confirmPassword) {
        setError("Passwords do not match. Please try again.");
        return;
      }

      const user = localStorage.getItem("User");

      // Send request to backend to reset password
      const response = await axios.post(
        "https://hostelhub-backend.onrender.com/api/v1/users/newPassword",
        {
          userID: user, // Fetch email from localStorage where it was stored during the forgot password process
          password: password,
        },
      );

      if (response.status === 200) {
        // If password reset is successful, redirect to login page
        localStorage.removeItem("user");
        window.location.href = "/login"; // Redirect to login page
      } else {
        // If password reset fails, display error message
        setError("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-6 text-3xl font-semibold">Reset Password</h2>
      <div>
        <label className="mb-2 block">New Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input mb-4 w-full border"
        />
        <label className="mb-2 block">Confirm New Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="form-input mb-4 w-full border"
        />
        <button
          onClick={handleResetPassword}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
        >
          Reset Password
        </button>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default ChangePassword;
