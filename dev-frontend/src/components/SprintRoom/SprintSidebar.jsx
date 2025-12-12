import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

function SprintSidebar({ onNavigate }) {
  const { sprintId } = useParams();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: `/sprint/${sprintId}/home`, label: 'Home', icon: '🏠' },
    { path: `/sprint/${sprintId}/board`, label: 'Team Board', icon: '📋' },
    { path: `/sprint/${sprintId}/chat`, label: 'Chats', icon: '💬' },
    { path: `/sprint/${sprintId}/teams`, label: 'Teams', icon: '👥' },
    { path: `/sprint/${sprintId}/end`, label: 'Summary', icon: '🎯' },
  ];

  const handleLinkClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="w-56 sm:w-64 bg-[#1a1a1a]/40 backdrop-blur-xl border-r border-[#8D2B7E]/20 min-h-screen flex flex-col h-full shadow-[5px_0_20px_rgba(0,0,0,0.5)] z-50">
      {/* Header */}
      <div className="bg-[#2D033B]/60 backdrop-blur-md p-4 sm:p-6 relative border-b border-[#8D2B7E]/20">
        {/* Go Back Button */}
        <Link 
          to="/dashboard" 
          onClick={handleLinkClick}
          className="absolute top-4 sm:top-6 left-3 sm:left-4 w-7 h-7 sm:w-8 sm:h-8 hidden lg:flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg transition-colors group border border-white/5"
          title="Go back to Dashboard"
        >
          <svg 
            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-white transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-white font-bold text-lg sm:text-xl text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Sprint Room</h1>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
        <nav className="space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl transition-all font-medium ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] text-white shadow-[0_0_15px_rgba(141,43,126,0.4)] translate-x-1'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white hover:translate-x-1'
              }`}
            >
              <span className="text-lg sm:text-xl filter drop-shadow-md">{item.icon}</span>
              <span className="text-sm sm:text-base">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Footer / User Info could go here */}
      <div className="p-4 border-t border-[#8D2B7E]/20 bg-[#2D033B]/30">
         <p className="text-xs text-center text-gray-500 font-mono">Dev-Pair v1.0</p>
      </div>
    </div>
  );
}

export default SprintSidebar;
