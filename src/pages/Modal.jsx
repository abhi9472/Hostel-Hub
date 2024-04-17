import React, { useState } from "react";

function Modal({ isOpen, onClose, product }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          Close
        </button>
        <div>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          {product.productImgs.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Product Image ${index}`}
              style={{ width: "200px", height: "200px" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Modal;
