import React, { useState } from 'react';

interface HeaderProps {
  onManagementClick?: () => void;
  onCompaniesClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onManagementClick, onCompaniesClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/689303cded436ce42a0b5c23_1758584379537_325870e0.png" 
              alt="RSJ Logo" 
              className="h-12 w-auto object-contain"
            />
            <span className="text-xl font-bold text-slate-800">AutoPerks</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={onCompaniesClick}
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
            >
              Companies
            </button>
            <a href="#contact" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Contact</a>
          </nav>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={onCompaniesClick}
                className="text-slate-600 hover:text-blue-600 font-medium text-left"
              >
                Companies
              </button>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 font-medium">Contact</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;