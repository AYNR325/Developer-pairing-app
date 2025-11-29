import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import SprintSidebar from '@/components/SprintRoom/SprintSidebar';
import axios from 'axios';

const hasSprintEnded = (sprint) => {
  if (!sprint) return false;
  if (sprint.isFinished) return true;
  if (sprint.isActive === false) return true;
  return false;
};

function SprintTeams() {
  const { sprintId } = useParams();
  const navigate = useNavigate();
  const { userData } = useUser();
  const [sprintInfo, setSprintInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSprintData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/sprint/${sprintId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSprintInfo(res.data.sprint);
        if (hasSprintEnded(res.data.sprint)) {
          navigate(`/sprint/${sprintId}/end`);
        }
      } catch (err) {
        console.error('Failed to fetch sprint data', err);
      } finally {
        setLoading(false);
      }
    };

    if (sprintId) {
      fetchSprintData();
    }
  }, [sprintId, token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex">
        <SprintSidebar onNavigate={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8D2B7E]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row">
      {/* Mobile/Tablet Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile/tablet, visible on desktop */}
      <div className={`fixed lg:relative left-0 top-0 bottom-0 transform transition-transform duration-300 ease-in-out z-50 lg:z-auto ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <SprintSidebar onNavigate={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 w-full lg:w-auto">
        {/* Mobile/Tablet Header with Hamburger */}
        <div className="lg:hidden mb-4 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-gray-800 rounded-lg transition-colors z-50 relative"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <h1 className="text-2xl sm:text-3xl text-white font-bold">Team Members</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="ml-auto bg-[#8D2B7E] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[#A259C6] transition-colors text-xs sm:text-sm lg:hidden"
          >
            Back
          </button>
        </div>
        <h1 className="hidden lg:block text-2xl sm:text-3xl text-white font-bold mb-4 sm:mb-6">Team Members</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sprintInfo?.teamMembers?.map((member) => (
            <div
              key={member._id}
              className="bg-[#2D033B] rounded-lg p-4 sm:p-6 hover:bg-[#2D033B]/80 transition-colors"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8D2B7E] rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                  {member.username?.charAt(0)?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-bold text-base sm:text-lg truncate">{member.username}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">{member.role || "Member"}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Link 
                  to={`/user/${member._id}`}
                  className="block w-full bg-[#8D2B7E] text-white text-center py-2 rounded-lg hover:bg-[#A259C6] transition-colors text-sm sm:text-base"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
          
          {(!sprintInfo?.teamMembers || sprintInfo.teamMembers.length === 0) && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-base sm:text-lg">No team members yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SprintTeams;
