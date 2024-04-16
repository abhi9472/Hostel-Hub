import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Profile() {
    const [userData, setUserData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [newData, setNewData] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [userProducts, setUserProducts] = useState([]);

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
            const response = await axios.get('http://localhost:8000/api/v1/users/getUser', { withCredentials: true });
            if (!response.data) {
                throw new Error(response.data.message);
            }
            console.log(response);
            setUserData(response.data.data);
            fetchUserProducts(response.data.data._id);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchUserProducts = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/product/getUserProducts/`, { withCredentials: true });
            if (!response.data) {
                throw new Error(response.data.message);
            }
            // console.log(response);
            setUserProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching user products:', error);
        }
    };

    const handleUpdateOption = async () => {
        if (!selectedOption) return;

        try {
            let endpoint = '';
            let data = {};

            switch (selectedOption) {
                case 'avatar':
                    const avatarInput = document.getElementById('avatarInput');
                    if (!avatarInput || !avatarInput.files || !avatarInput.files[0]) {
                        console.error('No file selected for avatar.');
                        return;
                    }
                    const avatarFile = avatarInput.files[0];
                    const formDataAvatar = new FormData();
                    formDataAvatar.append('avatar', avatarFile);
                    endpoint = 'http://localhost:8000/api/v1/info/updateAvatar';
                    data = formDataAvatar;
                    break;
                case 'password':
                    if (!newData.oldPassword || !newData.newPassword) return;
                    endpoint = 'http://localhost:8000/api/v1/info/updatePass';
                    data = { oldPassword: newData.oldPassword, newPassword: newData.newPassword };
                    break;
                case 'hostel':
                    if (!newData) return;
                    endpoint = 'http://localhost:8000/api/v1/info/updateHostel';
                    data = { newHostel: newData };
                    break;
                default:
                    break;
            }
            console.log('New Data:', data);

            const response = await axios.patch(endpoint, data, { withCredentials: true });
            // console.log(response.data); // Assuming the response contains some data
            console.log('Updated successfully');

            // Refresh the profile page
            window.location.href = '/profile';
            fetchUserData();
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };
    const renderInput = () => {
        switch (selectedOption) {
            case 'avatar':
                return (
                    <input type="file" id="avatarInput" accept="image/*" style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }} />
                );
            case 'password':
                return (
                    // <div>
                    <div className="flex flex-col">
                        <input type="password" placeholder="Old Password" value={newData.oldPassword} onChange={(e) => setNewData({ ...newData, oldPassword: e.target.value })} style={{ backgroundColor: 'white', color: 'black', border: '1px solid black', marginBottom: '8px' }} />
                        <input type="password" placeholder="New Password" value={newData.newPassword} onChange={(e) => setNewData({ ...newData, newPassword: e.target.value })} style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }} />
                    </div>
                );
            case 'hostel':
                return (
                    <select value={newData} onChange={(e) => setNewData(e.target.value)} style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}>
                        <option value="">Select Hostel</option>
                        <option value="NekChand/Zakir">NekChand/Zakir</option>
                        <option value="SUKHNA">SUKHNA</option>
                        <option value="TAGORE">TAGORE</option>
                    </select>
                );
            default:
                return null;
        }
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        setShowInput(true);
        // Reset newData state when a new option is selected
        setNewData('');
        setNewData({ oldPassword: '', newPassword: '' });
    };

    const handleSold = async (productId) => {
        try {
            const response = await axios.patch(`http://localhost:8000/api/v1/info/soldOut?id=${productId}`, null, { withCredentials: true });
            console.log(response.data); // Assuming the response contains some data
            console.log('Product marked as sold successfully');
            // Refresh the profile page
            fetchUserProducts(userData._id);
        } catch (error) {
            console.error('Error marking product as sold:', error);
        }
    };

    const handleRemove = async (productId) => {
        try {
            const response = await axios.patch(`http://localhost:8000/api/v1/info/removeProduct?id=${productId}`, null, { withCredentials: true });
            console.log(response.data); // Assuming the response contains some data

            console.log('Product deleted successfully');

            // Refresh the profile page
            fetchUserProducts(userData._id);

        } catch (error) {
            console.error('Error deleting product:', error);
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
            <div className="flex items-center bg-white shadow-lg rounded-lg p-6 relative border border-black">
                <div className="w-32 h-32 rounded-full overflow-hidden mr-6">
                    <img className="w-full h-full" src={userData.avatar} alt="Avatar" />
                </div>
                <div>
                    <p className="text-2xl font-bold">{userData.name}</p>
                    <p className="text-gray-600">{userData.email}</p>
                    <p className="text-gray-600">Username: {userData.username}</p>
                    <p className="text-gray-600">Phone: {userData.phoneNum}</p>
                    <p className="text-gray-600">Hostel: {userData.hostel_name}</p>
                </div>
            </div>

            <div className="flex flex-col bg-white shadow-lg rounded-lg p-6 relative border border-black mt-6">
                <label htmlFor="updateOption" className="mr-2 mb-2">Update:</label>
                <select id="updateOption" className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-32" onChange={(e) => handleOptionChange(e.target.value)}>
                    <option value="">Select Option</option>
                    <option value="avatar">Avatar</option>
                    <option value="password">Password</option>
                    <option value="hostel">Hostel</option>
                </select>
                {showInput && (
                    <div className="flex flex-col mb-2">
                        {renderInput()}
                        <button className="mt-2 bg-blue-500 text-white px-2 py-1 rounded-md  mb-2 w-32" onClick={handleUpdateOption}>Update</button>
                    </div>
                )}
            </div>


            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-semibold mb-6">My Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {userProducts.map((product) => (
                        <div key={product._id} className="relative bg-white rounded-lg shadow-md overflow-hidden">
                            <Link to={`/product/${product._id}`} className="block">
                                <img src={product.coverImg} alt="Cover" className="w-full h-48 object-cover object-center cursor-pointer" />
                                {/* <h3 className="text-lg font-semibold">{product.name}</h3> */}
                            </Link>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                                <p className="text-gray-600 mb-4">{product.description}</p>
                                <p className="text-lg font-semibold text-blue-500">
                                    Price: ₹ {product.price}
                                </p>
                                <div className="flex justify-between items-center mt-4">
                                    <button onClick={() => handleSold(product._id)} style={{ padding: '4px', border: 'none', background: 'none' }}>
                                        <img src="/sold.png" alt="Sold Icon" style={{ width: '24px', height: '24px' }} />
                                    </button> 
                                    <button onClick={() => handleRemove(product._id)} style={{ padding: '4px', border: 'none', background: 'none' }}>
                                        <img src="/remove.png" alt="Remove Icon" style={{ width: '24px', height: '24px' }} />
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Profile;