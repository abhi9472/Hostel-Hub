import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ProductDetailsComponent({
  product,
  currentImageIndex,
  handleNextImage,
  handlePrevImage,
  handleBackButtonClick,
  isLoggedIn,
}) {
  const waLink = `https://wa.me/${product.phoneNum}`;
  let pid;
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isRequestSent, setIsRequestSent] = useState(false);

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      handlePrevImage();
    } else if (e.key === "ArrowRight") {
      handleNextImage();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentImageIndex]);

  const contactUploader = async () => {
    try {
      const productId = localStorage.getItem("productId");
      const response = await axios.post(
        `https://hostelhub-backend.onrender.com/api/v1/users/requestProduct?id=${productId}`,
        null,
        { withCredentials: true },
      );
      alert("Request sent to Uploader"); // Assuming the response contains some data

      // console.log("Request sent to contact uploader");

      // Handle any further actions upon successful request
    } catch (error) {
      console.error("Error contacting uploader:", error);
      // Handle error if necessary
    }
  };

  return (
    <div
      className={`container mx-auto flex-col items-center justify-between gap-16 px-4 py-8 ${isImageModalOpen ? "overflow-hidden" : ""}`}
    >
      <div className="flex-grow">
        {/* <h2 className="text-3xl font-semibold mb-4">Product Images</h2> */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {product.productImgs.map((imgSrc, index) => (
            <img
              key={index}
              src={imgSrc}
              alt={`Product Image ${index + 1}`}
              className="relative h-48 w-full cursor-pointer rounded-md object-cover object-center shadow-lg"
              onClick={() => openImageModal(index)}
            />
          ))}
        </div>
        {isImageModalOpen && (
          <>
            <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
              <div className="relative h-96 w-96">
                <img
                  src={product.productImgs[selectedImageIndex]}
                  alt={`Product Image ${selectedImageIndex + 1}`}
                  className="h-full w-full object-contain"
                />
                <button
                  className="z-60 absolute -top-16 right-4 rounded-full bg-black bg-opacity-70 p-2 px-4 text-white"
                  onClick={closeImageModal}
                >
                  X
                </button>
              </div>
            </div>
            <div className="fixed left-0 top-0 z-40 h-full w-full bg-black bg-opacity-70 backdrop-blur-lg backdrop-filter"></div>
          </>
        )}
      </div>
      <div className="flex-grow">
        {/* <h2 className="text-3xl font-semibold mb-4">Product Details</h2> */}
        <div className="overflow-hidden rounded-lg bg-white p-4 shadow-md">
          <h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
          <p className="mb-4 text-gray-600">{product.description}</p>
          {/* <p className="mb-4 text-gray-600">{product.hostelName}</p> */}

          <p className="text-lg font-semibold text-blue-500">
            Price: ₹ {product.price}
          </p>
          <p className="mb-4 text-gray-600">
            {/* {" "} */}
            Hostel Name :{product.hostelName}
          </p>
          {/* <p className="mb-4 text-gray-600">
            {" "}
            Hostel Name :{product.hostelName}
          </p> */}

          {isLoggedIn ? (
            <div>
              {product.isAnonymous ? (
                <button
                  className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                  onClick={contactUploader}
                >
                  Contact Uploader
                </button>
              ) : (
                <div>
                  <p className="mb-2 text-lg font-semibold">
                    Uploader Details:
                  </p>
                  <ul className="mb-4">
                    <li>Name: {product.username}</li>
                    <li>Hostel Name: {product.hostelName}</li>
                    <li>
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Chat :{" "}
                        <img
                          src="/ww.png"
                          alt="WhatsApp"
                          width="24"
                          height="24"
                        />
                        {/* Chat */}
                      </a>
                    </li>

                    <li>Mob No: {product.phoneNum}</li>
                  </ul>
                  {isRequestSent && (
                    <p className="text-green-500">Request sent to uploader!</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="mb-4 text-gray-600">
              Please{" "}
              <a href="/login" className="text-blue-500">
                login
              </a>{" "}
              to see uploader details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function withHistory(Component) {
  return function WrappedComponent(props) {
    const { history } = props; // Ensure history prop is received
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
      fetchProductDetails(productId);
      checkAuthentication();
    }, [productId]);

    const fetchProductDetails = async (productId) => {
      try {
        const response = await fetch(
          `https://hostelhub-backend.onrender.com/api/v1/product/get-product?id=${productId}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const responseData = await response.json();
        const productData = responseData.data || null;
        // console.log(responseData);
        const fetchedProductId = productData._id;

        // Save product ID to local storage
        localStorage.setItem("productId", fetchedProductId);
        // pid=
        // localStorage.setItem('productid',response.data.data.)
        // contactUploader(productData.userId);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    const checkAuthentication = () => {
      const userId = localStorage.getItem("user");
      if (userId) {
        setIsLoggedIn(true); // Update isLoggedIn state if user is logged in
      }
    };
    const handleNextImage = () => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % product.productImgs.length,
      );
    };

    const handlePrevImage = () => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? product.productImgs.length - 1 : prevIndex - 1,
      );
    };

    const handleBackButtonClick = () => {
      history.goBack();
    };

    if (!product) {
      return <div>Loading...</div>;
    }

    return (
      <Component
        {...props}
        product={product}
        currentImageIndex={currentImageIndex}
        handleNextImage={handleNextImage}
        handlePrevImage={handlePrevImage}
        handleBackButtonClick={handleBackButtonClick}
        isLoggedIn={isLoggedIn}
      />
    );
  };
}

const ProductDetails = withHistory(ProductDetailsComponent);

export default ProductDetails;
