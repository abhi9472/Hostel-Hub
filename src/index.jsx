import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/SignUp.jsx";
import About from "./components/About.jsx";
import Profile from "./pages/Profile.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import "./index.css";
// import './tailwind.css'~
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import AddProduct from "./pages/AddProduct.jsx";
import VerifyOTP from "./pages/VerifyOtp.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import VerifyForgotOtp from "./pages/VerifyForgotOtp.jsx";

// Define setIsLoggedIn function if not defined already
const setIsLoggedIn = (isLoggedIn) => {
  // Your implementation to update the isLoggedIn state
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="/about" element={<About />} />
      {/* Pass setIsLoggedIn to Login component */}
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/addproduct" element={<AddProduct />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/verify-forgot-otp" element={<VerifyForgotOtp />} />
      <Route path="/product/:productId" element={<ProductDetails />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      {/* Define route for logout */}
      {/* <Route path='/logout' element={<Logout setIsLoggedIn={setIsLoggedIn} />} /> */}
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
