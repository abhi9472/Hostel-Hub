import "./App.css";
import { NavBar } from "./components/Navbar";
import { Outlet } from "react-router-dom";
import React, { useState } from "react";
import "./index.css";
import "./tailwind.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Outlet />
    </>
  );
}

export default App;
