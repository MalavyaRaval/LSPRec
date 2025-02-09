import React from 'react';
import '../CSS/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} Malavya Raval mraval@sfsu.edu LSP REC Project
        </p>
      </div>
    </footer>
  );
};

export default Footer;
