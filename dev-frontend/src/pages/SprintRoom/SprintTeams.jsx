import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import SprintSidebar from '@/components/SprintRoom/SprintSidebar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

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
          toast.info("Sprint has ended. Redirecting to summary.");
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
    <div className="h-screen bg-black flex flex-col lg:flex-row relative overflow-hidden font-sans selection:bg-[#FF96F5] selection:text-black">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#8D2B7E]/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-[#2D033B]/40 rounded-full blur-[120px]"></div>
      </div>

      {/* Mobile/Tablet Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile/tablet, visible on desktop */}
      <div className={`fixed lg:relative left-0 top-0 bottom-0 h-full transform transition-transform duration-300 ease-in-out z-50 lg:z-auto ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <SprintSidebar onNavigate={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 w-full lg:w-auto relative z-10 overflow-y-auto custom-scrollbar">
        {/* Mobile/Tablet Header with Hamburger */}
        <div className="lg:hidden mb-6 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors z-50 relative border border-white/10"
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
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Team Members</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="ml-auto bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] text-white px-4 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(141,43,126,0.5)] transition-all text-xs sm:text-sm lg:hidden font-medium"
          >
            Back
          </button>
        </div>
        <h1 className="hidden lg:block text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Team Members</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sprintInfo?.teamMembers?.map((member) => (
            <div
              key={member._id}
              className="bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#8D2B7E]/20 rounded-2xl p-4 sm:p-6 hover:border-[#8D2B7E]/50 transition-all hover:transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(141,43,126,0.2)] group"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#8D2B7E] to-[#2D033B] rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0 ring-2 ring-[#8D2B7E]/30 group-hover:ring-[#FF96F5] transition-all shadow-lg">
                  {member.username?.charAt(0)?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-bold text-lg sm:text-xl truncate group-hover:text-[#FF96F5] transition-colors">{member.username}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm bg-white/5 inline-block px-2 py-0.5 rounded-full mt-1 border border-white/5">{member.role || "Member"}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Link 
                  to={`/user/${member._id}`}
                  className="block w-full bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] text-white text-center py-2.5 rounded-xl hover:shadow-[0_0_15px_rgba(141,43,126,0.5)] transition-all text-sm sm:text-base font-medium"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
          
          {(!sprintInfo?.teamMembers || sprintInfo.teamMembers.length === 0) && (
            <div className="col-span-full text-center py-16 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#8D2B7E]/20 rounded-2xl border-dashed">
              <p className="text-gray-400 text-base sm:text-lg">No team members yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SprintTeams;
