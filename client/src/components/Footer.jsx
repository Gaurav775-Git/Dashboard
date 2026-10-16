import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#10162B] text-[#4F5A84] border-t border-[#232A46] pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

        {/* Brand Column */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            {/* Same Logo SVG */}
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="4" stroke="#0059F7" strokeWidth="2"/>
              <circle cx="6" cy="10" r="2" stroke="#0059F7" strokeWidth="2"/>
              <circle cx="26" cy="10" r="2" stroke="#0059F7" strokeWidth="2"/>
              <circle cx="6" cy="22" r="2" stroke="#0059F7" strokeWidth="2"/>
              <circle cx="26" cy="22" r="2" stroke="#0059F7" strokeWidth="2"/>
              <path d="M10 10L14 14" stroke="#0059F7" strokeWidth="2"/>
              <path d="M22 10L18 14" stroke="#0059F7" strokeWidth="2"/>
              <path d="M10 22L14 18" stroke="#0059F7" strokeWidth="2"/>
              <path d="M22 22L18 18" stroke="#0059F7" strokeWidth="2"/>
            </svg>
            <span className="text-xl font-bold text-white tracking-tight">Rankfasta</span>
          </div>
          <p className="text-sm leading-relaxed max-w-sm">
            The top SEO and GEO agency for startups. We help you accomplish incredible business goals with our data-driven SEO services.
          </p>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-[#54ABF8] transition-colors">SEO Optimization</a></li>
            <li><a href="#" className="hover:text-[#54ABF8] transition-colors">GEO Services</a></li>
            <li><a href="#" className="hover:text-[#54ABF8] transition-colors">Content Strategy</a></li>
            <li><a href="#" className="hover:text-[#54ABF8] transition-colors">Link Building</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-[#54ABF8] transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-[#54ABF8] transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-[#54ABF8] transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-[#54ABF8] transition-colors">Careers</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-[#232A46] flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>© {new Date().getFullYear()} Rankfasta. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#54ABF8] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#54ABF8] transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;