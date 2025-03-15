// Navbar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/navbar.css';

const Navbar = () => {
    const [burger_class, setBurgerClass] = useState("burger-bar unclicked");
    const [menu_class, setMenuClass] = useState("menu hidden");
    const [isMenuClicked, setIsMenuClicked] = useState(false);
    const navigate = useNavigate();

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
        // Clear user authentication data (e.g., tokens)
        localStorage.removeItem('authToken'); // Adjust this based on how you're storing the token

        // Redirect to login page
        navigate('/login');
    };

    return (
        <div className="navbar-container">
            <nav>
                <div className="burger-menu" onClick={updateMenu}>
                    <div className={burger_class}></div>
                    <div className={burger_class}></div>
                    <div className={burger_class}></div>
                </div>
            </nav>

            <div className={menu_class}>
                <ul>
                    <li><a href="/home">Home</a></li>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/signup">Sign Up</a></li>
                    <li><a href="/aboutus">About Us</a></li>
                    <li><a href="/myprofile">My Profile</a></li>
                    <li><a href="#" onClick={handleSignOut}>Sign Out</a></li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
