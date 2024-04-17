import React, { useState, useEffect } from "react";
import axios from "axios";

function AddProduct() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [coverImg, setCoverImg] = useState(null);
    const [isAnonymous, setIsAnonymous] = useState(null);
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
            setIsSubmitting(true);
            if (isAnonymous === null) {
                alert("Please select an option for anonymity.");
                setIsSubmitting(false); // Display error message if no selection is made
                return;
            }

            const formData = new FormData();
            formData.append("productName", productName);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("coverImg", coverImg);
            productImgs.forEach((image) => {
                formData.append("productImg", image);
            });
            formData.append("isAnonymous", isAnonymous);

            const url = "https://hostelhub-backend.onrender.com/api/v1/product/addProducts"; // Replace with your endpoint URL
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
            setIsAnonymous(null);
            setIsSubmitting(false);
            window.location.href = '/';


        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product. Please try again.");
        }
        finally {
            setIsSubmitting(false); // Reset the form submission state
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
        <div className="container mx-auto p-3">
            <div className="container mx-auto p-3 flex justify-center items-center">
                <h2 className="text-3xl font-semibold mb-6">ADD PRODUCT</h2>
            </div>
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 border border-white">
                <label className="block mb-2">Product Name</label>
                <input
                    className="form-input border border-black w-full mb-4"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />
                <label className="block mb-2">Product Description</label>
                <textarea
                    className="form-textarea border border-black w-full mb-4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5} // Adjust the number of rows as needed
                />
                <label className="block mb-2">Product Price</label>
                <input
                    className="form-input border border-black w-full mb-4"
                    type="Number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <label className="block mb-2">Product Cover Image</label>
                <input
                    className="form-input border border-black w-full mb-4"
                    type="file"
                    onChange={handleCoverImageChange}
                />
                <label className="block mb-2">Product Images</label>
                <input
                    className="form-input border border-black w-full mb-4"
                    type="file"
                    onChange={handleProductImageChange}
                    multiple
                />
                <label className="block mb-2">Is the product anonymous?</label>

                <div className="flex items-center space-x-4 mb-4">
                    <button className={`bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded ${isAnonymous === 1 ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}`} onClick={() => setIsAnonymous(1)}>Yes</button>
                    <button className={`bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded ${isAnonymous === 0 ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}`} onClick={() => setIsAnonymous(0)}>No</button>
                </div>
                {isSubmitting && isAnonymous === null && <p className="text-red-500">Please select an option for anonymity.</p>}
                <button onClick={handleApi} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "SUBMIT"}
                </button>
            </div>
        </div>
    )
}


export default AddProduct;
