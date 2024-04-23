import React, { useState } from "react";
import axios from "axios";

function SignUp() {
  // const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // username: "",
    name: "",
    uid: "",
    gender: "",
    // email: "",
    phoneNum: "",
    hostel_name: "",
    password: "",
    avatar: null,
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
      setIsSubmitting(true);
      // setIsLoading(true);
      const formDataToSend = new FormData();
      // formDataToSend.append("username", formData.username);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("uid", formData.uid);
      formDataToSend.append("gender", formData.gender);
      // formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("phoneNum", formData.phoneNum);
      formDataToSend.append("hostel_name", formData.hostel_name);
      formDataToSend.append("avatar", formData.avatar); // Append avatar file

      const response = await axios.post(
        "https://hostelhub-backend.onrender.com/api/v1/users/register",
        formDataToSend,
      );
      // setIsLoading(false);

      // console.log(formData);
      // console.log(response);
      // if (response.status !== 200) {
      //   throw new Error("Failed to sign up");
      // }

      // Handle successful signup, e.g., show success message or redirect

      localStorage.setItem("User", response.data.data._id); // Store access token in localStorage

      window.location.href = "/verify-otp";

      console.log("Signup successful");

      //window.location.href = '/login'
    } catch (error) {
      // alert("UID Already Being Used");

      console.error("Error signing up:", error.response.data);

      if (
        error.response.data.message === "Username / Email Alredy being used"
      ) {
        alert("UID Already Being Used");
      } else {
        alert("Error");
      }

      // Handle signup error, e.g., display error message to the user
    } finally {
      setIsSubmitting(false); // Reset the form submission state
    }
  };

  return (
    <div
      className="mg-15 h-15 mt-6 flex min-h-screen items-center justify-center"
      style={{
        backgroundImage: `url('/ss.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100%", // Set the minimum height to cover the entire viewport
      }}
    >
      <div className="mt-16 flex h-screen flex-col items-center justify-start">
        <div className="mb-4 mt-6 text-center text-2xl font-semibold text-black">
          Sign Up
        </div>
        <div
          className="bg-offwhite w-full max-w-xs p-8 shadow-md"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* <div>
              <label className="mb-1 block font-medium text-gray-700">
                Username:
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={5}
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div> */}
            <div>
              <label className="mb-1 block  font-medium text-black-700">
                Name:
                <span className="text-red-500 ml-1">*</span>

              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={1}
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-black-700">
                UID:
                <span className="text-red-500 ml-1">*</span>

              </label>
              <input
                type="text"
                name="uid"
                value={formData.uid}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-black-700">
                Gender:
                <span className="text-red-500 ml-1">*</span>

              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring focus:ring-orange-500"
              >
                <option value="">Select Gender</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
            {/* <div>
              <label className="mb-1 block font-medium text-gray-700">
                Email-CU_Official:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                pattern="[a-zA-Z0-9._%+-]+@(cuchd\.in|cumail\.in)$"
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div> */}
            <div>
              <label className="mb-1 block font-medium text-black-700">
                Password-Len(8):
                <span className="text-red-500 ml-1">*</span>

              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-black-700">
                Phone Number:
                <span className="text-red-500 ml-1">*</span>

              </label>
              <input
                type="tel"
                name="phoneNum"
                value={formData.phoneNum}
                onChange={handleChange}
                required
                minLength={10}
                maxLength={10}
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-black-700">
                Hostel:
                <span className="text-red-500 ml-1">*</span>

              </label>
              <select
                name="hostel_name"
                value={formData.hostel_name}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring focus:ring-orange-500"
              >
                <option value="">Select Hostel</option>
                <option value="NekChand/Zakir">NekChand/Zakir</option>
                <option value="SUKHNA">SUKHNA</option>
                <option value="TAGORE">TAGORE</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block font-medium text-black-700">
                Profile Picture || Optional:
              </label>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
              // disabled={isLoading}
              disabled={isSubmitting}
            >
              {/* {isLoading ? 'Loading...' : ''} */}
              {isSubmitting ? "Loading..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default SignUp;
