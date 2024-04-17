// React component VerifyOTP.jsx

import React, { useState } from 'react';
import axios from 'axios';
//import { verifyForgetOTP } from '../../../hostelhub-Backend/src/controllers/user.controllers';

function VerifyForgotOtp() {
    const [otp, setOTP] = useState('');
    const [error, setError] = useState('');

    const handleOTPChange = (e) => {
        // Ensure that only numbers are entered for OTP
        const inputOTP = e.target.value.replace(/\D/, '');
        setOTP(inputOTP);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            // Fetch user from localStorage
            const user = localStorage.getItem('User');
            if (!user) {
                throw new Error('User not found in localStorage');
            }

            // Send OTP verification request
            const response = await axios.post('https://hostelhub-backend.onrender.com/api/v1/users/verifyForgetOTP', {
                id: user,
                OTP: otp
            });
            //let f = 0;
            console.log(response); // Log the response data for debugging
            //console.error('Error verifying OTP:', error.response); // Log full error response


            console.log('OTP verified successfully');
            //   f = 1;
            //   if(f==1){
            //localStorage.removeItem('user');
            //   }

            // Redirect to home page upon successful verification
            // localStorage.removeItem('user');
            window.location.href = '/change-password'; // Redirect to the home page

            //window.location.href = '/'; // Redirect to the home page
        } catch (error) {
            console.error('Error verifying OTP:', error.message);
            console.error('Error verifying OTP:', error.response); // Log full error response

            setError('OTP verification failed'); // Set error message
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl mb-4">Enter OTP</h2>
            <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium text-gray-700">OTP:</label>
                    <input
                        type="number"
                        value={otp}
                        onChange={handleOTPChange}
                        required
                        className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                    Verify OTP
                </button>
            </form>
        </div>
    );
}

export default VerifyForgotOtp;
