import React from 'react';

export default function HamburgerButton({ isOpen, onClick, className }) {
  return (
    <button 
      className={`hamburger-button ${className || ''} ${isOpen ? 'open' : ''}`}
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
    </button>
  );
}