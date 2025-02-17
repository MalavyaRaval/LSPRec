import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [burger_class, setBurgerClass] = useState("burger-bar unclicked");
  const [menu_class, setMenuClass] = useState("menu hidden");
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const burgerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuClicked &&
        !menuRef.current?.contains(event.target) &&
        !burgerRef.current?.contains(event.target)
      ) {
        updateMenu();
      }
    };

    if (isMenuClicked) {
      document.addEventListener("click", handleClickOutside);
    }

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
    <div className="navbar-container relative">
      <nav className="w-full h-20 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 flex justify-between items-center px-6 shadow-lg">
        {/* Left Side - Burger Menu */}
        <div
          className="burger-menu w-16 h-full flex flex-col justify-center items-start cursor-pointer lg:hidden"
          onClick={updateMenu}
          ref={burgerRef}
        >
          <div
            className={`${burger_class} w-6 h-1 bg-white mb-1 transition-all duration-300 ease-in-out`}
          ></div>
          <div
            className={`${burger_class} w-6 h-1 bg-white mb-1 transition-all duration-300 ease-in-out`}
          ></div>
          <div
            className={`${burger_class} w-6 h-1 bg-white transition-all duration-300 ease-in-out`}
          ></div>
        </div>

        {/* Center - Website Name */}
        <h1 className="text-white text-xl font-extrabold absolute left-1/2 transform -translate-x-1/2">
          LSP Rec
        </h1>

        {/* Right Side - Profile Button */}
        <div className="hidden lg:block">
          <a
            href="/myprofile"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors hover:bg-blue-600 transform hover:scale-105"
          >
            My Profile
          </a>
        </div>
      </nav>

      {/* Mobile Menu - Slide In from the Right */}
      <div
        className={`${menu_class} fixed top-0 right-0 w-64 h-full bg-white shadow-xl transform transition-all duration-300 ease-in-out z-50`}
        ref={menuRef}
      >
        <ul className="list-none p-5 space-y-4 text-gray-900">
          <li>
            <a href="/home" className="hover:text-blue-500 transition-colors">
              Home
            </a>
          </li>
          <li>
            <a href="/login" className="hover:text-blue-500 transition-colors">
              Login
            </a>
          </li>
          <li>
            <a href="/signup" className="hover:text-blue-500 transition-colors">
              Sign Up
            </a>
          </li>
          <li>
            <a
              href="/aboutus"
              className="hover:text-blue-500 transition-colors"
            >
              About Us
            </a>
          </li>
          <li>
            <a
              href="/myprofile"
              className="hover:text-blue-500 transition-colors"
            >
              My Profile
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={handleSignOut}
              className="hover:text-blue-500 transition-colors"
            >
              Sign Out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
