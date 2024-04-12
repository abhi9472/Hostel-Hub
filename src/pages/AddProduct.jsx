import React, { useState, useEffect } from "react";
import axios from "axios";

function AddProduct() {
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [coverImg, setCoverImg] = useState(null);
    const [productImgs, setProductImgs] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to true, assuming user is logged in

    useEffect(() => {
        // Check if user is logged in
        const userId = localStorage.getItem("user");
        if (!userId) {
            setIsLoggedIn(false);
        }
    }, []);

    const handleApi = async () => {
        try {
            const formData = new FormData();
            formData.append("productName", productName);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("coverImg", coverImg);
            productImgs.forEach((image) => {
                formData.append("productImg", image);
            });

            const url = "http://localhost:8000/api/v1/product/addProducts"; // Replace with your endpoint URL
            const response = await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            });

            console.log(response.data); // Handle response as needed

            alert(response.data.message); // Display success message

            // Clear form fields after successful submission
            setProductName("");
            setDescription("");
            setPrice("");
            setCoverImg(null);
            setProductImgs([]);
            window.location.href = '/';


        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product. Please try again.");
        }
    };

    const handleCoverImageChange = (e) => {
        setCoverImg(e.target.files[0]);
    };

    const handleProductImageChange = (e) => {
        const files = e.target.files;
        const newProductImgs = Array.from(files);
        setProductImgs(newProductImgs);
    };

    if (!isLoggedIn) {
        // Redirect user to login page if not logged in
        window.location.href = '/login';
    }
    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-semibold mb-6 text-center">ADD PRODUCT</h2>
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6">
                <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-bold">Product Name</label>
                    <input
                        className="form-input border border-black w-full py-2 px-3 rounded focus:outline-none focus:border-blue-500"
                        type="text"
                        placeholder="Enter product name"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-bold">Product Description</label>
                    <textarea
                        className="form-textarea border border-black w-full py-2 px-3 rounded focus:outline-none focus:border-blue-500"
                        rows="4"
                        placeholder="Enter product description"
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-bold">Product Price</label>
                    <input
                        className="form-input border border-black w-full py-2 px-3 rounded focus:outline-none focus:border-blue-500"
                        type="number"
                        placeholder="Enter product price"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-bold">Product Cover Image</label>
                    <input
                        className="form-input border border-black w-full py-2 px-3 rounded focus:outline-none focus:border-blue-500"
                        type="file"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-bold">Product Images</label>
                    <input
                        className="form-input border border-black w-full py-2 px-3 rounded focus:outline-none focus:border-blue-500"
                        type="file"
                        multiple
                    />
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    SUBMIT
                </button>
            </div>
        </div>
    );
}

export default AddProduct;