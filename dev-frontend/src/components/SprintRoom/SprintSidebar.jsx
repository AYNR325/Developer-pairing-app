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
    <div className="w-56 sm:w-64 bg-[#8D2B7E] min-h-screen flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#2D033B] p-3 sm:p-4 relative ">
        {/* Go Back Button */}
        <Link 
          to="/dashboard" 
          onClick={handleLinkClick}
          className="absolute top-3 sm:top-4 left-3 sm:left-4 w-7 h-7 sm:w-8 sm:h-8 hidden lg:flex items-center justify-center bg-[#8D2B7E] hover:bg-[#A259C6] rounded-lg transition-colors group"
          title="Go back to Dashboard"
        >
          <svg 
            className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-white font-bold text-lg sm:text-xl text-center">Sprint</h1>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-[#A259C6] text-white'
                  : 'text-white hover:bg-[#A259C6]/50'
              }`}
            >
              <span className="text-base sm:text-lg">{item.icon}</span>
              <span className="font-medium text-sm sm:text-base">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default SprintSidebar;
