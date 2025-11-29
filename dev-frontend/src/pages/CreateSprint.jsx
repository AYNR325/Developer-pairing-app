import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const isSprintEnded = (sprint) => {
  if (!sprint) return false;
  if (sprint.isFinished) return true;
  if (sprint.isActive === false) return true;
  return false;
};

function CreateSprint() {
  const { register, handleSubmit } = useForm();
  const [showForm, setshowForm] = useState(false);
  const { userData, loading } = useUser();
  const [mySprints, setMySprints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("active");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMySprints = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/sprint/user/list?scope=created&status=all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.sprints) {
          setMySprints(res.data.sprints);
        }
      } catch (e) {
        console.log("error while fetching user sprints", e);
      }
    };
    fetchMySprints();
  }, [token]);

  // Add loading and error handling
  if (loading) {
    return <div className="text-white bg-black h-screen flex items-center justify-center">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8D2B7E]"></div>
    <div className="text-white bg-black h-screen flex items-center justify-center"> Loading...</div>
    </div>
  }

  if (!userData) {
    return <div className="text-white bg-black h-screen flex-col items-center justify-center  p-10 ">
    <div className="text-white bg-black  flex justify-center   font-bold"> Please log in to continue</div>
    <div className="text-white bg-black  flex justify-center    font-bold">
    <Link to="/auth/login" className="text-[#8D2B7E] hover:underline">
            Go to Login
          </Link>
          </div>
    </div>
  }

  const filteredSprints = useMemo(() => {
    return mySprints.filter((sprint) => {
      if (statusFilter === "active") return !isSprintEnded(sprint);
      if (statusFilter === "ended") return isSprintEnded(sprint);
      return true;
    });
  }, [mySprints, statusFilter]);

  const onSubmit = async (data) => {
    console.log(data);
    const sprintData = {
      title: data.sprintName,
      description: data.sprintDescription,
      techStack: data.techStack, // This should be an array
      duration: Number(data.sprintDuration),
      startDate: data.sprintStartDate, // Use the actual selected date
      maxTeamSize: Number(data.teamSize),
      creator: userData._id,
    };
    console.log("Sprint data being sent:", sprintData);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/sprint`,
        sprintData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const sprintId = res.data.sprintId;
      navigate(`/sprint/${sprintId}/board`);
      // alert("welcome to sprint room");
      setshowForm(false);
    } catch (err) {
      console.error("Sprint creation failed", err);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profileForm');
    localStorage.removeItem('profileStep');
    localStorage.removeItem('profilePhoto');
    window.location.href = '/auth/login';
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {/* Header - Made Sticky */}
        <header className="bg-black border-b-2 border-[#FF96F5] p-3 sm:p-4 fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* Hamburger Menu Button - Mobile Only */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center text-white hover:bg-gray-800 rounded-lg transition-colors"
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
              <span className="text-[#8D2B7E] text-xl sm:text-2xl">&lt;/&gt;</span>
              <span className="text-[#8D2B7E] text-xl sm:text-2xl font-semibold">DevHub</span>
            </div>
            <div className="flex items-center space-x-4 sm:space-x-8">
              <nav className="hidden md:flex space-x-4 lg:space-x-6">
                <Link to="/dashboard" className="hover:text-[#8D2B7E] text-sm lg:text-base">Home</Link>
                <Link to="/network" className="hover:text-[#8D2B7E] text-sm lg:text-base">My Network</Link>
                <Link to="/chats" className="hover:text-[#8D2B7E] text-sm lg:text-base">Chats</Link>
              </nav>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#8D2B7E] rounded-full overflow-hidden flex items-center justify-center">
                {userData?.profilePicture ? (
                  <img 
                    src={`data:image/jpeg;base64,${userData.profilePicture}`}
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm sm:text-lg font-semibold">
                    {userData?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex pt-[60px] sm:pt-[73px]">
          {/* Sidebar - Made Sticky */}
          <aside className={`w-64 bg-[#8D2B7E] fixed left-0 top-[60px] sm:top-[73px] bottom-0 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}>
            <nav className="p-4 space-y-4 flex-grow">
              <Link to="/dashboard" onClick={() => setSidebarOpen(false)} className="block py-2 px-4 hover:bg-[#8D2B7E]/80 text-white rounded">
                Dashboard
              </Link>
              <Link to="/search" onClick={() => setSidebarOpen(false)} className="block py-2 px-4 hover:bg-[#8D2B7E]/80 text-white rounded">
                Search Developers
              </Link>
              <Link to="/join-sprint" onClick={() => setSidebarOpen(false)} className="block py-2 px-4 hover:bg-[#8D2B7E]/80 text-white rounded">
                Join Sprint
              </Link>
              <Link to="/create-sprint" onClick={() => setSidebarOpen(false)} className="block py-2 px-4 bg-[#8D2B7E] text-white rounded">
                Create Sprint
              </Link>
            </nav>
            {/* Sign Out Button */}
            <div className="p-4 border-t border-[#8D2B7E]/20">
              <button
                onClick={handleSignOut}
                className="w-full py-2 px-4 bg-[#111] text-white rounded hover:bg-[#222] transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.414l-4.293 4.293a1 1 0 01-1.414 0L4 7.414 5.414 6l3.293 3.293L12 6l2 1.414z" clipRule="evenodd" />
                </svg>
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Content - Added margin-left to account for fixed sidebar */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64">
            <div className="flex justify-end mb-4 sm:mb-6">
              <button
                className="bg-[#8D2B7E] text-white rounded-md px-3 sm:px-4 py-2 hover:bg-[#8D2B7E]/80 cursor-pointer text-sm sm:text-base"
                onClick={() => setshowForm(true)}
              >
                Create Sprint
              </button>
            </div>
            <div className="px-0 sm:px-4">
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
            {["active", "ended", "all"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                  statusFilter === status
                    ? "bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredSprints.map((sprint) => (
            <div
              key={sprint._id}
              className="bg-[#111] border-2 border-[#FF96F5] rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:shadow-lg text-white flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${isSprintEnded(sprint) ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-green-500/20 text-green-200 border border-green-500/30"}`}>
                  {isSprintEnded(sprint) ? "Ended" : "Active"}
                </div>
                {sprint.endDate && (
                  <p className="text-xs text-gray-400">
                    Ends {new Date(sprint.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="text-[#8D2B7E] font-semibold mb-2 text-xs sm:text-sm">
                  ~By {sprint.creator?.username || "user"}
                </div>
                <div className="font-bold text-base sm:text-lg mb-1">{sprint.title}</div>
                <div className="text-xs sm:text-sm mb-3 text-gray-400 line-clamp-2">
                  {sprint.description}
                </div>
              </div>

              <button className="bg-[#8D2B7E] text-white rounded-md px-3 sm:px-4 py-2 mt-auto hover:bg-[#8D2B7E]/80 transition text-sm sm:text-base w-full sm:w-auto" onClick={() => navigate(isSprintEnded(sprint) ? `/sprint/${sprint._id}/end` : `/sprint/${sprint._id}/board`)}>
                {isSprintEnded(sprint) ? "View Summary" : "View"}
              </button>
            </div>
          ))}
          {filteredSprints.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              No sprints in this filter.
            </div>
          )}
        </div>
            </div>
          </main>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-[#111] border-2 border-[#8D2B7E]/50 p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full space-y-4 sm:space-y-5 relative max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#8D2B7E]/30">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] bg-clip-text text-transparent">
                Create New Sprint
              </h2>
              <button
                type="button"
                className="text-gray-400 hover:text-white text-2xl sm:text-3xl font-bold transition-colors"
                onClick={() => setshowForm(false)}
              >
                ×
              </button>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#FF96F5] mb-2">
                Sprint Name
              </label>
              <input
                type="text"
                placeholder="Enter sprint name"
                {...register("sprintName", { required: true })}
                className="w-full px-4 py-2.5 bg-[#2D033B]/50 border border-[#8D2B7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D2B7E] text-white placeholder-gray-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#FF96F5] mb-2">
                Sprint Description
              </label>
              <textarea
                placeholder="Describe your sprint..."
                {...register("sprintDescription", { required: true })}
                rows={4}
                className="w-full px-4 py-2.5 bg-[#2D033B]/50 border border-[#8D2B7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D2B7E] text-white placeholder-gray-500 text-sm sm:text-base resize-none"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#FF96F5] mb-3">
                Tech Stack
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm bg-[#2D033B]/30 p-3 rounded-lg border border-[#8D2B7E]/20">
                <label className="flex items-center gap-2 text-white cursor-pointer hover:text-[#FF96F5] transition-colors">
                  <input
                    type="checkbox"
                    value="React"
                    {...register("techStack")}
                    className="w-4 h-4 text-[#8D2B7E] bg-[#2D033B] border-[#8D2B7E]/50 rounded focus:ring-[#8D2B7E] cursor-pointer"
                  />
                  <span>React</span>
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer hover:text-[#FF96F5] transition-colors">
                  <input
                    type="checkbox"
                    value="Node.js"
                    {...register("techStack")}
                    className="w-4 h-4 text-[#8D2B7E] bg-[#2D033B] border-[#8D2B7E]/50 rounded focus:ring-[#8D2B7E] cursor-pointer"
                  />
                  <span>Node.js</span>
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer hover:text-[#FF96F5] transition-colors">
                  <input
                    type="checkbox"
                    value="MongoDB"
                    {...register("techStack")}
                    className="w-4 h-4 text-[#8D2B7E] bg-[#2D033B] border-[#8D2B7E]/50 rounded focus:ring-[#8D2B7E] cursor-pointer"
                  />
                  <span>MongoDB</span>
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer hover:text-[#FF96F5] transition-colors">
                  <input
                    type="checkbox"
                    value="Python"
                    {...register("techStack")}
                    className="w-4 h-4 text-[#8D2B7E] bg-[#2D033B] border-[#8D2B7E]/50 rounded focus:ring-[#8D2B7E] cursor-pointer"
                  />
                  <span>Python</span>
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer hover:text-[#FF96F5] transition-colors">
                  <input
                    type="checkbox"
                    value="Express"
                    {...register("techStack")}
                    className="w-4 h-4 text-[#8D2B7E] bg-[#2D033B] border-[#8D2B7E]/50 rounded focus:ring-[#8D2B7E] cursor-pointer"
                  />
                  <span>Express</span>
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer hover:text-[#FF96F5] transition-colors">
                  <input
                    type="checkbox"
                    value="Tailwind"
                    {...register("techStack")}
                    className="w-4 h-4 text-[#8D2B7E] bg-[#2D033B] border-[#8D2B7E]/50 rounded focus:ring-[#8D2B7E] cursor-pointer"
                  />
                  <span>Tailwind</span>
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer hover:text-[#FF96F5] transition-colors">
                  <input
                    type="checkbox"
                    value="TypeScript"
                    {...register("techStack")}
                    className="w-4 h-4 text-[#8D2B7E] bg-[#2D033B] border-[#8D2B7E]/50 rounded focus:ring-[#8D2B7E] cursor-pointer"
                  />
                  <span>TypeScript</span>
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer hover:text-[#FF96F5] transition-colors">
                  <input
                    type="checkbox"
                    value="JavaScript"
                    {...register("techStack")}
                    className="w-4 h-4 text-[#8D2B7E] bg-[#2D033B] border-[#8D2B7E]/50 rounded focus:ring-[#8D2B7E] cursor-pointer"
                  />
                  <span>JavaScript</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#FF96F5] mb-2">
                Sprint Duration (days)
              </label>
              <input
                type="number"
                placeholder="e.g., 7"
                {...register("sprintDuration", { required: true })}
                className="w-full px-4 py-2.5 bg-[#2D033B]/50 border border-[#8D2B7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D2B7E] text-white placeholder-gray-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#FF96F5] mb-2">
                Sprint Start Date
              </label>
              <input
                type="date"
                {...register("sprintStartDate", { required: true })}
                className="w-full px-4 py-2.5 bg-[#2D033B]/50 border border-[#8D2B7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D2B7E] text-white text-sm sm:text-base [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#FF96F5] mb-2">
                Max Team Size
              </label>
              <input
                type="number"
                placeholder="e.g., 5"
                {...register("teamSize", { required: true })}
                className="w-full px-4 py-2.5 bg-[#2D033B]/50 border border-[#8D2B7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D2B7E] text-white placeholder-gray-500 text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white rounded-lg px-4 py-3 hover:from-[#A259C6] hover:to-[#FF96F5] transition-all text-sm sm:text-base font-semibold shadow-lg mt-2"
            >
              Create Sprint
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default CreateSprint;
