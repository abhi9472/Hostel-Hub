import React from 'react';
import '../index.css'
//  import '../tailwind.css'


export function NavBar(props) {
  const handleLogout = async() => {
    try {
      // Clear user data from localStorage
      //localStorage.removeItem('user'); // Remove user data from localStorage
       props.setIsLoggedIn(false); // Update isLoggedIn state

      // Make a POST request to the; logout endpoint
      const res = await fetch('http://localhost:8000/api/v1/users/logout', {
          method: 'POST',
          credentials: 'include' // Include credentials (cookies) in the request
      });
     // with credentials:true
      // Check if the response is ok
      if (res.ok) {
          console.log('Logout successful');
          localStorage.removeItem('user');
            // If the request is successful, redirect to login page
          //navigate('/');
          window.location.href = '/'; 
      } else {
          // Handle non-successful responses
          const data = await res.json();
          console.error('Logout failed:', data.message);
          // Display an error message to the user or perform any other necessary actions
      }
  } catch (error) {
      console.error('Logout failed:', error.message);
      // Handle any errors or display a message to the user
  } 
};
    
    // Navigate to login page after logout

  const user = localStorage.getItem('user');

  return (
    <div>
    <header className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
      <a href="/" className="text-red-500 text-2xl font-bold">HOSTEL HUB</a>
        <nav>
          <ul className="flex space-x-4 items-center">
            {/* <li><a href="/" className="text-white hover:text-gray-300">Home</a></li> */}
            {user && (
              <>
                <li><a href="/profile" className="text-white hover:text-gray-300">Profile</a></li>
                <li><a href="/addproduct" className="text-white hover:text-gray-300">Add Product</a></li>
                <li className="text-center">
                  <button onClick={handleLogout} className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700">Logout</button>
                </li>
              </>
            )}
            {!user && (
              <>
                <li><a href="/login" className="text-white hover:text-gray-300">Login</a></li>
                <li><a href="/signup" className="text-white hover:text-gray-300">Sign Up</a></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  </div>
  
  )

}
