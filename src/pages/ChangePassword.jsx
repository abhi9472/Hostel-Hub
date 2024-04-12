import React, { useState } from 'react';
import axios from 'axios';

function ChangePassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async () => {
        try {
            // Validate password and confirm password
            if (password !== confirmPassword) {
                setError('Passwords do not match. Please try again.');
                return;
            }

            const user = localStorage.getItem('user');

            // Send request to backend to reset password
            const response = await axios.post('http://localhost:8000/api/v1/users/newPassword', {
                userID: user, // Fetch email from localStorage where it was stored during the forgot password process
                password: password
            });
            

            if (response.status === 200) {
                // If password reset is successful, redirect to login page
                localStorage.removeItem('user');
                window.location.href = '/login'; // Redirect to login page
            } else {
                // If password reset fails, display error message
                setError('Failed to reset password. Please try again.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setError('Failed to reset password. Please try again.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold mb-6">Reset Password</h2>
            <div>
                <label className="block mb-2">New Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input border w-full mb-4"
                />
                <label className="block mb-2">Confirm New Password:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input border w-full mb-4"
                />
                <button onClick={handleResetPassword} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Reset Password
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </div>
    );
}

export default ChangePassword;
