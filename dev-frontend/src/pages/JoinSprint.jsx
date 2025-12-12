// import React, { useState, useEffect } from "react";
// import { useUser } from "@/context/UserContext";
// import axios from "axios";

// function JoinSprint() {
//   const [sprints, setSprints] = useState([]);
//   const [selectedSprint, setSelectedSprint] = useState(null);
//   const [note, setNote] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [requestedSprints, setRequestedSprints] = useState([]);
//   const [joinStatus, setJoinStatus] = useState("none");
//   const [sprintStatuses, setSprintStatuses] = useState({});

//   const { userData, loading } = useUser();

//   const token = localStorage.getItem("token");
//   useEffect(() => {
//     const fetchSprints = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/api/sprint", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (res.data.sprints) {
//           console.log(res.data.sprints);
//           setSprints(res.data.sprints);
//         }
//       } catch (e) {
//         console.log("error while fetching all sprints", e);
//       }
//     };
//     const fetchJoinRequests = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/api/sprint/join-requests", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log("Join requests:", res.data);
//         if (res.data.sprintIds) {
//           setRequestedSprints(res.data.sprintIds);
//         }
//       } catch (e) {
//         console.log("Error fetching join requests:", e);
//       }
//     };
//     fetchSprints();
//     fetchJoinRequests();
//   }, []);


//   // Add loading and error handling
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!userData) {
//     return <div>Please log in to create a sprint</div>;
//   }

//   //filter the sprints show  the sprints of all the user except created by logged in user
//   const mySprints = sprints.filter(
//     (sprint) => sprint.creator.username != userData.username
//   );

//   // Handle Open Modal
//   const handleOpenModal = (sprint) => {
//     setSelectedSprint(sprint);
//     setNote("");
//     setIsModalOpen(true);
//   };

//   const fetchJoinStatus = async () => {
//   try {
//     const res = await axios.get(
//       `http://localhost:3000/api/sprint/${selectedSprint._id}/join-status`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setJoinStatus(res.data.status);
//   } catch (e) {
//     console.log("Error fetching join status", e);
//   }
// };
  

//   // Handle Join Request
//   const handleJoinRequest = async () => {
//     try {
//       const res = await axios.patch(`http://localhost:3000/api/sprint/${selectedSprint._id}/join`, { message: note }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data.message) {
//         alert(res.data.message);
//         setJoinStatus("pending");
//       }
//       // Immediately update local state (optimistic UI)
//       // setRequestedSprints((prev) => [...prev, selectedSprint._id]);
//       setRequestedSprints((prev) => prev.includes(selectedSprint._id) ? prev : [...prev, selectedSprint._id]);
//       console.log("Join request sent successfully");
//       setIsModalOpen(false);
//     } catch (e) {
//       console.log("error while sending join request", e);
//     }
//   };


//   return (
//     // <div className="bg-black min-h-screen">
//     //   <div className="grid grid-cols-3 gap-6 bg-black  ">
//     //   {mySprints.map((sprint) => (
//     //         <div
//     //           key={sprint._id}
//     //           className="bg-[#111] border-2 border-[#FF96F5] rounded-3xl p-6 m-2 hover:shadow-lg text-white"
//     //         >
//     //           <div>
//     //             <div className="text-[#8D2B7E] font-semibold mb-2">
//     //               ~By {sprint.creator?.username || "user"}
//     //             </div>
//     //             <div className="font-bold text-lg mb-1">{sprint.title}</div>
//     //             <div className="text-sm mb-3 text-gray-400">
//     //               {sprint.description}
//     //             </div>
//     //           </div>

//     //           <div className="flex justify-between">
//     //           <button className="bg-[#8D2B7E] text-white rounded-md px-4 py-2 mt-4 hover:bg-[#8D2B7E]/80 transition">
//     //             View
//     //           </button>

//     //           {requestedSprints.includes(sprint._id) ? (
//     //             <button
//     //               disabled
//     //               className="bg-gray-600 text-white rounded-md px-4 py-2 mt-4 cursor-not-allowed"
//     //             >
//     //               Request Sent
//     //             </button>
//     //           ) : (
//     //           <button  onClick={() => handleOpenModal(sprint)} className="bg-[#8D2B7E] text-white rounded-md px-4 py-2 mt-4 hover:bg-[#8D2B7E]/80 transition">
//     //             Join
//     //           </button>
//     //           )}
//     //           </div>
//     //         </div>
//     //       ))}
//     //   </div>

//     //   {/* Modal for adding a note/message */}
//     //   {isModalOpen && (
//     //     <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//     //     <div className="bg-white rounded-xl p-6 max-w-md w-full text-black">
//     //       <h2 className="text-xl font-semibold mb-4">Send a Note to Creator</h2>
//     //       <textarea
//     //         className="w-full border p-3 rounded-lg focus:outline-none"
//     //         rows={4}
//     //         placeholder="Why are you a good fit for this sprint?"
//     //         value={note}
//     //         onChange={(e) => setNote(e.target.value)}
//     //       ></textarea>

//     //       <div className="mt-4 flex justify-end space-x-4">
//     //         <button
//     //           onClick={() => setIsModalOpen(false)}
//     //           className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//     //         >
//     //           Cancel
//     //         </button>
//     //         <button
//     //           onClick={handleJoinRequest}
//     //           className="px-4 py-2 bg-[#8D2B7E] text-white rounded hover:bg-[#8D2B7E]/80"
//     //         >
//     //           Send Request
//     //         </button>
//     //       </div>
//     //     </div>
//     //   </div>
    
//     //   )}
//     // </div>
//     <div className="bg-black min-h-screen">
//   <div className="grid grid-cols-3 gap-6 bg-black">
//     {mySprints.map((sprint) => {
//       const status = sprintStatuses[sprint._id] || "none"; // none | pending | accepted | rejected

//       const renderButton = () => {
//         switch (status) {
//           case "none":
//             return (
//               <button
//                 onClick={() => handleOpenModal(sprint)}
//                 className="bg-[#8D2B7E] text-white rounded-md px-4 py-2 mt-4 hover:bg-[#8D2B7E]/80 transition"
//               >
//                 Join
//               </button>
//             );
//           case "pending":
//             return (
//               <button
//                 disabled
//                 className="bg-gray-600 text-white rounded-md px-4 py-2 mt-4 cursor-not-allowed"
//               >
//                 Request Sent
//               </button>
//             );
//           case "accepted":
//             return (
//               <button
//                 onClick={() => navigate(`/sprint/${sprint._id}/board`)}
//                 className="bg-green-600 text-white rounded-md px-4 py-2 mt-4 hover:bg-green-500 transition"
//               >
//                 Accepted - Go to Board
//               </button>
//             );
//           case "rejected":
//             return (
//               <button
//                 onClick={() => handleOpenModal(sprint)}
//                 className="bg-[#8D2B7E] text-white rounded-md px-4 py-2 mt-4 hover:bg-[#8D2B7E]/80 transition"
//               >
//                 Join
//               </button>
//             );
//           default:
//             return null;
//         }
//       };

//       return (
//         <div
//           key={sprint._id}
//           className="bg-[#111] border-2 border-[#FF96F5] rounded-3xl p-6 m-2 hover:shadow-lg text-white"
//         >
//           <div>
//             <div className="text-[#8D2B7E] font-semibold mb-2">
//               ~By {sprint.creator?.username || "user"}
//             </div>
//             <div className="font-bold text-lg mb-1">{sprint.title}</div>
//             <div className="text-sm mb-3 text-gray-400">
//               {sprint.description}
//             </div>
//           </div>

//           <div className="flex justify-between">
//             <button className="bg-[#8D2B7E] text-white rounded-md px-4 py-2 mt-4 hover:bg-[#8D2B7E]/80 transition">
//               View
//             </button>
//             {renderButton()}
//           </div>
//         </div>
//       );
//     })}
//   </div>

//   {/* Modal for adding a note/message */}
//   {isModalOpen && (
//     <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl p-6 max-w-md w-full text-black">
//         <h2 className="text-xl font-semibold mb-4">Send a Note to Creator</h2>
//         <textarea
//           className="w-full border p-3 rounded-lg focus:outline-none"
//           rows={4}
//           placeholder="Why are you a good fit for this sprint?"
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//         ></textarea>

//         <div className="mt-4 flex justify-end space-x-4">
//           <button
//             onClick={() => setIsModalOpen(false)}
//             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleJoinRequest}
//             className="px-4 py-2 bg-[#8D2B7E] text-white rounded hover:bg-[#8D2B7E]/80"
//           >
//             Send Request
//           </button>
//         </div>
//       </div>
//     </div>
//   )}
// </div>

//   );
// }

// export default JoinSprint;


import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
function JoinSprint() {
  const [sprints, setSprints] = useState([]);
  const [joinedSprints, setJoinedSprints] = useState([]);
  const [joinedFilter, setJoinedFilter] = useState("active");
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [note, setNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestedSprints, setRequestedSprints] = useState([]); // sprint IDs where user has pending requests
  const [sprintStatuses, setSprintStatuses] = useState({}); // { [sprintId]: "none"|"pending"|"accepted"|"rejected" }
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'ai'
  const [aiSprintMatches, setAiSprintMatches] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSprintForView, setSelectedSprintForView] = useState(null);

  const { userData, loading } = useUser();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch list of sprints and user's join-requests on mount
  useEffect(() => {
    if (!token || !userData) return;
    const fetchSprints = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/sprint`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.sprints) {
          setSprints(res.data.sprints);
        }
      } catch (e) {
        console.error("error while fetching all sprints", e);
      }
    };

    const fetchUserJoinRequests = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/sprint/join-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.sprintIds) {
          // Normalize to strings
          setRequestedSprints(res.data.sprintIds.map((id) => id.toString()));
        }
      } catch (e) {
        console.error("Error fetching join requests:", e);
      }
    };

    const fetchJoinedSprints = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/sprint/user/list?scope=joined&status=all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.sprints) {
          const filtered = res.data.sprints.filter(
            (s) =>
              (s.creator?._id || s.creator)?.toString() !==
              (userData?._id || "").toString()
          );
          setJoinedSprints(filtered);
        }
      } catch (e) {
        console.error("Error fetching joined sprints", e);
      }
    };

    fetchSprints();
    fetchUserJoinRequests();
    fetchJoinedSprints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userData]); // run when auth/user ready

  // Fetch AI sprint recommendations
  const fetchAISprintMatches = async () => {
    if (!userData) return;
    setAiLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/match/ai/sprints?userId=${userData._id}`);
      if (res.data.success) {
        setAiSprintMatches(res.data.matches || []);
      }
    } catch (err) {
      console.error('Error fetching AI sprint matches:', err);
    } finally {
      setAiLoading(false);
    }
  };

  // Fetch AI matches when userData is available
  useEffect(() => {
    if (userData) {
      fetchAISprintMatches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  // Helper: compute statuses for all "other" sprints (not created by current user)
  const fetchStatuses = useCallback(async () => {
    if (!userData || sprints.length === 0) return;
    const statuses = {};

    // compute the sprints we want statuses for (exclude those created by the user)
    const others = sprints.filter(
      (s) =>
        (s.creator?._id || s.creator)?.toString() !==
        (userData?._id || "").toString()
    );

    try {
      await Promise.all(
        others.map(async (s) => {
          const sprintId = String(s._id);
          try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/sprint/${sprintId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const detail = res.data.sprint;

            // Determine if user is a team member
            const userId = String(userData._id || userData.id || userData._id);
            let status = "none";

            // teamMembers may be populated (objects) or ids
            const teamMembers = Array.isArray(detail.teamMembers) ? detail.teamMembers : [];
            const memberIds = teamMembers.map((m) => (typeof m === "string" ? m : String(m._id || m)));
            if (memberIds.includes(userId)) {
              status = "accepted";
            } else {
              // check joinRequests subdocument (each has user:ObjectId and maybe status)
              const jrs = Array.isArray(detail.joinRequests) ? detail.joinRequests : [];
              const found = jrs.find((r) => String(r.user) === userId);
              if (found) {
                // if joinRequests store a status, use it, else treat as pending
                status = found.status || "pending";
              } else {
                // as fallback, if the sprint id exists in requestedSprints (from global endpoint), mark pending
                if (requestedSprints.includes(sprintId)) {
                  status = "pending";
                } else {
                  status = "none";
                }
              }
            }

            statuses[sprintId] = status;
          } catch (err) {
            // If single sprint fetch fails, keep it as none
            statuses[sprintId] = statuses[sprintId] || "none";
          }
        })
      );

      setSprintStatuses((prev) => ({ ...prev, ...statuses }));
    } catch (e) {
      console.error("Error computing sprint statuses:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprints, userData, requestedSprints, token]);

  // When sprints or user data changes, compute statuses. Also poll so creator actions reflect quickly.
  useEffect(() => {
    fetchStatuses();
    const interval = setInterval(() => {
      fetchStatuses();
    }, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [sprints, userData, fetchStatuses]);

  // filter the sprints show the sprints of all the user except created by logged in user
  const mySprints = sprints.filter(
    (sprint) =>
      (sprint.creator?._id || sprint.creator)?.toString() !==
      (userData?._id || "").toString()
  );

  const isSprintEnded = (sprint) => {
    if (!sprint) return false;
    if (sprint.isFinished) return true;
    if (sprint.isActive === false) return true;
    return false;
  };

  const filteredJoinedSprints = joinedSprints.filter((sprint) => {
    if (joinedFilter === "active") return !isSprintEnded(sprint);
    if (joinedFilter === "ended") return isSprintEnded(sprint);
    return true;
  });

  // Handle Open Modal
  const handleOpenModal = (sprint) => {
    setSelectedSprint(sprint);
    setNote("");
    setIsModalOpen(true);
  };

  // Handle Open View Modal
  const handleOpenViewModal = async (sprint) => {
    try {
      // Fetch full sprint details
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/sprint/${sprint._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedSprintForView(res.data.sprint);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error("Error fetching sprint details:", err);
      // alert("Failed to load sprint details");
      toast.error("Failed to load sprint details");
    }
  };

  // Handle Join Request: send request to backend and optimistically update status
  const handleJoinRequest = async () => {
    if (!selectedSprint) return;
    try {
      const sprintId = String(selectedSprint._id);
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/sprint/${sprintId}/join`,
        { message: note },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.message) {
        // optimistic UI update
        setSprintStatuses((prev) => ({ ...prev, [sprintId]: "pending" }));
        setRequestedSprints((prev) => (prev.includes(sprintId) ? prev : [...prev, sprintId]));
        // alert(res.data.message);
        toast.success(res.data.message);
      }

      setIsModalOpen(false);
    } catch (e) {
      console.error("error while sending join request", e);
      const msg = e?.response?.data?.message || "Failed to send request";
      // alert(msg);
      toast.error(msg);
    }
  };

  // Render safe button for each sprint
  const renderButton = (sprint) => {
    const sprintId = String(sprint._id);
    const status = sprintStatuses[sprintId] || "none";

    switch (status) {
      case "none":
        return (
          <button
            onClick={() => handleOpenModal(sprint)}
            className="bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] text-white rounded-xl px-4 py-2 hover:shadow-[0_0_15px_rgba(141,43,126,0.4)] transition-all text-sm font-bold w-full sm:w-auto whitespace-nowrap"
          >
            Join Sprint
          </button>
        );
      case "pending":
        return (
          <button
            disabled
            className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-xl px-4 py-2 cursor-not-allowed text-sm font-medium w-full sm:w-auto whitespace-nowrap flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
            Request Sent
          </button>
        );
      case "accepted":
        return (
          <button
            onClick={() => navigate(`/sprint/${sprintId}/board`)}
            className="bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl px-4 py-2 hover:bg-green-500/20 transition-all text-sm font-medium w-full sm:w-auto whitespace-nowrap flex items-center justify-center gap-2"
          >
             Go to Board →
          </button>
        );
      case "rejected":
        return (
          <button
            onClick={() => handleOpenModal(sprint)}
            className="bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] text-white rounded-xl px-4 py-2 hover:shadow-[0_0_15px_rgba(141,43,126,0.4)] transition-all text-sm font-bold w-full sm:w-auto whitespace-nowrap"
          >
            Join Again
          </button>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="text-white bg-black h-screen flex-col items-center justify-center gap-4">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8D2B7E]"></div>
    <div className="text-white bg-black h-screen flex items-center justify-center  font-bold"> Loading...</div>
    </div>;
  if (!userData) return <div className="text-white bg-black h-screen flex-col items-center justify-center  p-10 ">
  <div className="text-white bg-black  flex justify-center   font-bold"> Please log in to continue</div>
  <div className="text-white bg-black  flex justify-center    font-bold">
  <Link to="/auth/login" className="text-[#8D2B7E] hover:underline">
          Go to Login
        </Link>
        </div>
  </div>

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profileForm');
    localStorage.removeItem('profileStep');
    localStorage.removeItem('profilePhoto');
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen bg-black text-white">
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] bg-clip-text text-transparent">Join a Sprint</h1>
      
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 sm:space-x-1 mb-6 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#8D2B7E]/20 p-1.5 rounded-xl w-full sm:w-fit">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] text-white shadow-[0_0_15px_rgba(141,43,126,0.3)]'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          All Sprints
        </button>
        <button
          onClick={() => setActiveTab('joined')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
            activeTab === 'joined'
              ? 'bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] text-white shadow-[0_0_15px_rgba(141,43,126,0.3)]'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Joined
        </button>
        <button
          onClick={() => {
            setActiveTab('ai');
            if (aiSprintMatches.length === 0 && !aiLoading) {
              fetchAISprintMatches();
            }
          }}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
            activeTab === 'ai'
              ? 'bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] text-white shadow-[0_0_15px_rgba(141,43,126,0.3)]'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          🤖 AI Recommended
        </button>
      </div>

      {/* All Sprints Tab */}
      {activeTab === 'all' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {mySprints.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12 text-sm sm:text-base">
              No sprints to join.
            </div>
          )}
          {mySprints.map((sprint) => (
          <div
            key={String(sprint._id)}
            className="group bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#8D2B7E]/20 rounded-3xl p-6 hover:border-[#8D2B7E]/50 transition-all hover:shadow-[0_0_20px_rgba(141,43,126,0.15)] flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8D2B7E]/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-[#8D2B7E]/20"></div>
            
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
              <div className="text-sm mb-4 text-gray-400 line-clamp-2 leading-relaxed">{sprint.description}</div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-auto relative z-10 pt-4 border-t border-white/5">
              <button 
                onClick={() => handleOpenViewModal(sprint)}
                className="bg-white/5 text-gray-300 rounded-xl px-4 py-2 hover:bg-white/10 hover:text-white transition-all text-sm font-medium w-full sm:w-auto"
              >
                View Details
              </button>
            {renderButton(sprint)}
          </div>
        </div>
        
      ))}
        </div>
      )}

      {/* AI Recommended Sprints Tab */}
      {activeTab === 'ai' && (
        <div>
          <div className="mb-6 p-4 bg-[#8D2B7E]/10 border border-[#8D2B7E]/30 rounded-lg">
            <p className="text-sm text-gray-300">
              🤖 <strong>AI-Powered Matching:</strong> Our AI analyzes your skills, experience, and interests to recommend the best sprints for you.
            </p>
          </div>
          
          {aiLoading ? (
            <div className="text-center py-10 text-white">Generating AI recommendations...</div>
          ) : aiSprintMatches.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>No AI recommendations available yet.</p>
              <button
                onClick={fetchAISprintMatches}
                className="mt-4 px-4 py-2 bg-[#8D2B7E] text-white rounded-lg hover:bg-[#8D2B7E]/80"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {aiSprintMatches.map(match => {
                // Find the full sprint data from sprints array
                const sprint = sprints.find(s => String(s._id) === String(match.sprintId));
                if (!sprint) return null;
                
                const sprintId = String(sprint._id);
                const status = sprintStatuses[sprintId] || "none";
                
                return (
                  <div
                    key={match.sprintId}
                    className="group bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#8D2B7E]/20 rounded-3xl p-6 hover:border-[#8D2B7E]/50 transition-all hover:shadow-[0_0_20px_rgba(141,43,126,0.15)] flex flex-col h-full relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 w-32 h-32 bg-[#8D2B7E]/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-[#8D2B7E]/20"></div>

                    {/* Compatibility Badge */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold z-10 shadow-lg">
                      {match.compatibility}% Match
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
                      <div className="text-sm mb-4 text-gray-400 line-clamp-2 leading-relaxed">{sprint.description}</div>
                      
                      {/* Reasons */}
                      {match.reasons && match.reasons.length > 0 && (
                        <div className="mb-4 space-y-1.5">
                          {match.reasons.map((reason, idx) => (
                            <p key={idx} className="text-xs text-blue-200/80 bg-blue-500/10 border border-blue-500/20 px-2 py-1.5 rounded-lg flex items-center gap-2">
                              ✓ {reason}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-3 mt-auto relative z-10 pt-4 border-t border-white/5">
                      <button 
                        onClick={() => handleOpenViewModal(sprint)}
                        className="bg-white/5 text-gray-300 rounded-xl px-4 py-2 hover:bg-white/10 hover:text-white transition-all text-sm font-medium w-full sm:w-auto"
                      >
                        View Details
                      </button>
                      {renderButton(sprint)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Joined Sprints Tab */}
      {activeTab === 'joined' && (
        <div className="space-y-6">
          <div className="flex gap-3">
            {["active", "ended", "all"].map((filter) => (
              <button
                key={filter}
                onClick={() => setJoinedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  joinedFilter === filter
                    ? "bg-[#8D2B7E] text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredJoinedSprints.map((sprint) => (
              <div
                key={String(sprint._id)}
                className="group bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#8D2B7E]/20 rounded-3xl p-6 hover:border-[#8D2B7E]/50 transition-all hover:shadow-[0_0_20px_rgba(141,43,126,0.15)] flex flex-col h-full relative overflow-hidden"
              >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#8D2B7E]/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-[#8D2B7E]/20"></div>

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      isSprintEnded(sprint)
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-green-500/10 text-green-400 border-green-500/20"
                    }`}
                  >
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
                <button
                  className="bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] text-white rounded-xl px-4 py-3 mt-auto hover:shadow-[0_0_15px_rgba(141,43,126,0.4)] transition-all text-sm font-bold w-full relative z-10"
                  onClick={() =>
                    navigate(
                      isSprintEnded(sprint)
                        ? `/sprint/${sprint._id}/end`
                        : `/sprint/${sprint._id}/board`
                    )
                  }
                >
                  {isSprintEnded(sprint) ? "View Summary" : "Go to Sprint →"}
                </button>
              </div>
            ))}
            {filteredJoinedSprints.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-12">
                No joined sprints in this filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal for viewing sprint details */}
      {isViewModalOpen && selectedSprintForView && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#1a1a1a] border border-[#8D2B7E]/30 rounded-3xl p-6 sm:p-8 max-w-3xl w-full text-white my-4 max-h-[90vh] overflow-y-auto shadow-2xl relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#8D2B7E]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-[#8D2B7E]/20 relative z-10">
              <div className="flex-1">
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] bg-clip-text text-transparent mb-3">
                  {selectedSprintForView.title}
                </h2>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span>Created by</span>
                   <div className="flex items-center gap-2 bg-[#2D033B]/50 px-3 py-1 rounded-full border border-[#8D2B7E]/20">
                     <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#8D2B7E] to-[#2D033B] flex items-center justify-center text-[10px] font-bold">
                        {selectedSprintForView.creator?.username?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="text-white font-medium">
                        {selectedSprintForView.creator?.username || "Unknown"}
                      </span>
                   </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedSprintForView(null);
                }}
                className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Description Section */}
              <div className="bg-[#2D033B]/30 rounded-2xl p-6 border border-[#8D2B7E]/10">
                <h3 className="text-lg font-bold text-[#FF96F5] mb-3 flex items-center gap-2">
                  <span>📝</span> Description
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                  {selectedSprintForView.description}
                </p>
              </div>

               {/* Tech Stack Section */}
              <div className="bg-[#2D033B]/30 rounded-2xl p-6 border border-[#8D2B7E]/10">
                <h3 className="text-lg font-bold text-[#FF96F5] mb-3 flex items-center gap-2">
                  <span>⚙️</span> Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSprintForView.techStack && selectedSprintForView.techStack.length > 0 ? (
                    selectedSprintForView.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No tech stack specified</span>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div>
                <h3 className="text-lg font-bold text-[#FF96F5] mb-4 flex items-center gap-2">
                  <span>⚡</span> Sprint Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#111]/50 rounded-2xl p-4 border border-white/5">
                    <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Start Date</p>
                    <p className="text-white font-semibold">
                      {selectedSprintForView.startDate
                        ? new Date(selectedSprintForView.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Not set"}
                    </p>
                  </div>
                  <div className="bg-[#111]/50 rounded-2xl p-4 border border-white/5">
                    <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">End Date</p>
                    <p className="text-white font-semibold">
                      {selectedSprintForView.endDate
                        ? new Date(selectedSprintForView.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Not set"}
                    </p>
                  </div>
                  <div className="bg-[#111]/50 rounded-2xl p-4 border border-white/5">
                    <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Duration</p>
                    <p className="text-white font-semibold">
                      {selectedSprintForView.duration
                        ? `${selectedSprintForView.duration} day${selectedSprintForView.duration !== 1 ? "s" : ""}`
                        : "Not specified"}
                    </p>
                  </div>
                   <div className="bg-[#111]/50 rounded-2xl p-4 border border-white/5">
                    <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Status</p>
                     <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${selectedSprintForView.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                         <p className="text-white font-semibold">{selectedSprintForView.isActive ? 'Active' : 'Inactive'}</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Team Section */}
              <div className="bg-[#2D033B]/30 rounded-2xl p-6 border border-[#8D2B7E]/10">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold text-[#FF96F5] flex items-center gap-2">
                    <span>👥</span> Team
                  </h3>
                  <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded">
                    {selectedSprintForView.teamMembers?.length || 0} / {selectedSprintForView.maxTeamSize || "∞"} Members
                  </span>
                </div>
                
                {selectedSprintForView.teamMembers && selectedSprintForView.teamMembers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSprintForView.teamMembers.map((member, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-[#111]/60 pr-3 pl-2 py-1.5 rounded-full border border-white/5">
                           <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8D2B7E] to-[#2D033B] flex items-center justify-center text-[10px] font-bold">
                              {member.username?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          <span className="text-sm text-gray-300">
                            {member.username || member.email || "Member"}
                          </span>
                        </div>
                      ))}
                    </div>
                ): (
                   <p className="text-gray-500 italic">No members yet.</p>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-[#8D2B7E]/20 flex justify-end">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedSprintForView(null);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white rounded-xl hover:shadow-[0_0_15px_rgba(141,43,126,0.4)] transition-all text-sm font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding a note/message */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border-2 border-[#8D2B7E]/50 rounded-xl p-4 sm:p-6 max-w-md w-full text-[#FF96F5]">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Send a Note to Creator</h2>
            <textarea
              className="w-full  p-3  bg-[#2D033B]/50 border border-[#8D2B7E]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D2B7E] text-white placeholder-gray-500 text-sm sm:text-base"
              rows={4}
              placeholder="Why are you a good fit for this sprint?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>

            <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2 sm:space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-800/50 text-gray-400 border border-gray-500/50 rounded-md px-3 sm:px-4 py-2 hover:bg-gray-800/60 transition text-sm sm:text-base w-full sm:w-auto whitespace-nowrap focus:ring-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinRequest}
                className="px-4 py-2  bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] text-white rounded-lg hover:from-[#A259C6] hover:to-[#FF96F5] transition-all text-sm sm:text-base font-semibold shadow-lg"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
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
        </main>
      </div>
    </div>
    
  );
}

export default JoinSprint;
