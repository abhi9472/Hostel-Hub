import "./App.css";
import { NavBar } from "./components/Navbar";
// import { Footer } from "./components/Footer";

import { Outlet } from "react-router-dom";
import React, { useState } from "react";
import "./index.css";
import "./tailwind.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      {/* <Footer/> */}
      <Outlet />
    </>
  );
}

export default App;
