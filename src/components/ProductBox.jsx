import React from 'react'

export const ProductBox = ({imgPath, title, cost, description}) => {
  return (
    <div className='product'>
      <img src={imgPath}/>
      <h3>{title}</h3>
      <h4>{cost}</h4>
      <p>{description}</p>
    </div>
  )
}


