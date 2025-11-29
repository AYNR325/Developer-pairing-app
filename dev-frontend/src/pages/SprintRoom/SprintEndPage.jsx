import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import SprintSidebar from "@/components/SprintRoom/SprintSidebar";
import { useUser } from "@/context/UserContext";

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

  const isOwner =
    userData &&
    sprintInfo &&
    (userData._id === sprintInfo?.creator?._id ||
      userData._id === sprintInfo?.creator);

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
    } developers to collaborate using ${sprintInfo?.techStack?.join(", ") || "the chosen tech stack"}.`;

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

      <div className="flex-1 overflow-y-auto bg-black text-white w-full lg:w-auto">
        {/* Mobile/Tablet Header with Hamburger */}
        <div className="lg:hidden p-4 flex items-center gap-3 border-b border-[#8D2B7E]/20">
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
          <h1 className="text-xl font-bold text-white">Sprint Summary</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="ml-auto bg-[#8D2B7E] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[#A259C6] transition-colors text-xs sm:text-sm lg:hidden"
          >
            Back
          </button>
        </div>

        <section className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8">
          {/* Hero */}
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#8D2B7E] via-[#A259C6] to-[#FF96F5] p-4 sm:p-6 lg:p-10 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <p className="uppercase text-xs sm:text-sm tracking-[0.3em] text-white/80 mb-2">
                  Sprint #{sprintInfo?._id?.slice(-5) || ""}
                </p>
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black mb-2 sm:mb-3">
                  🎉 Sprint Completed Successfully!
                </h1>
                <p className="text-white/80 text-sm sm:text-base lg:text-lg">{formattedDateRange}</p>
              </div>
              <div className="bg-white/15 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-center w-full sm:w-auto">
                <p className="text-xs sm:text-sm text-white/70">Completion Rate</p>
                <p className="text-2xl sm:text-3xl font-bold">{completionRate}</p>
                <p className="text-xs text-white/70 mt-1">
                  {taskBreakdown.done}/{totalTasks} tasks completed
                </p>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <MetricCard label="Duration" value={durationInDays} />
            <MetricCard label="Developers" value={sprintInfo?.teamMembers?.length || 0} />
            <MetricCard label="Tech Stack" value={sprintInfo?.techStack?.join(", ") || "Not specified"} />
            <MetricCard label="Tasks" value={`${taskBreakdown.done}/${totalTasks} Done`} />
          </div>

          {/* Summary */}
          <div className="bg-gray-900/40 rounded-2xl sm:rounded-3xl border border-white/5 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Sprint Overview</h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{summaryText}</p>
          </div>

          {/* Tasks Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <TaskProgressCard
              title="Completed"
              count={taskBreakdown.done}
              color="from-green-600/30 to-green-500/20"
              tasks={tasks.filter((t) => (t.status || "").toLowerCase() === "done")}
            />
            <TaskProgressCard
              title="In Progress"
              count={taskBreakdown.inProgress}
              color="from-yellow-500/30 to-orange-400/20"
              tasks={tasks.filter((t) =>
                ["in progress", "in_progress", "inprogress"].includes((t.status || "").toLowerCase())
              )}
            />
            <TaskProgressCard
              title="Planned"
              count={taskBreakdown.todo}
              color="from-slate-600/30 to-slate-500/20"
              tasks={tasks.filter((t) => ["to do", "todo"].includes((t.status || "").toLowerCase()))}
            />
          </div>

          {/* Team Members */}
          <section className="bg-gray-900/40 rounded-2xl sm:rounded-3xl border border-white/5 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">Team Members</h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {sprintInfo?.teamMembers?.length || 0} collaborators who joined this sprint
                </p>
              </div>
              <Link
                to={`/sprint/${sprintId}/teams`}
                className="text-xs sm:text-sm text-[#FF96F5] hover:underline"
              >
                View full team
              </Link>
            </div>

            {sprintInfo?.teamMembers?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {sprintInfo.teamMembers.map((member) => (
                  <TeamCard key={member._id || member.username} member={member} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-xs sm:text-sm">No members were recorded for this sprint.</p>
            )}
          </section>

          {/* Resources */}
          <section className="bg-gray-900/40 rounded-2xl sm:rounded-3xl border border-white/5 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Project Resources</h2>
            {sprintInfo?.resources ? (
              <div className="space-y-3">
                {["github", "figma", "docs"].map(
                  (key) =>
                    sprintInfo.resources[key] && (
                      <ResourceRow key={key} label={key} value={sprintInfo.resources[key]} />
                    )
                )}
                {sprintInfo.resources.extraLinks?.map((link, idx) => (
                  <ResourceRow key={idx} label={`Extra Link ${idx + 1}`} value={link} />
                ))}
                {!sprintInfo.resources.github &&
                  !sprintInfo.resources.figma &&
                  !sprintInfo.resources.docs &&
                  (!sprintInfo.resources.extraLinks ||
                    sprintInfo.resources.extraLinks.length === 0) && (
                    <p className="text-gray-500 text-sm">No resources were documented.</p>
                  )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No resources were documented.</p>
            )}
          </section>

          {/* Feedback */}
          {sprintInfo?.feedback?.length > 0 && (
            <section className="bg-gray-900/40 rounded-2xl sm:rounded-3xl border border-white/5 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Team Feedback</h2>
              <div className="space-y-3 sm:space-y-4">
                {sprintInfo.feedback.map((fb) => (
                  <div key={fb._id} className="bg-black/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-medium text-sm sm:text-base">{fb.from?.username || "Anonymous"}</p>
                      <p className="text-yellow-400 text-sm sm:text-base">⭐ {fb.rating || "N/A"}</p>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm">{fb.comment || "No comment provided."}</p>
                    {fb.tags?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {fb.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-[#8D2B7E]/30 text-[#FF96F5] text-xs rounded-lg"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="bg-gradient-to-r from-[#111] to-[#1d1d1d] rounded-2xl sm:rounded-3xl border border-white/5 p-4 sm:p-6 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">Start a new sprint?</h2>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">
                Keep the momentum going by launching the next phase of this project.
              </p>
            </div>
            {isOwner ? (
              <button
                onClick={() => navigate("/create-sprint")}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] rounded-lg sm:rounded-xl font-semibold hover:shadow-xl hover:shadow-[#8D2B7E]/30 transition-all text-sm sm:text-base w-full lg:w-auto"
              >
                Start New Sprint
              </button>
            ) : (
              <Link
                to="/search"
                className="px-6 py-3 bg-gradient-to-r from-[#8D2B7E] to-[#FF96F5] rounded-xl font-semibold hover:shadow-xl hover:shadow-[#8D2B7E]/30 transition-all"
              >
                Find Your Next Sprint
              </Link>
            )}
          </section>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-gray-900/40 rounded-xl sm:rounded-2xl border border-white/5 p-3 sm:p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-1 sm:mb-2">{label}</p>
      <p className="text-xl sm:text-2xl font-semibold text-white break-words">{value}</p>
    </div>
  );
}

function TaskProgressCard({ title, count, color, tasks }) {
  return (
    <div className={`rounded-2xl sm:rounded-3xl border border-white/5 bg-gradient-to-br ${color} p-4 sm:p-5`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">{title}</p>
          <p className="text-2xl sm:text-3xl font-semibold">{count}</p>
        </div>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className="bg-black/30 rounded-xl sm:rounded-2xl px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white/90 break-words">
              {task.title}
            </div>
          ))
        ) : (
          <p className="text-sm text-white/70">No tasks in this category</p>
        )}
      </div>
    </div>
  );
}

function TeamCard({ member }) {
  return (
    <div className="bg-black/20 rounded-xl sm:rounded-2xl border border-white/5 p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#8D2B7E] to-[#FF96F5] rounded-full flex items-center justify-center text-base sm:text-lg font-semibold flex-shrink-0">
        {member.username?.charAt(0)?.toUpperCase() || "U"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-white text-sm sm:text-base truncate">{member.username || "Unnamed"}</p>
        <p className="text-xs text-gray-400">{member.role || "Contributor"}</p>
      </div>
    </div>
  );
}

function ResourceRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 bg-black/20 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 border border-white/5">
      <p className="uppercase text-xs tracking-[0.3em] text-gray-500 mb-1 sm:mb-0">{label}</p>
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        className="text-[#FF96F5] font-medium break-all hover:underline text-xs sm:text-sm"
      >
        {value}
      </a>
    </div>
  );
}

export default SprintEndPage;
