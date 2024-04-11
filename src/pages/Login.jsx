import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios library
import { useNavigate } from 'react-router-dom';


function Login() {
    const navigate = useNavigate();

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
    let temp;

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

            if(response.data.data.isVerified === false){
                window.location.href='/verify-otp';
            }
            
            else if (response.status !== 200) {
                throw new Error('Failed to login ');
                //throw new Error();
            }
            const responseData = response.data.data;
            console.log(
                response.data
            );
            console.log(responseData); // Fetch response data
            temp=response.data.data._id;
            console.log(temp);
            localStorage.setItem('user', JSON.stringify(responseData)); // Store user data in localStorage
            setIsLoggedIn(true); // Update isLoggedIn state after successful login

            window.location.href = '/'; // Navigate to home page after successful login
        } catch (error) {
            localStorage.setItem('user',temp);
            // window.location.href='/verify-otp';
            console.error('Login error:', error);
            setError('Failed to login. Please try again || Signup If You Dont Have Account'); // Set error message state
        }
    };

    const handleLogout = async () => {
        try {
            // Clear user data from localStorage
            localStorage.removeItem('user');

            // Make a POST request to the logout endpoint
            const res = await fetch('https://cu-hostelhub-api.vercel.app/api/v1/users/logout', {
                method: 'POST',
                credentials: 'include' // Include credentials (cookies) in the request
            });
           // with credentials:true
            // Check if the response is ok
            if (res.ok) {
                console.log('Logout successful');
                // If the request is successful, redirect to home page
                navigate('/'); // Navigate to home page after logout
            } else {
                // Handle non-successful responses
                const data = await res.json();
                console.error('Logout failed:', data.message);
                // Display an error message to the user or perform any other necessary actions
            }
        } catch (error) {
            console.error('Logout failed:', error.message);
            // Handle any errors or display a message to the user
        } 
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-xs">
                <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-2xl text-center mb-6">Login</h2>
                    {error && <p className="text-red-500 text-xs italic mb-2">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
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
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
