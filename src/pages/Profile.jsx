import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [newData, setNewData] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [showUpdatePriceInputs, setShowUpdatePriceInputs] = useState({}); // Store state for each product separately
  const [newPriceData, setNewPriceData] = useState({}); // Store updated pric
  const [updatedProductNames, setUpdatedProductNames] = useState({}); // Store updated names for each product
  const [showUpdateNameInput, setShowUpdateNameInput] = useState(false);
  const [showUpdatePhoneInput, setShowUpdatePhoneInput] = useState(false); // State for showing phone number input

  useEffect(() => {
    const userId = localStorage.getItem("user");
    if (userId) {
      setIsLoggedIn(true);
      fetchUserData();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        "https://hostelhub-backend.onrender.com/api/v1/users/getUser",
        { withCredentials: true },
      );
      if (!response.data || !response.data.data) {
        throw new Error("No user data found");
      }
      setUserData(response.data.data);
      fetchUserProducts(response.data.data._id);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const fetchUserProducts = async (userId) => {
    try {
      const response = await axios.get(
        `https://hostelhub-backend.onrender.com/api/v1/product/getUserProducts/`,
        { withCredentials: true },
      );
      if (!response.data) {
        throw new Error(response.data.message);
      }
      setUserProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching user products:", error);
    }
  };

  const handleUpdateOption = async () => {
    if (!selectedOption) return;

    try {
      let endpoint = "";
      let data = {};

      switch (selectedOption) {
        case "avatar":
          const avatarInput = document.getElementById("avatarInput");
          if (!avatarInput || !avatarInput.files || !avatarInput.files[0]) {
            console.error("No file selected for avatar.");
            return;
          }
          const avatarFile = avatarInput.files[0];
          const formDataAvatar = new FormData();
          formDataAvatar.append("avatar", avatarFile);
          endpoint =
            "https://hostelhub-backend.onrender.com/api/v1/info/updateAvatar";
          data = formDataAvatar;
          break;
        case "password":
          if (!newData.oldPassword || !newData.newPassword) return;
          endpoint =
            "https://hostelhub-backend.onrender.com/api/v1/info/updatePass";
          data = {
            oldPassword: newData.oldPassword,
            newPassword: newData.newPassword,
          };
          break;
        case "hostel":
          if (!newData) return;
          endpoint =
            "https://hostelhub-backend.onrender.com/api/v1/info/updateHostel";
          data = { newHostel: newData };
          break;
          case "phoneNumber":
            const phoneNumber = newData.phoneNumber || "";
            const isPhoneNumberValid = phoneNumber.length === 10;
            if (isPhoneNumberValid) {
              endpoint = "https://hostelhub-backend.onrender.com/api/v1/info/updatePhone";
              data = { newPhone: phoneNumber };
            } else {
              console.error("Invalid phone number");
            }
            break;
        default:
          break;
      }
      // console.log("New Data:", data);

      const response = await axios.patch(endpoint, data, {
        withCredentials: true,
      });
      // console.log("Updated successfully");
      alert("Updated Successfully");

      window.location.href = "/profile";
      fetchUserData();
    } catch (error) {
      console.error("Error updating user data:", error.response);
    }
  };

  const renderInput = () => {
    switch (selectedOption) {
      case "avatar":
        return (
          <input
            type="file"
            id="avatarInput"
            accept="image/*"
            style={{
              backgroundColor: "white",
              color: "black",
              border: "1px solid black",
            }}
          />
        );
      case "password":
        return (
          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Old Password"
              value={newData.oldPassword || ""}
              onChange={(e) =>
                setNewData({ ...newData, oldPassword: e.target.value })
              }
              style={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid black",
                marginBottom: "8px",
              }}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newData.newPassword || ""}
              onChange={(e) =>
                setNewData({ ...newData, newPassword: e.target.value })
              }
              style={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid black",
              }}
            />
          </div>
        );
      case "hostel":
        return (
          <select
            value={newData}
            onChange={(e) => setNewData(e.target.value)}
            style={{
              backgroundColor: "white",
              color: "black",
              border: "1px solid black",
            }}
          >
            <option value="">Select Hostel</option>
            <option value="NekChand/Zakir">NekChand/Zakir</option>
            <option value="SUKHNA">SUKHNA</option>
            <option value="TAGORE">TAGORE</option>
          </select>
        );
        case "phoneNumber":
          return (
            <div>
              {showUpdatePhoneInput && (
                <>
                  <input
                    type="text"
                    placeholder="New Phone Number"
                    value={newData.phoneNumber || ""}
                    onChange={(e) => {
                      const phoneNumber = e.target.value;
                      if (/^\d{0,10}$/.test(phoneNumber)) {
                        setNewData({ ...newData, phoneNumber });
                      }
                    }}
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      border: "1px solid black",
                    }}
                    maxLength={10}
                  />
                  {newData.phoneNumber &&
                    newData.phoneNumber.length !== 10 && (
                      <p style={{ color: "red" }}>Please enter 10 digits.</p>
                    )}
                </>
              )}
            </div>
        );
      default:
        return null;
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setShowInput(true);
    // Reset newData state when a new option is selected
    setNewData("");
    setNewData({ oldPassword: "", newPassword: "" });
    if (option === "phoneNumber") {
      setShowUpdatePhoneInput(true);
    } else {
      setShowUpdatePhoneInput(false); // Set showUpdatePhoneInput to true when selecting phoneNumber option
    }
  };

  const handleSold = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this product as sold?",
    );

    if (!confirmed) {
      // If not confirmed, do nothing
      return;
    }
    try {
      const response = await axios.patch(
        `https://hostelhub-backend.onrender.com/api/v1/info/soldOut?id=${productId}`,
        null,
        { withCredentials: true },
      );
      // console.log(response.data); // Assuming the response contains some data
      // console.log("Product marked as sold successfully");
      alert("Product Solded");
      // Refresh the profile page
      window.location.href = "/profile";

      fetchUserProducts(userData._id);
    } catch (error) {
      console.error("Error marking product as sold:", error);
    }
  };

  const handleRemove = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to Remove this product?",
    );

    if (!confirmed) {
      // If not confirmed, do nothing
      return;
    }
    try {
      const response = await axios.patch(
        `https://hostelhub-backend.onrender.com/api/v1/info/removeProduct?id=${productId}`,
        null,
        { withCredentials: true },
      );
      // console.log(response.data); // Assuming the response contains some data

      // console.log("Product deleted successfully");
      alert("Product Deleted");
      // Refresh the profile page
      fetchUserProducts(userData._id);
      window.location.href = "/profile";
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdatePrice = async (productId) => {
    try {
      if (!newPriceData[productId] || isNaN(newPriceData[productId])) {
        throw new Error("Please enter a valid price.");
      }
      const response = await axios.patch(
        `https://hostelhub-backend.onrender.com/api/v1/info/updatePrice?id=${productId}`,
        { productPrice: newPriceData[productId] },
        { withCredentials: true },
      );
      console.log(response.data); // Assuming the response contains some data

      console.log("Product price updated successfully");
      alert("Updated Successfully.");

      // Refresh the profile page
      fetchUserProducts(userData._id);
      window.location.href = "/profile";
    } catch (error) {
      console.error("Error updating product price:", error);
    }
  };
  const handleUpdateProductName = async (productId) => {
    try {
      const response = await axios.patch(
        `https://hostelhub-backend.onrender.com/api/v1/info/updateName?id=${productId}`,
        { productName: updatedProductNames[productId] },
        { withCredentials: true },
      );
      // console.log(response.data); // Assuming the response contains some data
      // console.log("Product name updated successfully");
      alert("Product Name Updated");
      // Refresh the profile page
      window.location.href = "/profile";
      fetchUserProducts(userData._id);
    } catch (error) {
      console.error("Error updating product name:", error);
    }
  };

  if (!isLoggedIn) {
    return <div>User is not logged in.</div>;
  }

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="py-18 container mx-auto mb-10 mt-20 flex-col items-center justify-between gap-16 px-4">
      {/* User information section */}
      <div className="relative flex items-center rounded-lg border bg-white p-6 shadow-lg">
        {/* User avatar */}
        <div className="mr-6 h-32 w-32 overflow-hidden rounded-full">
          <img className="h-full w-full" src={userData.avatar} alt="Avatar" />
        </div>
        {/* User details */}
        <div>
          <p className="text-2xl font-bold">{userData.name}</p>
          <p className="text-gray-600">Email:{userData.email}</p>
          <p className="text-gray-600">Uid: {userData.username}</p>
          <p className="text-gray-600">Phone: {userData.phoneNum}</p>
          <p className="text-gray-600">Hostel: {userData.hostel_name}</p>
        </div>
      </div>

      {/* Update user information section */}
      <div className="relative mt-6 flex flex-col rounded-lg border bg-white p-6 shadow-lg">
        {/* Update option select */}
        <label htmlFor="updateOption" className="mb-2 mr-2">
          Update:
        </label>
        <select
          id="updateOption"
          className="mb-2 w-32 rounded-md border border-gray-300 px-2 py-1"
          onChange={(e) => handleOptionChange(e.target.value)}
        >
          <option value="">Select Option</option>
          <option value="avatar">Avatar</option>
          <option value="password">Password</option>
          <option value="hostel">Hostel</option>
          <option value="phoneNumber">Phone Number</option> {/* Add option for updating phone number */}

        </select>
        {/* Input field based on selected option */}
        {showInput && (
          <div className="mb-2 flex flex-col">
            {renderInput()}
            <button
              className="mb-2 mt-2 w-32 rounded-md bg-blue-500 px-2 py-1 text-white"
              onClick={handleUpdateOption}
            >
              Update
            </button>
          </div>
        )}
      </div>

      {/* User products section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-3xl font-semibold">My Products</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {userProducts.map((product) => (
            <div
              key={product._id}
              className="relative overflow-hidden rounded-lg bg-white shadow-md"
            >
              <Link to={`/product/${product._id}`} className="block">
                <img
                  src={product.coverImg}
                  alt="Cover"
                  className="h-48 w-full cursor-pointer object-cover object-center"
                />
              </Link>

              <div className="p-4">
                <h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
                <p className="mb-4 text-gray-600">{product.description}</p>
                <p className="text-lg font-semibold text-blue-500">
                  Price: ₹ {product.price}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  {/* Sold button */}
                  <button
                    onClick={() => handleSold(product._id)}
                    style={{
                      padding: "4px",
                      border: "none",
                      background: "none",
                    }}
                  >
                    <img
                      src="/sold.png"
                      alt="Sold Icon"
                      style={{ width: "24px", height: "24px" }}
                    />
                  </button>
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(product._id)}
                    style={{
                      padding: "4px",
                      border: "none",
                      background: "none",
                    }}
                  >
                    <img
                      src="/remove.png"
                      alt="Remove Icon"
                      style={{ width: "24px", height: "24px" }}
                    />
                  </button>
                  {/* Update price button */}
                  <button
                    onClick={() =>
                      setShowUpdatePriceInputs({
                        ...showUpdatePriceInputs,
                        [product._id]: true,
                      })
                    }
                    style={{
                      padding: "4px",
                      border: "none",
                      background: "none",
                    }}
                  >
                    <img
                      src="/price.png"
                      alt="Update Price Icon"
                      style={{ width: "24px", height: "24px" }}
                    />
                  </button>
                  <button
                    onClick={() =>
                      setShowUpdateNameInput((prevState) => ({
                        ...prevState,
                        [product._id]: true,
                      }))
                    }
                    style={{
                      padding: "4px",
                      border: "none",
                      background: "none",
                    }}
                  >
                    <img
                      src="/namee.png"
                      alt="Update Name Icon"
                      style={{ width: "24px", height: "24px" }}
                    />
                  </button>
                </div>

                {/* Input field for updating price */}
                {showUpdatePriceInputs[product._id] && (
                  <div className="mt-2 flex items-center">
                    <input
                      type="number"
                      placeholder="New Price"
                      value={newPriceData[product._id] || ""}
                      onChange={(e) =>
                        setNewPriceData({
                          ...newPriceData,
                          [product._id]: e.target.value,
                        })
                      }
                      style={{
                        backgroundColor: "white",
                        color: "black",
                        border: "1px solid black",
                        width: "100px",
                      }}
                    />
                    <button
                      onClick={() => handleUpdatePrice(product._id)}
                      className="ml-2 rounded-md bg-blue-500 px-2 py-1 text-white"
                    >
                      Update Price
                    </button>
                  </div>
                )}
                {showUpdateNameInput[product._id] && (
                  <div className="mt-2 flex items-center">
                    <input
                      type="text"
                      placeholder="New Name"
                      value={updatedProductNames[product._id] || ""}
                      onChange={(e) =>
                        setUpdatedProductNames({
                          ...updatedProductNames,
                          [product._id]: e.target.value,
                        })
                      }
                      style={{
                        backgroundColor: "white",
                        color: "black",
                        border: "1px solid black",
                        width: "160px",
                      }}
                      maxLength={10} 
                      minLength={10} 
                    />
                    <button
                      onClick={() => handleUpdateProductName(product._id)}
                      className="ml-2 rounded-md bg-blue-500 px-2 py-1 text-white"
                    >
                      Update Name
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Profile;
