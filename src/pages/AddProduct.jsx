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
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const [error, setError] = useState("");// Default to true, assuming user is logged in

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem("user");
    if (!userId) {
      setIsLoggedIn(false);
    }
  }, []);
  const handlePriceChange = (e) => {
    const value = e.target.value;
    // Check if the value is a valid number
    if (!isNaN(value)) {
      // Check for minimum and maximum price
      const priceValue = parseFloat(value);
      if (priceValue < 0) {
        setError("Price cannot be negative.");
      } else if (priceValue > 200000) { // Example maximum price of 1000
        setError("Maximum price is 200000.");
      } else {
        setError("");
        setPrice(value);
      }
    } else {
      setError("Please enter a valid price.");
    }
  };

  const handleApi = async () => {
    try {
      setIsSubmitting(true);
      if (isAnonymous === null) {
        alert("Please select an option for anonymity.");
        setIsSubmitting(false); // Display error message if no selection is made
        return;
      }
      if (!coverImg || !isValidImageType(coverImg.type)) {
        alert("Please select a valid cover image of type JPG, JPEG, or PNG.");
        setIsSubmitting(false);
        return;
      }
      for (const image of productImgs) {
        if (!isValidImageType(image.type)) {
          alert("Please select valid product images of type JPG, JPEG, or PNG.");
          setIsSubmitting(false);
          return;
        }
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

      const url =
        "https://hostelhub-backend.onrender.com/api/v1/product/addProducts"; // Replace with your endpoint URL
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
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
      window.location.href = "/";
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false); // Reset the form submission state
    }
  };
  const isValidImageType = (type) => {
    return (
      type === "image/jpeg" ||
      type === "image/jpg" ||
      type === "image/png"
    );
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
    window.location.href = "/login";
  }

  return (
    <div className="container mx-auto p-3">
      <div className="container mx-auto flex items-center justify-center p-3">
        <h2 className="mb-6 text-3xl font-semibold">ADD PRODUCT</h2>
      </div>
      <div className="mx-auto max-w-md overflow-hidden rounded-lg border border-white bg-white p-6 shadow-md">
        <label className="mb-2 block">Product Name</label>
        <input
          className="form-input mb-4 w-full border"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <label className="mb-2 block">Product Description</label>
        <textarea
          className="form-textarea mb-4 w-full border"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5} // Adjust the number of rows as needed
        />
        <label className="mb-2 block">Product Price</label>
        {/* <label htmlFor="price">Price:</label> */}
          <input
            type="number"
            id="price"
            value={price}
            onChange={handlePriceChange}
            required
          />
          {error && <p style={{ color: "red" }}>{error}</p>}

        <label className="mb-2 block">Product Cover Image</label>
        <input
          className="form-input mb-4 w-full border"
          type="file"
          onChange={handleCoverImageChange}
        />
        <label className="mb-2 block">Product Images</label>
        <input
          className="form-input mb-4 w-full border"
          type="file"
          onChange={handleProductImageChange}
          multiple
        />
        <label className="mb-2 block">Is the product anonymous?</label>

        <div className="mb-4 flex items-center space-x-4">
          <button
            className={`rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 ${isAnonymous === 1 ? "bg-blue-500 text-white hover:bg-blue-600" : ""}`}
            onClick={() => setIsAnonymous(1)}
          >
            Yes
          </button>
          <button
            className={`rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 ${isAnonymous === 0 ? "bg-blue-500 text-white hover:bg-blue-600" : ""}`}
            onClick={() => setIsAnonymous(0)}
          >
            No
          </button>
        </div>
        {isSubmitting && isAnonymous === null && (
          <p className="text-red-500">Please select an option for anonymity.</p>
        )}
        <button
          onClick={handleApi}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "SUBMIT"}
        </button>
      </div>
    </div>
  );
}

export default AddProduct;
