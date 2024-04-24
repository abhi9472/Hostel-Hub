import React, { useState, useEffect } from "react";
import axios from "axios";

function AddProduct() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  // const [coverImg, setCoverImg] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(null);
  const [productImgs, setProductImgs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [error, setError] = useState(""); // Default to true, assuming user is logged in
  const maxLength = 300;

  const handleDescriptionChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxLength) {
      setDescription(inputValue);
    }
  };

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
      } else if (priceValue > 200000) {
        // Example maximum price of 1000
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
      // if (!coverImg || !isValidImageType(coverImg.type)) {
      //   alert("Please select a valid cover image of type JPG, JPEG, or PNG.");
      //   setIsSubmitting(false);
      //   return;
      // }
      for (const image of productImgs) {
        if (!isValidImageType(image.type)) {
          alert(
            "Please select valid product images of type JPG, JPEG, or PNG.",
          );
          setIsSubmitting(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("description", description);
      formData.append("price", price);
      // formData.append("coverImg", coverImg);
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

      // console.log(response.data); // Handle response as needed

      alert(response.data.message); // Display success message

      // Clear form fields after successful submission
      setProductName("");
      setDescription("");
      setPrice("");
      // setCoverImg(null);
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
      type === "image/jpeg" || type === "image/jpg" || type === "image/png"
    );
  };

  // const handleCoverImageChange = (e) => {
  //   setCoverImg(e.target.files[0]);
  // };

  const handleProductImageChange = (e) => {
    const files = e.target.files;
    if (files.length < 2) {
      alert("Please select at least 2 images.");
      // Clear the selected files to prevent further processing
      e.target.value = null;
      return;
    }
    
    // Check if the number of selected files exceeds 5
    const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);

  // Check if the total size exceeds 50 MB
  if (totalSize > 50 * 1024 * 1024) { // 50 MB in bytes
    alert("Total size of images exceeds 50 MB.");
    // Clear the selected files to prevent further processing
    e.target.value = null;
    return;
  }
    if (files.length > 5) {
      alert("You can only upload a maximum of 5 images.");
      // Clear the selected files to prevent further processing
      e.target.value = null;
      return;
    }
    
    // Convert the selected files to an array and update the state
    const newProductImgs = Array.from(files);
    setProductImgs(newProductImgs);
  };
  if (!isLoggedIn) {
    // Redirect user to login page if not logged in
    window.location.href = "/login";
  }

  return (
    <div
      className="mg-15 h-15 mt-6 flex min-h-screen items-center justify-center"
      style={{
        backgroundImage: `url('/aaa.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100%", // Set the minimum height to cover the entire viewport
      }}
    >
      <div className="mt-16 flex h-screen flex-col items-center justify-start">
        <div className="mb-4 text-center text-2xl font-semibold text-black">
          Add Product
        </div>
        <div
          className="bg-offwhite w-full max-w-xs p-8 shadow-md"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <label className="mb-2 block  font-semibold text-black">
            Product Name
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            className="form-input mb-4 w-full border"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
          <label className="mb-2 block  font-semibold text-black">
            Product Description
            <span className="text-red-500 ml-1">*</span>
          </label>
          {/* <span class="text-red-500 ml-1">*</span> */}

          <textarea
            className="form-textarea mb-4 w-full border"
            value={description}
            onChange={handleDescriptionChange}
            rows={5}
            maxLength={maxLength}
            required
          />
          <p className="text-sm text-gray-500">
            {description.length}/{maxLength} characters
          </p>

          <label className="mb-2 block  font-semibold text-black">
            Product Price
            <span className="text-red-500 ml-1">*</span>
          </label>
          {/* <span class="text-red-500 ml-1">*</span> */}

          {/* <label htmlFor="price">Price:</label> */}
          <input
            className="form-input mb-4 w-full border"
            type="number"
            id="price"
            value={price}
            onChange={handlePriceChange}
            required
          />
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* <label className="mb-2 block  font-semibold text-black">Product Cover Image</label>
          <input
            className="form-input mb-4 w-full border"
            type="file"
            onChange={handleCoverImageChange}
          /> */}
          <label className="mb-2 block  font-semibold text-black">
            Product Images -(min-2)
            <span className="text-red-500 ml-1">*</span>
          </label>

          <input
            className="form-input mb-4 w-full border"
            type="file"
            onChange={handleProductImageChange}
            multiple
            required
          />
          <label className="mb-2 block  font-semibold text-black">
            Do you want to show your contact details public?
            <span className="text-red-500 ml-1">*</span>

          </label>

          <div className="mb-4 flex items-center space-x-4">
            <button
              className={`rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 ${isAnonymous === 0 ? "bg-blue-500 text-white hover:bg-blue-600" : ""}`}
              onClick={() => setIsAnonymous(0)}
            >
              Yes
            </button>
            <button
              className={`rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 ${isAnonymous === 1 ? "bg-blue-500 text-white hover:bg-blue-600" : ""}`}
              onClick={() => setIsAnonymous(1)}
            >
              No
            </button>
          </div>
          {isSubmitting && isAnonymous === null && (
            <p className="text-red-500">
              Please select an option for anonymity.
            </p>
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
    </div>
  );
}

export default AddProduct;
