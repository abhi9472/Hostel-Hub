import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios library
import { useNavigate } from 'react-router-dom';


function Login() {
    const navigate = useNavigate();
    localStorage.removeItem('User');
    localStorage.removeItem('productId');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Add isLoggedIn state

    const checkAuthentication = () => {
        const userId = localStorage.getItem('user');
        if (userId) {
            setIsLoggedIn(true); // Update isLoggedIn state if user is logged in
        }
    };

    useEffect(() => {
        checkAuthentication();
    }, []); 

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            
            const response = await axios.post('http://localhost:8000/api/v1/users/login', {
                username_email: username,
                password: password
            },{
                withCredentials: true
            });


    
            console.log(response);
    
            if(!response.data.data.isVerified){
                localStorage.setItem('User', response.data.data._id); // Store user data in localStorage
                window.location.href='/verify-otp';
            } else if (response.status === 200) {
                localStorage.removeItem('User');
                localStorage.setItem('user', JSON.stringify(response.data.data)); // Store user data in localStorage
                window.location.href = '/';
                setIsLoggedIn(true); // Update isLoggedIn state after successful login
            } else {
                throw new Error('Failed to login ');
            }
        } catch (error) {
            // console.log()
            
            console.error('Login error:', error);
            setError("Invalid Credentials || Sign Up if you dont have account"); // Set error message state
        }
    };
    

    
    const handleForgotPassword = () => {
        navigate('/forgot-password'); // Redirect to forgot password page
    };

    return (
        <div className="flex justify-center items-center min-h-screen" style={{ backgroundImage: `url('/bg.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="w-full max-w-xs bg-white shadow-md p-8 mt-[-120px]">
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
                </form>
            </div>
        </div>
    );
    
}    

    
    export default Login;