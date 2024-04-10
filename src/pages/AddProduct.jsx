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
        withCredentials:true
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
    <div className="container mx-auto p-3">
      <h2 className="text-3xl font-semibold mb-6">ADD PRODUCT</h2>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6">
        <label className="block mb-2">Product Name</label>
        <input
          className="form-input border w-full mb-4"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <label className="block mb-2">Product Description</label>
        <input
          className="form-input border w-full mb-4"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label className="block mb-2">Product Price</label>
        <input
          className="form-input border w-full mb-4"
          type="Number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <label className="block mb-2">Product Cover Image</label>
        <input
          className="form-input border w-full mb-4"
          type="file"
          onChange={handleCoverImageChange}
        />
        <label className="block mb-2">Product Images</label>
        <input
          className="form-input border w-full mb-4"
          type="file"
          onChange={handleProductImageChange}
          multiple
        />
        <button onClick={handleApi} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          SUBMIT
        </button>
      </div>
    </div>
  );
}

export default AddProduct;
