// React component VerifyOTP.jsx

import React, { useState } from "react";
import axios from "axios";
//import { verifyForgetOTP } from '../../../hostelhub-Backend/src/controllers/user.controllers';

function VerifyForgotOtp() {
  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");

  const handleOTPChange = (e) => {
    // Ensure that only numbers are entered for OTP
    const inputOTP = e.target.value.replace(/\D/, "");
    setOTP(inputOTP);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      // Fetch user from localStorage
      const user = localStorage.getItem("User");
      if (!user) {
        throw new Error("User not found in localStorage");
      }

      // Send OTP verification request
      const response = await axios.post(
        "https://hostelhub-backend.onrender.com/api/v1/users/verifyForgetOTP",
        {
          id: user,
          OTP: otp,
        },
      );
      //let f = 0;
      console.log(response); // Log the response data for debugging
      //console.error('Error verifying OTP:', error.response); // Log full error response

      console.log("OTP verified successfully");
      //   f = 1;
      //   if(f==1){
      //localStorage.removeItem('user');
      //   }

      // Redirect to home page upon successful verification
      // localStorage.removeItem('user');
      window.location.href = "/change-password"; // Redirect to the home page

      //window.location.href = '/'; // Redirect to the home page
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      console.error("Error verifying OTP:", error.response); // Log full error response

      setError("OTP verification failed"); // Set error message
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-md rounded bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl">Enter OTP</h2>
      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div>
          <label className="mb-1 block font-medium text-gray-700">OTP:</label>
          <input
            type="number"
            value={otp}
            onChange={handleOTPChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
}

export default VerifyForgotOtp;
