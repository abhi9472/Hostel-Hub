import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetailsComponent({ product, currentImageIndex, handleNextImage, handlePrevImage, handleBackButtonClick, isLoggedIn }) {
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

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            handlePrevImage();
        } else if (e.key === 'ArrowRight') {
            handleNextImage();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentImageIndex]);

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
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
                    <div className="relative">
                        <button
                            className="absolute top-1/2 transform -translate-y-1/2 left-4 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex justify-center items-center"
                            onClick={handlePrevImage} // Use the provided handlePrevImage function
                        >
                            &lt;
                        </button>
                        <button
                            className="absolute top-1/2 transform -translate-y-1/2 right-4 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex justify-center items-center"
                            onClick={handleNextImage} // Use the provided handleNextImage function
                        >
                            &gt;
                        </button>
                        <img
                            src={product.productImgs[selectedImageIndex]}
                            alt={`Product Image ${selectedImageIndex + 1}`}
                            className="max-w-full max-h-full"
                        />
                    </div>
                    <button
                        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full px-4 py-2"
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
                                {/* <li>Username: {product.name}</li> */}

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
        const [currentImageIndex, setCurrentImageIndex] = useState(0);

        useEffect(() => {
            fetchProductDetails(productId);
            checkAuthentication();
        }, [productId]);

        const fetchProductDetails = async (productId) => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/product/get-product?id=${productId}`);
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
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % product.productImgs.length);
        };
    
        const handlePrevImage = () => {
            setCurrentImageIndex(prevIndex => (prevIndex === 0 ? product.productImgs.length - 1 : prevIndex - 1));
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
