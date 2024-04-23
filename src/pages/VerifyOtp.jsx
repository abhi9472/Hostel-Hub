import React, { useState, useEffect } from "react";
import axios from "axios";

function VerifyOTP() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      setIsResendDisabled(true); // Disable Resend OTP button during countdown
    } else {
      setIsResendDisabled(false); // Enable Resend OTP button after countdown finishes
    }

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [timer]);

  const handleOTPChange = (e) => {
    const inputOTP = e.target.value.replace(/\D/, "");
    setOTP(inputOTP);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      const user = localStorage.getItem("User");
      if (!user) {
        throw new Error("User not found in localStorage");
      }

      const response = await axios.post(
        "https://hostelhub-backend.onrender.com/api/v1/users/verifyOTP",
        {
          id: user,
          OTP: otp,
        },
      );

      console.log(response.data);
      console.log("OTP verified successfully");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      console.error("Error verifying OTP:", error.response);

      setError("OTP verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsSubmitting(true); // Set submitting state to true while sending request

      const user = localStorage.getItem("User");
      if (!user) {
        throw new Error("User not found in localStorage");
      }

      // Send request to resend OTP
      const response = await axios.post(
        `https://hostelhub-backend.onrender.com/api/v1/users/requestOTP?id=${user}`,
      );

      // Handle the response as needed
      // console.log(response.data);
      alert("OTP has been resent successfully!"); // For demonstration

      // Disable Resend OTP button and start timer countdown
      setIsResendDisabled(true);
      setTimer(30);
    } catch (error) {
      console.error("Error resending OTP:", error.message);
      // Handle error if resend OTP request fails
      alert("Failed to resend OTP. Please try again."); // For demonstration
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="mx-auto mt-40 max-w-md rounded bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-2xl">Enter OTP- Check Official Email</h2>
      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div>
          <label className="mb-1 block font-medium text-black-700">OTP:</label>
          <input
            type="number"
            value={otp}
            onChange={handleOTPChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring focus:ring-orange-500"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Loading.." : "Verify OTP"}
        </button>
      </form>
      <div className="mt-4">
        <button
          onClick={handleResendOTP}
          className="w-full rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 focus:bg-gray-400 focus:outline-none"
          disabled={isResendDisabled}
        >
          Resend OTP {isResendDisabled && `(${timer}s)`}
        </button>
      </div>
      <h2 className="bg mb-2 text-xl text-red-600">
        Check Spam-* If Spam Mark as not spam
      </h2>
    </div>
  );
}

export default VerifyOTP;
