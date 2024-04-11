import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetailsComponent({ product, currentImageIndex, handleNextImage, handleBackButtonClick, isLoggedIn }) {
    const waLink = `https://wa.me/${product.phoneNum}`;
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const openImageModal = (index) => {
        setSelectedImageIndex(index);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
    };

    return (
        <div className="container mx-auto px-4 py-8 flex">
            <div className="w-1/2 mr-8">
                <h2 className="text-3xl font-semibold mb-4">Product Images</h2>
                <div className="grid grid-cols-3 gap-4">
                    {product.productImgs.map((imgSrc, index) => (
                        <img
                            key={index}
                            src={imgSrc}
                            alt={`Product Image ${index + 1}`}
                            className="w-full h-32 object-cover object-center cursor-pointer"
                            onClick={() => openImageModal(index)}
                        />
                    ))}
                </div>
                {isImageModalOpen && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
                        <img
                            src={product.productImgs[selectedImageIndex]}
                            alt={`Product Image ${selectedImageIndex + 1}`}
                            className="max-w-full max-h-full"
                        />
                        <button
                            className="absolute top-0 right-0 m-4 text-white text-xl focus:outline-none"
                            onClick={closeImageModal}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
            <div className="w-1/2">
                <h2 className="text-3xl font-semibold mb-4">Product Details</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <p className="text-lg font-semibold text-blue-500">Price: ₹ {product.price}</p>
                    {isLoggedIn ? (
                        <div>
                            <p className="text-lg font-semibold mb-2">Uploader Details:</p>
                            <ul className="mb-4">
                                <li>Username: {product.username}</li>
                                <li>Phone Number: {product.phoneNum}</li>
                                <li>Hostel Name: {product.hostelName}</li>
                                <li>UID: {product.uid}</li>
                            </ul>
                            <a href={waLink}>Chat on WhatsApp</a>
                        </div>
                    ) : (
                        <p className="text-gray-600 mb-4">
                            Please <a href="/login" className="text-blue-500">login</a> to see uploader details.
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

        useEffect(() => {
            fetchProductDetails(productId);
            checkAuthentication();
        }, [productId]);

        const fetchProductDetails = async (productId) => {
            try {
                const response = await fetch(`https://cu-hostelhub-api.vercel.app/api/v1/product/get-product?id=${productId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                const responseData = await response.json();
                const productData = responseData.data || null;
                console.log(responseData.data);

                setProduct(productData);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        const checkAuthentication = () => {
            const userId = localStorage.getItem('user');
            if (userId) {
                setIsLoggedIn(true); // Update isLoggedIn state if user is logged in
            }
        };

        const handleNextImage = () => {
            // Handle next image logic
        };

        const handleBackButtonClick = () => {
            if (history) {
                history.goBack(); // Check if history is defined before calling goBack
            }
        };

        if (!product) {
            return <div>Loading...</div>;
        }

        return (
            <Component
                {...props}
                product={product}
                currentImageIndex={0} // Start from the first image
                handleNextImage={handleNextImage}
                handleBackButtonClick={handleBackButtonClick}
                isLoggedIn={isLoggedIn}
            />
        );
    };
}

const ProductDetails = withHistory(ProductDetailsComponent);

export default ProductDetails;
