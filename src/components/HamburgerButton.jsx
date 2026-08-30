import React from 'react';

export default function HamburgerButton({ isOpen, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Toggle menu"
      aria-expanded={isOpen}
      className={`${className} md:hidden fixed top-3 left-3 z-[1000] flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-xl border border-white/10 bg-[#141418]/90 shadow-lg backdrop-blur-md transition-transform active:scale-95`}
    >
      <span
        className={`block h-[2px] w-5 rounded-full bg-white transition-transform duration-300 ${
          isOpen ? 'translate-y-[7px] rotate-45' : ''
        }`}
      />
      <span
        className={`block h-[2px] w-5 rounded-full bg-white transition-all duration-300 ${
          isOpen ? 'scale-x-0 opacity-0' : ''
        }`}
      />
      <span
        className={`block h-[2px] w-5 rounded-full bg-white transition-transform duration-300 ${
          isOpen ? '-translate-y-[7px] -rotate-45' : ''
        }`}
      />
    </button>
  );
}
