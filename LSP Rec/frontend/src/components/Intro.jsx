import React, { useState, useEffect } from 'react';
import symbol from '../images/symbol.jpg';
import '../CSS/intro.css';
import Navbar from './Nav/Navbar';
import Footer from './Footer';

const Intro = () => {
  const [easterEgg, setEasterEgg] = useState(false);

  const handleImageClick = () => {
    setEasterEgg(true);
  };

  useEffect(() => {
    if (easterEgg) {
      const timer = setTimeout(() => {
        setEasterEgg(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [easterEgg]);

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="intro-container">
          
        <h1>Welcome to LSP Rec</h1>
          <p>
            Welcome to LSP Rec, a simple and powerful decision-making tool designed for nonprofessional users
          </p>
          
          <h2>What is LSP Rec?</h2>
          <p>
            LSP Rec is built on the Logic Scoring of Preference (LSP) method, a powerful technique used for making complex decisions based on multiple criteria and graded logic. Unlike traditional systems, LSP Rec is designed for nonprofessional users, making it easy to use while still maintaining its accuracy.
          </p>

          <h2>Why LSP Rec?</h2>
          <ul>
            <li><strong>Simplified Decision Making:</strong> LSP Rec simplifies complex decision-making by reducing the number of criteria you need to consider.</li>
            <li><strong>No Technical Knowledge Required:</strong> Users don’t need to understand the underlying logic, just using the users preferences, and LSP Rec uses the graded logic to get the results for the user.</li>
            <li><strong>Personalized Recommendations:</strong> This tool can be used for descisionmaking ranging from choosing a hotel, house, car. LSP Rec helps to get the best choice based on users criteria.</li>
          </ul>

          <h2>Features of LSP Rec</h2>
          <ul>
            <li><strong>User-Friendly Interface:</strong> Easily enter your preferences using intuitive values.</li>
            <li><strong>Accurate Results:</strong> LSP Rec uses the same proven methodology as the full LSP method to ensure high-quality recommendations.</li>
          </ul>

        </div>
        <Footer />
      </div>
    </>
  );
};

export default Intro;
