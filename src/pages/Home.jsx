import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import './Home.css'
//import './ProductList.css'; // Import CSS file for styling

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://cu-hostelhub-api.vercel.app/api/v1/product/allProducts');
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const responseData = await response.json();
      const productData = responseData.data || [];
      setProducts(productData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  if (products.length === 0) {
    return <div>No Products</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold mb-6">New Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="relative bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Wrap the product name inside a Link component */}
            <Link to={`/product/${product._id}`}>
              <img
                src={product.coverImg}
                alt={product.name}
                className="w-full h-48 object-cover object-center cursor-pointer"
              />
            </Link>
            <div className="p-4">
              {/* Also wrap the product name inside the Link component */}
              <Link to={`/product/${product._id}`}>
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              </Link>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-lg font-semibold text-blue-500">
                Price: ₹ {product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}

export default Home;
