import React, { useState, useRef } from 'react';

 export function NavBar(props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timerRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 100); // Adjust the delay as needed
  };

  const handleOptionMouseEnter = () => {
    clearTimeout(timerRef.current);
  };

  const handleOptionMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 500); // Adjust the delay as needed
  };

  const handleLogout = async () => {
    try {
      // Clear user data from localStorage
      //localStorage.removeItem('user'); // Remove user data from localStorage
      props.setIsLoggedIn(false); // Update isLoggedIn state

      // Make a POST request to the; logout endpoint
      const res = await fetch('https://cu-hostelhub-api.vercel.app/api/v1/users/logout', {
        method: 'POST',
        credentials: 'include' // Include credentials (cookies) in the request
      });
      // with credentials:true
      // Check if the response is ok
      localStorage.removeItem('user');
      window.location.href = '/';

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

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header className="bg-gray-100 shadow-white-800 p-4">

      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-red-500 text-2xl font-bold">HOSTEL HUB</a>

        <nav className="flex items-center space-x-4">
          <ul className="flex space-x-4 items-center">
            <li><a href="/" className="text-black hover:text-gray-300">Home</a></li>
            {user && (
              <li><a href="/addproduct" className="text-black hover:text-gray-300">Add Product</a></li>
            )}
          </ul>

          {/* Display user's profile picture and name */}
          {user && (
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center focus:outline-none relative">
                {/* <span className="text-white mr-2">{user.name}</span> */}
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              </button>

              {/* Dropdown content */}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10"
                  onMouseEnter={handleOptionMouseEnter}
                  onMouseLeave={handleOptionMouseLeave}
                >
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                  >
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-300"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Display Login and Sign Up links if user is not logged in */}
          {!user && (
            <ul className="flex space-x-4 items-center">
              <li><a href="/login" className="text-black hover:text-gray-300">Login</a></li>
              <li><a href="/signup" className="text-black hover:text-gray-300">Sign Up</a></li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
