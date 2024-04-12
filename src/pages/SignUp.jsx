import React, { useState } from 'react';
import axios from 'axios';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    uid: '',
    gender: '',
    email: '',
    phoneNum: '',
    hostel_name:'',
    password:'',
    avatar: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, avatar: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('uid', formData.uid);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('phoneNum', formData.phoneNum);
      formDataToSend.append('hostel_name', formData.hostel_name);
      formDataToSend.append('avatar', formData.avatar); // Append avatar file

      const response = await axios.post('http://localhost:8000/api/v1/users/register', formDataToSend);

      console.log(formData);
      console.log(response);
      if (response.status !== 200) {
        throw new Error('Failed to sign up');
      }

      // Handle successful signup, e.g., show success message or redirect
      
      localStorage.setItem('User', response.data.data._id); // Store access token in localStorage

      window.location.href = '/verify-otp';
       
      console.log('Signup successful');

       //window.location.href = '/login'
    } catch (error) {
      console.error('Error signing up:', error.message);
      // Handle signup error, e.g., display error message to the user
    }
  };
  

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl mb-4">Signup</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">UID:</label>
                    <input
                        type="text"
                        name="uid"
                        value={formData.uid}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Gender:</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        <option value="">Select Gender</option>
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                        <option value="OTHER">OTHER</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Email-Official:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Password-Len(8):</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Phone Number:</label>
                    <input
                        type="tel"
                        name="phoneNum"
                        value={formData.phoneNum}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Hostel:</label>
                    <select
                        name="hostel_name"
                        value={formData.hostel_name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        <option value="">Select Hostel</option>
                        <option value="NekChand/Zakir">NekChand/Zakir</option>
                        <option value="SUKHNA">SUKHNA</option>
                        <option value="TAGORE">TAGORE</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Profile Picture:</label>
                    <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}  
export default SignUp;
