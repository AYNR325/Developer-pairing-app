import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import SprintSidebar from "@/components/SprintRoom/SprintSidebar";
import { useUser } from "@/context/UserContext";
import { ToastContainer, toast } from "react-toastify";

const hasSprintEnded = (sprint) => {
  if (!sprint) return false;
  if (sprint.isFinished) return true;
  if (sprint.isActive === false) return true;
  return false;
};

function SprintEndPage() {
  const { sprintId } = useParams();
  const navigate = useNavigate();
  const { userData } = useUser();
  const [sprintInfo, setSprintInfo] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sprintRes, tasksRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/sprint/${sprintId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/tasks/sprint/${sprintId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const sprint = sprintRes.data.sprint;
        if (!hasSprintEnded(sprint)) {
          toast.info("Sprint is still active. Summary will be available after sprint ends.");
          navigate(`/sprint/${sprintId}/home`);
          return;
        }
        setSprintInfo(sprint);
        setTasks(tasksRes.data.tasks || []);
      } catch (err) {
        console.error("Failed to load sprint end data", err);
        setError("Unable to load sprint summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sprintId, token]);

  const taskBreakdown = useMemo(() => {
    const normalize = (status) => (status || "").toLowerCase();
    return {
      done: tasks.filter((t) => normalize(t.status) === "done").length,
      inProgress: tasks.filter((t) =>
        ["in progress", "in_progress", "inprogress"].includes(normalize(t.status))
      ).length,
      todo: tasks.filter((t) =>
        ["to do", "todo"].includes(normalize(t.status))
      ).length,
    };
  }, [tasks]);

  const totalTasks = tasks.length || 0;
  const completionRate =
    totalTasks === 0 ? "0%" : `${Math.round((taskBreakdown.done / totalTasks) * 100)}%`;

  const durationInDays = useMemo(() => {
    if (!sprintInfo?.startDate || !sprintInfo?.endDate) return "N/A";
    const start = new Date(sprintInfo.startDate);
    const end = new Date(sprintInfo.endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} days` : "Same day";
  }, [sprintInfo]);

  const formattedDateRange = useMemo(() => {
    if (!sprintInfo?.startDate || !sprintInfo?.endDate) return "Dates not available";
    const start = new Date(sprintInfo.startDate).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const end = new Date(sprintInfo.endDate).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${start} – ${end}`;
  }, [sprintInfo]);

  const summaryText =
    sprintInfo?.summary ||
    `This sprint focused on ${sprintInfo?.title || "the planned project"} and brought together ${
      sprintInfo?.teamMembers?.length || "several"
    } developers to collaborate.`;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading sprint summary...
      </div>
    );
  }

  if (error || !sprintInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        {error || "Sprint not found"}
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
        theme="dark" />
        
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
      <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full lg:w-auto relative z-10 overflow-y-auto custom-scrollbar">
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
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Sprint Summary</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="ml-auto bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:shadow-[0_0_15px_rgba(141,43,126,0.5)] transition-all text-xs sm:text-sm lg:hidden font-medium"
          >
            Back
          </button>
        </div>

        <section className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Hero */}
          <div className="rounded-2xl sm:rounded-3xl bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#8D2B7E]/20 p-6 lg:p-10 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex-1">
                <p className="uppercase text-xs sm:text-sm tracking-[0.3em] text-[#FF96F5] mb-2 font-bold">
                  Sprint #{sprintInfo?._id?.slice(-5) || ""}
                </p>
                <h1 className="text-3xl lg:text-5xl font-black mb-3 bg-gradient-to-r from-white via-[#FF96F5] to-white bg-clip-text text-transparent">
                  Sprint Completed Successfully!
                </h1>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg">{formattedDateRange}</p>
              </div>
              <div className="bg-[#2D033B]/60 rounded-xl px-6 py-4 text-center w-full sm:w-auto border border-[#8D2B7E]/30">
                <p className="text-xs sm:text-sm text-gray-400">Completion Rate</p>
                <p className="text-3xl font-bold text-white mt-1">{completionRate}</p>
                <p className="text-xs text-green-400 mt-1 font-medium">
                  {taskBreakdown.done}/{totalTasks} tasks completed
                </p>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Duration" value={durationInDays} />
            <MetricCard label="Developers" value={sprintInfo?.teamMembers?.length || 0} />
            <MetricCard label="Tech Stack" value={sprintInfo?.techStack?.join(", ") || "Not specified"} />
            <MetricCard label="Tasks" value={`${taskBreakdown.done}/${totalTasks} Done`} />
          </div>

          {/* Summary */}
          <div className="bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#8D2B7E]/20 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Sprint Overview</h2>
            <p className="text-gray-300 leading-relaxed text-base sm:text-lg">{summaryText}</p>
          </div>

          {/* Tasks Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <TaskProgressCard
              title="Completed"
              count={taskBreakdown.done}
              status="done"
              tasks={tasks.filter((t) => (t.status || "").toLowerCase() === "done")}
            />
            <TaskProgressCard
              title="In Progress"
              count={taskBreakdown.inProgress}
              status="current"
              tasks={tasks.filter((t) =>
                ["in progress", "in_progress", "inprogress"].includes((t.status || "").toLowerCase())
              )}
            />
            <TaskProgressCard
              title="To Do"
              count={taskBreakdown.todo}
              status="pending"
              tasks={tasks.filter((t) => ["to do", "todo"].includes((t.status || "").toLowerCase()))}
            />
          </div>

          {/* Team Members */}
          <section className="bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#8D2B7E]/20 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Team Members</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {sprintInfo?.teamMembers?.length || 0} collaborators in this sprint
                </p>
              </div>
              <Link
                to={`/sprint/${sprintId}/teams`}
                className="text-sm font-bold text-[#FF96F5] hover:text-[#A259C6] hover:underline"
              >
                View full team
              </Link>
            </div>

            {sprintInfo?.teamMembers?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sprintInfo.teamMembers.map((member) => (
                  <TeamCard key={member._id || member.username} member={member} tasks={tasks} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No members recorded.</p>
            )}
          </section>

          {/* Resources */}
          <section className="bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#8D2B7E]/20 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Project Resources</h2>
            {sprintInfo?.resources ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["github", "figma", "docs"].map(
                  (key) =>
                    sprintInfo.resources[key] && (
                      <ResourceRow key={key} label={key} value={sprintInfo.resources[key]} />
                    )
                )}
                {sprintInfo.resources.extraLinks?.map((link, idx) => (
                  <ResourceRow key={idx} label={`Extra Link ${idx + 1}`} value={link} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No resources documented.</p>
            )}
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-[#8D2B7E]/20 to-[#2D033B]/40 rounded-2xl border border-[#8D2B7E]/30 p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF96F5]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Ready for the next challenge?</h2>
              <p className="text-gray-300 mt-2 text-sm sm:text-base">
                Start a new sprint or join an existing team.
              </p>
            </div>
            
            <Link
              to="/dashboard"
              className="relative z-10 px-6 py-3 bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] rounded-xl font-bold text-white hover:shadow-[0_0_20px_rgba(141,43,126,0.6)] transition-all transform hover:-translate-y-1"
            >
              Back to Dashboard
            </Link>
          </section>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/5 p-4 hover:border-[#8D2B7E]/30 transition-colors">
      <p className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">{label}</p>
      <p className="text-xl font-bold text-white break-words">{value}</p>
    </div>
  );
}

function TaskProgressCard({ title, count, status, tasks }) {
  const getStatusColor = (s) => {
    switch(s) {
      case 'done': return 'from-green-500/20 to-green-900/20 border-green-500/30 text-green-400';
      case 'current': return 'from-orange-500/20 to-orange-900/20 border-orange-500/30 text-orange-400';
      default: return 'from-gray-700/40 to-gray-900/40 border-gray-600/30 text-gray-400';
    }
  };

  const style = getStatusColor(status);

  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${style} p-5 flex flex-col h-full`}>
      <div className="flex items-center justify-between mb-4">
          <p className="text-sm uppercase tracking-widest font-bold opacity-80">{title}</p>
          <p className="text-3xl font-black">{count}</p>
      </div>
      <div className="space-y-2 flex-1 overflow-y-auto max-h-40 custom-scrollbar pr-2">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className="bg-black/30 rounded-lg px-3 py-2 text-sm text-white/90 break-words hover:bg-black/50 transition-colors border border-white/5">
              {task.title}
            </div>
          ))
        ) : (
          <p className="text-sm opacity-50 italic">No tasks.</p>
        )}
      </div>
    </div>
  );
}

function TeamCard({ member, tasks }) {
    // Calculate tasks if passed, otherwise just show info
    const completedCount = tasks ? tasks.filter(t => (t.status||'').toLowerCase() === 'done' && t.assignedTo?._id === member._id).length : 0;
    
  return (
    <div className="bg-white/5 rounded-xl border border-white/5 p-4 flex items-center gap-4 hover:bg-white/10 transition-colors hover:border-[#8D2B7E]/30 group">
      <div className="w-12 h-12 bg-gradient-to-br from-[#8D2B7E] to-[#2D033B] rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg ring-2 ring-[#8D2B7E]/20 group-hover:ring-[#FF96F5]/50 transition-all">
        {member.username?.charAt(0)?.toUpperCase() || "U"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-white text-base truncate group-hover:text-[#FF96F5] transition-colors">{member.username || "Unnamed"}</p>
        <p className="text-xs text-gray-400 font-mono">{member.role || "Contributor"}</p>
      </div>
       {tasks && (
           <div className="text-right">
               <span className="block text-xl font-bold text-white">{completedCount}</span>
               <span className="text-[10px] uppercase text-gray-500">Tasks</span>
           </div>
       )}
    </div>
  );
}

function ResourceRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5 hover:border-[#8D2B7E]/30 transition-colors">
      <p className="uppercase text-xs tracking-widest text-[#FF96F5] font-bold mb-1 sm:mb-0 w-24 flex-shrink-0">{label}</p>
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        className="text-gray-300 font-medium break-all hover:text-white hover:underline text-sm transition-colors"
      >
        {value}
      </a>
    </div>
  );
}

export default SprintEndPage;
