import React, { useState } from 'react';

function SellItemPage() {
  const [itemData, setItemData] = useState({
    itemName: '',
    price: '',
    imagePath: '',
    description: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData({ ...itemData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('YOUR_BACKEND_SELL_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error('Failed to sell item');
      }

      // Clear form fields after successful sell
      setItemData({
        itemName: '',
        price: '',
        imagePath: '',
        description: ''
      });
      
      // Optionally, display a success message to the user
      console.log('Item sold successfully');
    } catch (error) {
      console.error('Error selling item:', error.message);
      setError('Failed to sell item');
    }
  };

  return (
    <div>
      <h2>Sell Item</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Item Name:</label>
          <input
            type="text"
            name="itemName"
            value={itemData.itemName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={itemData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image Path:</label>
          <input
            type="text"
            name="imagePath"
            value={itemData.imagePath}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={itemData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit">Sell</button>
      </form>
    </div>
  );
}

export default SellItemPage;
