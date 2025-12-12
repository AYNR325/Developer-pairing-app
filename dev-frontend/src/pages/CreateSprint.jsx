import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
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
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />
        <div className="flex pt-[60px] sm:pt-[73px]">
          {/* Sidebar - Made Sticky */}
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            onSignOut={handleSignOut} 
          />

          {/* Main Content - Added margin-left to account for fixed sidebar */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64">
            <div className="flex justify-end mb-8 sm:mb-10">
              <button
                className="group relative bg-[#8D2B7E] text-white rounded-xl px-6 py-3 hover:bg-[#A259C6] transition-all text-sm sm:text-base font-bold shadow-[0_0_20px_rgba(141,43,126,0.3)] hover:shadow-[0_0_25px_rgba(141,43,126,0.6)] overflow-hidden"
                onClick={() => setshowForm(true)}
              >
                 <span className="relative z-10 flex items-center gap-2">
                   <span>+</span> Create Sprint
                 </span>
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              </button>
            </div>
            <div className="px-0 sm:px-4">
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-8 sm:mb-10 p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 w-fit">
              {["active", "ended", "all"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    statusFilter === status
                      ? "bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white shadow-lg shadow-purple-900/40 transform scale-105"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
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
              className="group bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#8D2B7E]/20 rounded-3xl p-6 hover:border-[#8D2B7E]/50 transition-all hover:shadow-[0_0_20px_rgba(141,43,126,0.15)] flex flex-col h-full relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#8D2B7E]/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-[#8D2B7E]/20"></div>

              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isSprintEnded(sprint) ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
                  {isSprintEnded(sprint) ? "● Ended" : "● Active"}
                </div>
                {sprint.endDate && (
                  <p className="text-xs text-gray-400 font-medium bg-black/20 px-2 py-1 rounded-lg">
                    Ends {new Date(sprint.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex-1 flex flex-col relative z-10">
                 <div className="flex items-center gap-2 mb-3">
                     <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8D2B7E] to-[#2D033B] flex items-center justify-center text-[10px] font-bold ring-1 ring-[#8D2B7E]/30">
                      {sprint.creator?.username?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="text-gray-400 text-xs font-medium">
                      {sprint.creator?.username || "user"}
                    </div>
                  </div>
                <div className="font-bold text-lg mb-2 text-white group-hover:text-[#FF96F5] transition-colors">{sprint.title}</div>
                <div className="text-sm mb-4 text-gray-400 line-clamp-2 leading-relaxed">
                  {sprint.description}
                </div>
              </div>

              <button className="bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] text-white rounded-xl px-4 py-3 mt-auto hover:shadow-[0_0_15px_rgba(141,43,126,0.4)] transition-all text-sm font-bold w-full relative z-10" onClick={() => navigate(isSprintEnded(sprint) ? `/sprint/${sprint._id}/end` : `/sprint/${sprint._id}/board`)}>
                {isSprintEnded(sprint) ? "View Summary" : "View Board →"}
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-[#1a1a1a] border border-[#8D2B7E]/30 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-lg w-full space-y-6 relative max-h-[90vh] overflow-y-auto"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#8D2B7E]/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#8D2B7E]/20 relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] bg-clip-text text-transparent">
                Create New Sprint
              </h2>
              <button
                type="button"
                className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
                onClick={() => setshowForm(false)}
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm font-bold text-[#FF96F5] mb-2 pl-1">
                  Sprint Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Q4 Feature Implementation"
                  {...register("sprintName", { required: true })}
                  className="w-full px-4 py-3 bg-[#0a0a0a]/50 border border-[#8D2B7E]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8D2B7E] focus:border-transparent text-white placeholder-gray-600 transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#FF96F5] mb-2 pl-1">
                  Sprint Description
                </label>
                <textarea
                  placeholder="What are the main goals of this sprint?"
                  {...register("sprintDescription", { required: true })}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0a0a0a]/50 border border-[#8D2B7E]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8D2B7E] focus:border-transparent text-white placeholder-gray-600 transition-all resize-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#FF96F5] mb-2 pl-1">
                  Tech Stack
                </label>
                <div className="grid grid-cols-2 gap-3 bg-[#0a0a0a]/30 p-4 rounded-xl border border-[#8D2B7E]/20">
                  {['React', 'Node.js', 'MongoDB', 'Python', 'Express', 'Tailwind', 'TypeScript', 'JavaScript'].map((tech) => (
                     <label key={tech} className="flex items-center gap-3 text-gray-300 cursor-pointer hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          value={tech}
                          {...register("techStack")}
                          className="peer appearance-none w-5 h-5 border border-[#8D2B7E]/50 rounded checked:bg-[#8D2B7E] checked:border-[#8D2B7E] transition-all cursor-pointer"
                        />
                         <svg className="absolute w-3.5 h-3.5 text-white hidden peer-checked:block pointer-events-none left-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="font-medium text-sm">{tech}</span>
                    </label>
                  ))}
                </div>
              </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#FF96F5] mb-2 pl-1">
                    Duration (days)
                  </label>
                   <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g., 14"
                      {...register("sprintDuration", { required: true })}
                      className="w-full px-4 py-3 bg-[#0a0a0a]/50 border border-[#8D2B7E]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8D2B7E] text-white placeholder-gray-600 transition-all font-medium pl-10"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">⏳</span>
                   </div>
                </div>
                 <div>
                  <label className="block text-sm font-bold text-[#FF96F5] mb-2 pl-1">
                    Max Team Size
                  </label>
                   <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g., 5"
                      {...register("teamSize", { required: true })}
                      className="w-full px-4 py-3 bg-[#0a0a0a]/50 border border-[#8D2B7E]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8D2B7E] text-white placeholder-gray-600 transition-all font-medium pl-10"
                    />
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">👥</span>
                   </div>
                </div>
               </div>
               
               <div>
                  <label className="block text-sm font-bold text-[#FF96F5] mb-2 pl-1">
                    Start Date
                  </label>
                   <input
                    type="date"
                    {...register("sprintStartDate", { required: true })}
                    className="w-full px-4 py-3 bg-[#0a0a0a]/50 border border-[#8D2B7E]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8D2B7E] text-white [color-scheme:dark] transition-all font-medium cursor-pointer uppercase text-sm tracking-wider"
                  />
               </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white rounded-xl px-6 py-4 hover:from-[#A259C6] hover:to-[#FF96F5] transition-all text-base font-bold shadow-[0_4px_20px_rgba(141,43,126,0.4)] hover:shadow-[0_6px_25px_rgba(141,43,126,0.6)] transform hover:-translate-y-0.5 mt-4"
              >
                🚀 Launch Sprint
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default CreateSprint;
