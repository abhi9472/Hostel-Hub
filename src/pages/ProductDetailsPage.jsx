import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetails({ history }) {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchProductDetails(productId);
    }, [productId]);

    const fetchProductDetails = async (productId) => {
        try {
            const response = await fetch(`https://cu-hostelhub-api.vercel.app/api/v1/product/get-product?id=${productId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            const responseData = await response.json();
            const productData = responseData.data || null;
            setProduct(productData);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.productImgs.length);
    };

    // const handleBackButtonClick = () => {
    //     history.goBack();
    // };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            
            <h2>Product Details</h2>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ₹{product.price}</p>
            <div>
                <img src={product.productImgs[currentImageIndex]} alt={`Product Image ${currentImageIndex + 1}`} style={{ width: '400px', height: '400px' }} />
                <button onClick={handleNextImage}>Next Image</button>
            </div>
        </div>
    );
}

export default ProductDetails;
