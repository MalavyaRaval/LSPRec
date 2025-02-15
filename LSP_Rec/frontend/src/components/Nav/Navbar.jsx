import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../CSS/navbar.css";

const Navbar = () => {
  const [burger_class, setBurgerClass] = useState("burger-bar unclicked");
  const [menu_class, setMenuClass] = useState("menu hidden");
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const burgerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both menu and burger button
      if (
        isMenuClicked &&
        !menuRef.current?.contains(event.target) &&
        !burgerRef.current?.contains(event.target)
      ) {
        updateMenu();
      }
    };

    // Add listener when menu is open
    if (isMenuClicked) {
      document.addEventListener("click", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuClicked]);

  const updateMenu = () => {
    if (!isMenuClicked) {
      setBurgerClass("burger-bar clicked");
      setMenuClass("menu visible");
    } else {
      setBurgerClass("burger-bar unclicked");
      setMenuClass("menu hidden");
    }
    setIsMenuClicked(!isMenuClicked);
  };

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="navbar-container">
      <nav className="flex items-center justify-between bg-gray-800 p-4">
        {/* Left Side - Burger Menu */}
        <div className="flex items-center">
          <div
            className="burger-menu mr-4"
            onClick={updateMenu}
            ref={burgerRef}
          >
            <div className={burger_class}></div>
            <div className={burger_class}></div>
            <div className={burger_class}></div>
          </div>
        </div>

        {/* Center - Website Name */}
        <h1 className="text-white text-xl font-bold">LSP Rec</h1>

        {/* Right Side - Profile Button */}
        <div className="hidden md:block">
          <a
            href="/myprofile"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            My Profile
          </a>
        </div>
      </nav>

      <div className={menu_class} ref={menuRef}>
        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/login">Login</a>
          </li>
          <li>
            <a href="/signup">Sign Up</a>
          </li>
          <li>
            <a href="/aboutus">About Us</a>
          </li>
          <li>
            <a href="/myprofile">My Profile</a>
          </li>
          <li>
            <a href="#" onClick={handleSignOut}>
              Sign Out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
