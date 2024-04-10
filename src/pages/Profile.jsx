import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './Profile.css'; // Import CSS file for styling

function Profile() {
    const [userData, setUserData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('user');
        if (userId) {
            setIsLoggedIn(true);
            fetchUserData();
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('https://cu-hostelhub-api.vercel.app/api/v1/users/getUser', { withCredentials: true });
            // const product_response = await axios.get('https://cu-hostelhub-api.vercel.app/api/v1/product/getUserProducts', { withCredentials: true });
            console.log(product_response.data.data);
            if (!response.data) {
                throw new Error(response.data.message);
            }
            // console.log(response);
            setUserData(response.data.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    if (!isLoggedIn) {
        return <div>User is not logged in.</div>;
    }

    if (!userData) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold mb-6">User Profile</h2>
            <div className="flex items-center bg-white shadow-lg rounded-lg p-6">
                <div className="w-32 h-32 rounded-full overflow-hidden mr-6">
                    <img className="w-full h-full object-cover" src={userData.avatar} alt="Avatar" />
                </div>
                <div>
                    <p className="text-2xl font-bold">{userData.name}</p>
                    <p className="text-gray-600">{userData.email}</p>
                    <p className="text-gray-600">Username: {userData.username}</p>
                    <p className="text-gray-600">Phone: {userData.phoneNum}</p>
                    <p className="text-gray-600">Hostel: {userData.hostel_name}</p>
                </div>
            </div>
        </div>
    );
}

export default Profile;
