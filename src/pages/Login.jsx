import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    localStorage.removeItem('User');
    localStorage.removeItem('productId');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkAuthentication = () => {
        const userId = localStorage.getItem('user');
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
            const response = await axios.post('https://hostelhub-backend.onrender.com/api/v1/users/login', {
                username_email: username,
                password: password
            },{
                withCredentials: true
            });

            if (!response.data.data.isVerified) {
                localStorage.setItem('User', response.data.data._id);
                window.location.href = '/verify-otp';
            } else if (response.status === 200) {
                localStorage.removeItem('User');
                localStorage.setItem('user', JSON.stringify(response.data.data));
                window.location.href = '/';
                setIsLoggedIn(true);
            } else {
                throw new Error('Failed to login');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError("Invalid Credentials || Sign Up if you don't have an account");
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    const handleSignUp = () => {
        navigate('/signup'); // Navigate to signup page
    };

    return (
        <div className="flex justify-center items-center min-h-screen" style={{ backgroundImage: `url('https://img.freepik.com/free-photo/desk-concept-cyber-monday_23-2148292116.jpg?w=1800&t=st=1713384818~exp=1713385418~hmac=9f979eb376c7ac696c59609dae229106a0e25cea9cff6ffc18f4f99323299ab8')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="w-full max-w-xs bg-offwhite shadow-md p-8 mt-[-120px]">
                <form onSubmit={handleLogin}>
                    <h2 className="text-2xl text-center mb-6">Login</h2>
                    {error && <p className="text-red-500 text-xs italic mb-2">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username || Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength={5}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Login
                        </button>
                        <button
                            className="text-gray-600 font-bold text-sm focus:outline-none"
                            type="button"
                            onClick={handleForgotPassword}
                        >
                            Forgot Password?
                        </button>
                    </div>
                    {!isLoggedIn && ( // Render signup link if not logged in
                        <p className="mt-4 text-center text-sm">
                            Don't have an account? <span className="text-blue-500 cursor-pointer" onClick={handleSignUp}>Sign Up</span>
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Login;
