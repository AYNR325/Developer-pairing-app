import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import SprintSidebar from "@/components/SprintRoom/SprintSidebar";
import { toast, ToastContainer } from "react-toastify";
const hasSprintEnded = (sprint) => {
  if (!sprint) return false;
  if (sprint.isFinished) return true;
  if (sprint.isActive === false) return true;
  return false;
};

function SprintHome() {
  const [sprintInfo, setSprintInfo] = useState();
  const [requests, setRequests] = useState([]);
  const [resources, setResources] = useState([]);
  const [isEditingResources, setIsEditingResources] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editResources, setEditResources] = useState({
    github: "",
    figma: "",
    docs: "",
    extraLinks: [""],
  });
  const token = localStorage.getItem("token");
  const { sprintId } = useParams();
  const navigate = useNavigate();
  const { userData } = useUser(); // Get current user data
  
  // Check if current user is the sprint owner
  const isOwner =
    userData?._id &&
    (sprintInfo?.creator?._id || sprintInfo?.creator)?.toString() ===
      userData._id.toString();
  
  console.log("User ID:", userData?._id);
  console.log("Sprint Creator ID:", sprintInfo?.creator);
  console.log("Sprint Info:", sprintInfo);
  console.log("Is Owner:", isOwner);
  console.log(sprintId);

  useEffect(() => {
    fetchSprintData();
  }, [sprintId, navigate]);
  
  // Fetch requests when sprintInfo is loaded and user is owner
  useEffect(() => {
    if (sprintInfo && isOwner) {
      fetchJoinRequests();
    }
  }, [sprintInfo, isOwner]);

  const fetchSprintData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/sprint/${sprintId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data.sprint);
      setSprintInfo(res.data.sprint);
    if (hasSprintEnded(res.data.sprint)) {
        navigate(`/sprint/${sprintId}/end`);
      }
    } catch (err) {
      console.error("Failed to fetch sprint data", err);
    }
  };
  
  const fetchJoinRequests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/sprint/${sprintId}/join-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Join requests:", res.data.joinRequests);
      setRequests(res.data.joinRequests || []);

    } catch (e) {
      console.log("Error fetching join requests", e);
    }
  }

  const handleJoinRequest = async (requestId, status)=>{
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/sprint/${sprintId}/handle-request`, { requestId, status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // alert(res.data.message);
      toast.success(res.data.message);
      // Refresh requests list immediately after handling
    fetchJoinRequests();
    } catch (e) {
      console.log("Error handling join request", e);
    }
  }

  // console.log(sprintInfo);
  console.log(requests);

  // Calculate countdown timer
  const getCountdownTimer = () => {
    if (!sprintInfo?.endDate) return "N/A";
    const endDate = new Date(sprintInfo.endDate);
    const now = new Date();
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days Left` : "Sprint Ended";
  };

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row">
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
      theme="dark" />
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
          <h1 className="text-xl font-bold text-white">Sprint Home</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="ml-auto bg-[#8D2B7E] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[#A259C6] transition-colors text-xs sm:text-sm lg:hidden"
          >
            Back
          </button>
        </div>
        {/* Debug Info - Remove in production */}
        {/* <div className="mb-4 p-3 bg-gray-800 rounded-lg text-sm">
          <p className="text-white">Debug Info:</p>
          <p className="text-gray-300">User ID: {userData?._id}</p>
          <p className="text-gray-300">Creator ID: {sprintInfo?.creator?._id}</p>
          <p className="text-gray-300">Is Owner: {isOwner ? "Yes" : "No"}</p>
        </div> */}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Sprint Info Card */}
          <div className="bg-[#2D033B] rounded-lg p-4 sm:p-6 col-span-1">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3">
              <h2 className="text-white font-bold text-lg sm:text-xl">Sprint Info</h2>
              <button className="bg-[#8D2B7E] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#A259C6] transition-colors text-sm sm:text-base w-full sm:w-auto">
                Invite Link
              </button>
            </div>
            {sprintInfo && (
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm sm:text-base">Duration:</span>
                  <span className="text-white font-medium text-sm sm:text-base">{sprintInfo.duration || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm sm:text-base">Start Date:</span>
                  <span className="text-white font-medium text-sm sm:text-base">
                    {sprintInfo.startDate ? new Date(sprintInfo.startDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm sm:text-base">Countdown Timer:</span>
                  <span className="text-[#8D2B7E] font-bold text-sm sm:text-base">{getCountdownTimer()}</span>
                </div>
                <div className="flex justify-between items-center flex-wrap gap-1">
                  <span className="text-gray-300 text-sm sm:text-base">Tech Stack:</span>
                  <span className="text-white font-medium text-xs sm:text-base text-right">{sprintInfo.techStack.join(", ") || "N/A"}</span>
                </div>
              </div>
            )}
          </div>

          {/* Team List Card */}
          <div className="bg-[#2D033B] rounded-lg p-4 sm:p-6 col-span-1">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <h2 className="text-white font-bold text-lg sm:text-xl">Team List</h2>
              <Link to={`/sprint/${sprintId}/teams`} className="text-[#8D2B7E] hover:text-[#A259C6] text-sm">
                View More &gt;&gt;
              </Link>
            </div>
            {sprintInfo?.teamMembers?.length > 0 ? (
              <div className="space-y-2.5 sm:space-y-3">
                {sprintInfo.teamMembers.slice(0, 3).map((member) => (
                  <div key={member._id} className="flex justify-between items-center">
                    <Link 
                      to={`/user/${member._id}`}
                      className="text-white hover:text-[#8D2B7E] transition-colors text-sm sm:text-base"
                    >
                      {member.username}
                    </Link>
                    <span className="text-[#8D2B7E] text-xs sm:text-sm">
                      {member.role || "Member"}
                    </span>
                  </div>
                ))}
                {sprintInfo.teamMembers.length > 3 && (
                  <p className="text-gray-400 text-xs sm:text-sm">
                    +{sprintInfo.teamMembers.length - 3} more members
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-sm sm:text-base">No team members yet</p>
            )}
          </div>

          {/* Description Card */}
          <div className="bg-[#2D033B] rounded-lg p-4 sm:p-6 col-span-1 sm:col-span-2">
            <h2 className="text-white font-bold text-lg sm:text-xl mb-3 sm:mb-4">Description</h2>
            <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4 min-h-[80px] sm:min-h-[100px]">
              {sprintInfo?.description ? (
                <p className="text-white text-sm sm:text-base">{sprintInfo.description}</p>
              ) : (
                <p className="text-gray-400 italic text-sm sm:text-base">No description provided</p>
              )}
            </div>
          </div>

          {/* Requests Card - Only show to sprint owner */}
          {isOwner && (
            <div className="bg-[#2D033B] rounded-lg p-4 sm:p-6 col-span-1 sm:col-span-2">
              <h2 className="text-white font-bold text-lg sm:text-xl mb-3 sm:mb-4">Requests</h2>
              {requests.length > 0 ? (
                <div className="space-y-3">
                  {requests.map((req) => (
                    <div key={req._id} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs sm:text-sm">
                            {req.user.username?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link 
                            to={`/user/${req.user._id}`}
                            className="text-white hover:text-[#8D2B7E] transition-colors font-medium text-sm sm:text-base block truncate"
                          >
                            {req.user.username}
                          </Link>
                          <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mt-0.5">{req.message}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                          onClick={() => handleJoinRequest(req._id, "rejected")} 
                          className="bg-transparent border border-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm flex-1 sm:flex-initial"
                        >
                          Ignore
                        </button>
                        <button 
                          onClick={() => handleJoinRequest(req._id, "accepted")} 
                          className="bg-[#8D2B7E] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#A259C6] transition-colors text-xs sm:text-sm flex-1 sm:flex-initial"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4 text-sm sm:text-base">No pending requests</p>
              )}
            </div>
          )}

          {/* Resources Card */}
          <div className="bg-[#2D033B] rounded-lg p-4 sm:p-6 col-span-1 sm:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <h2 className="text-white font-bold text-lg sm:text-xl">Resources</h2>
              {/* Only show edit button to sprint owner */}
              {isOwner && (
                <button
                  className="text-[#8D2B7E] hover:text-[#A259C6] transition-colors font-medium"
                  onClick={() => {
                    setEditResources({
                      github: sprintInfo?.resources?.github || "",
                      figma: sprintInfo?.resources?.figma || "",
                      docs: sprintInfo?.resources?.docs || "",
                      extraLinks: sprintInfo?.resources?.extraLinks?.length
                        ? [...sprintInfo.resources.extraLinks]
                        : [""],
                    });
                    setIsEditingResources(true);
                  }}
                >
                  + Edit
                </button>
              )}
            </div>
            {!isEditingResources ? (
              <div className="space-y-2.5 sm:space-y-3">
                {sprintInfo?.resources?.github && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
                    <span className="text-gray-300 text-sm sm:text-base">Github Repo:</span>
                    <a 
                      href={sprintInfo.resources.github} 
                      className="text-blue-400 hover:underline text-xs sm:text-sm break-all" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {sprintInfo.resources.github}
                    </a>
                  </div>
                )}
                {sprintInfo?.resources?.figma && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
                    <span className="text-gray-300 text-sm sm:text-base">Figma Design:</span>
                    <a 
                      href={sprintInfo.resources.figma} 
                      className="text-blue-400 hover:underline text-xs sm:text-sm break-all" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {sprintInfo.resources.figma}
                    </a>
                  </div>
                )}
                {sprintInfo?.resources?.docs && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
                    <span className="text-gray-300 text-sm sm:text-base">Docs:</span>
                    <a 
                      href={sprintInfo.resources.docs} 
                      className="text-blue-400 hover:underline text-xs sm:text-sm break-all" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {sprintInfo.resources.docs}
                    </a>
                  </div>
                )}
                {sprintInfo?.resources?.extraLinks?.length > 0 &&
                  sprintInfo.resources.extraLinks.map((link, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
                      <span className="text-gray-300 text-sm sm:text-base">Extra Link:</span>
                      <a 
                        href={link} 
                        className="text-blue-400 hover:underline text-xs sm:text-sm break-all" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {link}
                      </a>
                    </div>
                  ))}
                {!sprintInfo?.resources?.github &&
                  !sprintInfo?.resources?.figma &&
                  !sprintInfo?.resources?.docs &&
                  (!sprintInfo?.resources?.extraLinks || sprintInfo.resources.extraLinks.length === 0) && (
                    <p className="text-gray-400 text-center py-4 text-sm sm:text-base">No resources added yet</p>
                  )}
              </div>
            ) : (
              // Edit form below - only show to owner
              isOwner && (
                <ResourceEditForm
                  editResources={editResources}
                  setEditResources={setEditResources}
                  setIsEditingResources={setIsEditingResources}
                  sprintId={sprintId}
                  setSprintInfo={setSprintInfo}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SprintHome;



function ResourceEditForm({editResources,setEditResources,setIsEditingResources,sprintId,setSprintInfo}) {
    const token=localStorage.getItem("token");
    const handleChange = (e) => {
        setEditResources({ ...editResources, [e.target.name]: e.target.value });
      };
    
      const handleExtraLinkChange = (idx, value) => {
        const newLinks = [...editResources.extraLinks];
        newLinks[idx] = value;
        setEditResources({ ...editResources, extraLinks: newLinks });
      };
    
      const addExtraLink = () => {
        setEditResources({ ...editResources, extraLinks: [...editResources.extraLinks, ""] });
      };
    
      const removeExtraLink = (idx) => {
        const newLinks = editResources.extraLinks.filter((_, i) => i !== idx);
        setEditResources({ ...editResources, extraLinks: newLinks });
      };
      const handleSave = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/sprint/${sprintId}/resources`,
            editResources,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setSprintInfo((prev) => ({
            ...prev,
            resources: { ...editResources },
          }));
          setIsEditingResources(false);
        } catch (err) {
          // alert("Failed to update resources");
          toast.error("Failed to update resources");
        }
      };
  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Github Repo Link</label>
          <input
            type="text"
            name="github"
            placeholder="https://github.com/username/repo"
            value={editResources.github}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#8D2B7E] focus:outline-none"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm mb-2">Figma Design Link</label>
          <input
            type="text"
            name="figma"
            placeholder="https://figma.com/design/..."
            value={editResources.figma}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#8D2B7E] focus:outline-none"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm mb-2">Docs Link</label>
          <input
            type="text"
            name="docs"
            placeholder="https://docs.example.com"
            value={editResources.docs}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#8D2B7E] focus:outline-none"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm mb-2">Extra Links</label>
          {editResources.extraLinks.map((link, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={link}
                onChange={(e) => handleExtraLinkChange(idx, e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#8D2B7E] focus:outline-none"
                placeholder={`Extra Link #${idx + 1}`}
              />
              <button
                type="button"
                onClick={() => removeExtraLink(idx)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={editResources.extraLinks.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addExtraLink}
            className="text-[#8D2B7E] hover:text-[#A259C6] transition-colors text-sm"
          >
            + Add Extra Link
          </button>
        </div>
      </div>
      
      <div className="flex gap-3 pt-4">
        <button 
          type="submit" 
          className="bg-[#8D2B7E] text-white px-6 py-2 rounded-lg hover:bg-[#A259C6] transition-colors"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => setIsEditingResources(false)}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}



