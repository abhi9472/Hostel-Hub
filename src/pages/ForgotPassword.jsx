import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        

        try {
            const response = await axios.post('https://hostelhub-backend.onrender.com/api/v1/users/forgetPassword', {
                email: email
            });

            console.log(response);
            localStorage.setItem('User', response.data.data._id); // Store access token in localStorage


            if (response.status === 200) {
                window.location.href='/verify-forgot-otp';
                setSuccessMessage('Password reset link sent to your email.');
            } else {
                setError('Failed to send password reset link. Please try again later.');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            setError('Failed to send password reset link. Please try again later.');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-200">
            <div className="w-full max-w-xs border border-black rounded bg-white shadow-md p-8">
                <form onSubmit={handleResetPassword}>
                    <h2 className="text-2xl text-center mb-6">Forgot Password</h2>
                    {error && <p className="text-red-500 text-xs italic mb-2">{error}</p>}
                    {successMessage && <p className="text-green-500 text-xs italic mb-2">{successMessage}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Reset Password
                        </button>
                        <button
                            className="text-gray-600 font-bold text-sm focus:outline-none"
                            type="button"
                            onClick={() => navigate('/login')}
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
