import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose, onSignOut, isMobileOnly = false }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <aside
        className={`w-64 bg-[#1a1a1a]/60 backdrop-blur-xl border-r border-[#8D2B7E]/20 fixed left-0 top-[60px] sm:top-[73px] bottom-0 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen 
            ? "translate-x-0" 
            : `-translate-x-full ${!isMobileOnly ? "lg:translate-x-0" : ""}`
        }`}
      >
        <nav className="p-4 space-y-2 flex-grow overflow-y-auto custom-scrollbar">
          <Link
            to="/dashboard"
            onClick={onClose}
            className={`block py-3 px-4 rounded-xl transition-all font-medium ${
              isActive("/dashboard")
                ? "bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] text-white shadow-[0_0_15px_rgba(141,43,126,0.3)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/search"
            onClick={onClose}
            className={`block py-3 px-4 rounded-xl transition-all font-medium ${
              isActive("/search")
                ? "bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] text-white shadow-[0_0_15px_rgba(141,43,126,0.3)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Search Developers
          </Link>
          <Link
            to="/join-sprint"
            onClick={onClose}
            className={`block py-3 px-4 rounded-xl transition-all font-medium ${
              isActive("/join-sprint")
                ? "bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] text-white shadow-[0_0_15px_rgba(141,43,126,0.3)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Join Sprint
          </Link>
          <Link
            to="/create-sprint"
            onClick={onClose}
            className={`block py-3 px-4 rounded-xl transition-all font-medium ${
              isActive("/create-sprint")
                ? "bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] text-white shadow-[0_0_15px_rgba(141,43,126,0.3)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Create Sprint
          </Link>

        </nav>
        {/* Sign Out Button */}
        <div className="p-4 border-t border-[#8D2B7E]/20 bg-[#2D033B]/30">
          <button
            onClick={onSignOut}
            className="w-full py-3 px-4 bg-white/5 text-gray-300 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all flex items-center justify-center gap-2 font-medium border border-white/5 hover:border-red-500/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.414l-4.293 4.293a1 1 0 01-1.414 0L4 7.414 5.414 6l3.293 3.293L12 6l2 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Sign Out
          </button>
          <div className="mt-4 text-center">
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">DevHub v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
