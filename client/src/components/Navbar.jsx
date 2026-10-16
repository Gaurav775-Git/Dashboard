import React from 'react';
import logo from '../assets/Rankfasta-logo.jpg'

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="w-full bg-[#111832] text-white py-7 px-6 md:px-12 flex items-center justify-between border-b border-[#1C2540]">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="Rankfasta logo"
          className="h-8 w-8 rounded object-contain"
        />
        <span className="text-2xl font-bold tracking-tight">Rankfasta</span>
      </div>

      {/* Desktop Right Side */}
      <div className="hidden md:flex items-center gap-6">
        <a href="#" className="text-base text-[#4F5A84] hover:text-white transition-colors font-medium">
          Blog
        </a>
        <button className="bg-[#0059F7] hover:bg-[#1B6DF7] text-white px-6 py-3 rounded-lg text-base font-semibold transition-colors">
          Contact Us
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        )}
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-24 left-0 w-full bg-[#111832] border-t border-[#232A46] p-6 flex flex-col gap-4 md:hidden z-50">
          <a href="#" className="text-base text-[#4F5A84] hover:text-white font-medium">Blog</a>
          <button className="bg-[#0059F7] hover:bg-[#1B6DF7] text-white px-6 py-3 rounded-lg text-base font-semibold transition-colors w-full text-left">
            Contact Us
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;