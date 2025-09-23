import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative h-screen bg-gradient-to-r from-slate-900 to-slate-700 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: `url('https://d64gsuwffb70l.cloudfront.net/68d190bc5f836a08764308c8_1758564574929_459c5211.webp')`
        }}
      />
      
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="text-center text-white max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            AutoPerks
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Premium Automotive Services supplied by Qualified Supply Agents
          </p>
          <p className="text-lg mb-12 text-gray-300 max-w-2xl mx-auto">
            From luxury valet services to comprehensive maintenance, ITV testing, and insurance solutions - all in one trusted location.
          </p>
        </div>
      </div>
      
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
};

export default Hero;