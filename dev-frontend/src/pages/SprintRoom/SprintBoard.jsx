// import axios from "axios";
// import React, { useState, useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// function SprintBoard() {
//   const { sprintId } = useParams();
//   console.log(sprintId);
//   const [tasks, setTasks] = useState([]);
//   const token = localStorage.getItem("token");
//   const [menuOpenTaskId, setMenuOpenTaskId] = useState(null);
//   const [editingTaskId, setEditingTaskId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     if (menuOpenTaskId === null) return;
//     function handleClickOutside(event) {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target)
//       ) {
//         setMenuOpenTaskId(null);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [menuOpenTaskId]);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:3000/api/tasks/sprint/${sprintId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setTasks(res.data.tasks);
//       } catch (err) {
//         console.log("failed to fetch tasks", err);
//       }
//     };
//     fetchTasks();
//   }, [sprintId, token]);

//   const statusMap = {
//     todo: "To Do",
//     inprogress: "In Progress",
//     done: "Done",
//   };
//   const addTask = async (title, status) => {
//     console.log("addTask called with status:", status);
//     const newTask = {
//       sprintId,
//       title,
//       status: statusMap[status],
//     };
//     try {
//       const res = await axios.post(
//         "http://localhost:3000/api/tasks/",
//         newTask,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = res.data;
//       console.log("created task", data.task);
//       if (res.status === 201) {
//         setTasks((prev) => [...prev, data.task]);
//       } else {
//         alert(data.message || "Failed to create task");
//       }
//     } catch (err) {
//       console.error("Failed to create task", err);
//     }
//   };

//   //filter the tasks by status
//   // const getTasksByStatus = (status) => {
//   //   return tasks.filter((task) => task.status === status);
//   // };
//   const getTasksByStatus = (status) => {
//     const statusMap = {
//       todo: "To Do",
//       inprogress: "In Progress",
//       done: "Done",
//     };
//     return tasks.filter((task) => task.status === statusMap[status]);
//   };

//   const handleDragEnd = async (result) => {
//     const { source, destination, draggableId } = result;
//     if (!destination || source.droppableId === destination.droppableId) return;

//     // Find the task being moved
//     const movedTask = tasks.find((task) => task._id === draggableId);
//     const newStatus = statusMap[destination.droppableId];

//     // Optimistically update UI
//     setTasks((prev) =>
//       prev.map((task) =>
//         task._id === draggableId ? { ...task, status: newStatus } : task
//       )
//     );

//     // Update backend
//     try {
//       await axios.patch(
//         `http://localhost:3000/api/tasks/${draggableId}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//     } catch (err) {
//       // Optionally revert UI and show error
//       alert("Failed to update task status");
//       // Optionally re-fetch tasks here
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black flex flex-col items-center pt-10">
//       <h1 className="text-3xl text-white mb-8">Sprint Board</h1>

//       {/* <div className="grid grid-cols-3 gap-6 w-4/5">
//         //  To Do Column 

//         <KanbanColumn
//           title="To Do"
//           tasks={getTasksByStatus("todo")}
//           onAddTask={addTask}
//           status="todo"
//         />

//         //  In Progress Column 

//         <KanbanColumn
//           title="In Progress"
//           tasks={getTasksByStatus("inprogress")}
//           onAddTask={addTask}
//           status="inprogress"
//         />

//         //  Done Column

//         <KanbanColumn
//           title="Done"
//           tasks={getTasksByStatus("done")}
//           onAddTask={addTask}
//           status="done"
//         />
//       </div> */}

//       <DragDropContext onDragEnd={handleDragEnd}>
//         <div className="grid grid-cols-3 gap-6 w-4/5">
//           {["todo", "inprogress", "done"].map((col) => (
//             <Droppable droppableId={col} key={col}>
//               {(provided) => (
//                 <div ref={provided.innerRef} {...provided.droppableProps} className="bg-[#2D033B] rounded-2xl p-4 min-h-[400px] w-full">
//                   <h2 className="text-xl text-white mb-4">{statusMap[col]}</h2>
//                   {getTasksByStatus(col).map((task, index) => (
//                     <Draggable key={task._id} draggableId={task._id} index={index}>
//                       {(provided) => (
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                           className="bg-[#A259C6] rounded-lg p-4 mb-4 text-white font-bold relative flex items-center justify-between"
//                         >
//                           {/* Task title or edit input */}
//                           <div className="flex-1">
//                             {editingTaskId === task._id ? (
//                               <>
//                                 <input
//                                   value={editTitle}
//                                   onChange={(e) => setEditTitle(e.target.value)}
//                                   className="text-black px-2 py-1 rounded"
//                                 />
//                                 <button
//                                   className="ml-2 bg-green-500 text-white rounded px-2 py-1"
//                                   onClick={async () => {
//                                     try {
//                                       const res = await axios.put(
//                                         `http://localhost:3000/api/tasks/${task._id}`,
//                                         { title: editTitle },
//                                         { headers: { Authorization: `Bearer ${token}` } }
//                                       );
//                                       setTasks((prev) =>
//                                         prev.map((t) =>
//                                           t._id === task._id ? { ...t, title: res.data.task.title } : t
//                                         )
//                                       );
//                                       setEditingTaskId(null);
//                                     } catch (err) {
//                                       alert("Failed to update task");
//                                     }
//                                   }}
//                                 >
//                                   Save
//                                 </button>
//                                 <button
//                                   className="ml-2 bg-gray-500 text-white rounded px-2 py-1"
//                                   onClick={() => setEditingTaskId(null)}
//                                 >
//                                   Cancel
//                                 </button>
//                               </>
//                             ) : (
//                               <span>{task.title}</span>
//                             )}
//                           </div>
//                           {/* Three dots button */}
//                           <button
//                             className="ml-2 text-white text-xl px-2 py-1 rounded hover:bg-[#8D2B7E] focus:outline-none"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setMenuOpenTaskId(task._id === menuOpenTaskId ? null : task._id);
//                             }}
//                           >
//                             &#8942;
//                           </button>
//                           {/* Dropdown menu */}
//                           {menuOpenTaskId === task._id && (
//                             <div
//                               ref={dropdownRef}
//                               className="absolute top-10 right-2 bg-white text-black rounded shadow z-20 min-w-[100px]"
//                             >
//                               <button
//                                 className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
//                                 onClick={() => {
//                                   setEditingTaskId(task._id);
//                                   setEditTitle(task.title);
//                                   setMenuOpenTaskId(null);
//                                 }}
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
//                                 onClick={async () => {
//                                   setMenuOpenTaskId(null);
//                                   try {
//                                     await axios.delete(`http://localhost:3000/api/tasks/${task._id}`, {
//                                       headers: { Authorization: `Bearer ${token}` },
//                                     });
//                                     setTasks((prev) => prev.filter((t) => t._id !== task._id));
//                                   } catch (err) {
//                                     alert("Failed to delete task");
//                                   }
//                                 }}
//                               >
//                                 Delete
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </Draggable>
//                   ))}
//                   {provided.placeholder}
//                   <KanbanColumn onAddTask={addTask} status={col} />
//                 </div>
//               )}
//             </Droppable>
//           ))}
//         </div>
//       </DragDropContext>
//     </div>
//   );
// }

// function KanbanColumn({ onAddTask, status }) {
//   const [newTask, setNewTask] = useState("");
//   const [showInput, setShowInput] = useState(false);
//   return (
//     <>
//       {showInput && (
//         <div className="bg-[#A259C6] rounded-lg p-4 mb-4 text-white font-bold">
//           <input
//             type="text"
//             value={newTask}
//             onChange={(e) => setNewTask(e.target.value)}
//           />
//           <button
//             className="ml-2 bg-[#FF2E63] text-white rounded-md px-2 py-1"
//             onClick={() => {
//               if (newTask.trim() !== "") {
//                 onAddTask(newTask, status);
//                 setNewTask("");
//                 setShowInput(false);
//               }
//             }}
//           >
//             add
//           </button>
//           <button
//             className="ml-2 bg-gray-500 text-white rounded-md px-2 py-1"
//             onClick={() => {
//               setNewTask("");
//               setShowInput(false);
//             }}
//           >
//             cancel
//           </button>
//         </div>
//       )}
//       <button
//         className="w-full bg-[#FF2E63] text-white rounded-md px-4 py-2 mt-4"
//         onClick={() => setShowInput(true)}
//       >
//         + Add Task
//       </button>
//     </>
//   );
// }

// export default SprintBoard;

import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskDetailsPopup from "@/components/SprintRoom/TaskDetailsPopUp"; // import popup component
import SprintSidebar from "@/components/SprintRoom/SprintSidebar";
import { toast, ToastContainer } from "react-toastify";
const hasSprintEnded = (sprint) => {
  if (!sprint) return false;
  if (sprint.isFinished) return true;
  if (sprint.isActive === false) return true;
  return false;
};

function SprintBoard() {
  const { sprintId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");
  const [menuOpenTaskId, setMenuOpenTaskId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState(null); // 👉 for popup
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 👉 decode userId from token (assuming JWT payload has userId)
  const currentUserId = token ? JSON.parse(atob(token.split(".")[1])).id : null;
  const [isSprintCreator, setIsSprintCreator] = useState(false);

  console.log("Current User ID:", currentUserId);
  console.log("Is Sprint Creator:", isSprintCreator);

  useEffect(() => {
    if (menuOpenTaskId === null) return;
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setMenuOpenTaskId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpenTaskId]);

  const fetchTasks = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/tasks/sprint/${sprintId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks(res.data.tasks);

        console.log("Fetched tasks:", res.data.tasks);
      } catch (err) {
        console.log("failed to fetch tasks", err);
      }
    };

  useEffect(() => {
    const fetchSprintMeta = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/sprint/${sprintId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const sprint = res.data.sprint;
        if (hasSprintEnded(sprint)) {
          navigate(`/sprint/${sprintId}/end`);
          return;
        }
        const creatorId = sprint.creator?._id || sprint.creator;
        setIsSprintCreator(creatorId?.toString() === currentUserId);
      } catch (err) {
        console.error("Failed to fetch sprint info", err);
      }
    };
    if (sprintId) {
      fetchSprintMeta();
      fetchTasks();
    }
  }, [sprintId, token, currentUserId, navigate]);

  const statusMap = {
    todo: "To Do",
    inprogress: "In Progress",
    done: "Done",
  };

  const addTask = async (title, status) => {
    const newTask = {
      sprintId,
      title,
      status: statusMap[status],
    };
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tasks/`,
        newTask,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data;
      if (res.status === 201) {
        setTasks((prev) => [...prev, data.task]);
      } else {
        // alert(data.message || "Failed to create task");
        toast.error(data.message || "Failed to create task");
      }
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  const getTasksByStatus = (status) => {
    const statusMap = {
      todo: "To Do",
      inprogress: "In Progress",
      done: "Done",
    };
    return tasks.filter((task) => task.status === statusMap[status]);
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const movedTask = tasks.find((task) => task._id === draggableId);
    const newStatus = statusMap[destination.droppableId];

    setTasks((prev) =>
      prev.map((task) =>
        task._id === draggableId ? { ...task, status: newStatus } : task
      )
    );

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${draggableId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      // alert("Failed to update task status");
      toast.error("Failed to update task status");
    }
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
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <div className="bg-black p-4 sm:p-6">
          <div className="flex items-center gap-3">
            {/* Mobile/Tablet Hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-white hover:bg-gray-800 rounded-lg transition-colors z-50 relative"
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
            <h1 className="text-2xl sm:text-3xl text-white font-bold">Board</h1>
            <button
            onClick={() => navigate("/dashboard")}
            className="ml-auto bg-[#8D2B7E] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[#A259C6] transition-colors text-xs sm:text-sm lg:hidden"
          >
            Back
          </button>
          </div>
        </div>

        {/* Board Content */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-x-auto">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 min-w-max lg:min-w-0">
              {["todo", "inprogress", "done"].map((col) => (
                <Droppable droppableId={col} key={col}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-[#2D033B] rounded-xl sm:rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-4 min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] w-full"
                    >
                      <h2 className="text-base sm:text-lg lg:text-xl text-white font-bold mb-2 sm:mb-3 lg:mb-4">{statusMap[col]}</h2>
                      {getTasksByStatus(col).map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-[#8D2B7E] rounded-lg p-2 sm:p-3 lg:p-4 mb-2 sm:mb-3 lg:mb-4 text-white relative cursor-pointer"
                              onClick={() => setSelectedTask(task)}
                            >
                              {/* Task Title */}
                              <div className="mb-1.5 sm:mb-2 lg:mb-3">
                                {editingTaskId === task._id ? (
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                      value={editTitle}
                                      onChange={(e) => setEditTitle(e.target.value)}
                                      className="text-black px-2 py-1 rounded flex-1 text-sm sm:text-base"
                                    />
                                    <button
                                      className="bg-green-500 text-white rounded px-2 py-1 text-xs sm:text-sm"
                                      onClick={async () => {
                                        try {
                                          const res = await axios.put(
                                            `${import.meta.env.VITE_API_URL}/api/tasks/${task._id}`,
                                            { title: editTitle },
                                            {
                                              headers: {
                                                Authorization: `Bearer ${token}`,
                                              },
                                            }
                                          );
                                          setTasks((prev) =>
                                            prev.map((t) =>
                                              t._id === task._id
                                                ? {
                                                    ...t,
                                                    title: res.data.task.title,
                                                  }
                                                : t
                                            )
                                          );
                                          setEditingTaskId(null);
                                        } catch (err) {
                                          // alert("Failed to update task");
                                          toast.error("Failed to update task");
                                        }
                                      }}
                                    >
                                      Save
                                    </button>
                                    <button
                                      className="bg-gray-500 text-white rounded px-2 py-1 text-xs sm:text-sm"
                                      onClick={() => setEditingTaskId(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <h3 className="font-bold text-sm sm:text-base lg:text-lg break-words">{task.title}</h3>
                                )}
                              </div>

                              {/* Assigned Members */}
                              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 lg:mb-3">
                                <span className="text-xs text-gray-300">Assigned:</span>
                                <div className="flex gap-1">
                                  {task.assignedMembers && task.assignedMembers.length > 0 ? (
                                    task.assignedMembers.slice(0, 2).map((member, idx) => (
                                      <div
                                        key={member._id || idx}
                                        className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-400 rounded-full flex items-center justify-center text-xs font-semibold text-black"
                                        title={member.username}
                                      >
                                        {member.username?.charAt(0)?.toUpperCase()}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-500 rounded-full flex items-center justify-center text-xs">
                                      ?
                                    </div>
                                  )}
                                  {task.assignedMembers && task.assignedMembers.length > 2 && (
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs">
                                      +{task.assignedMembers.length - 2}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Menu button */}
                              <button
                                className="absolute top-2 right-2 text-white text-xl px-1 py-1 rounded hover:bg-[#A259C6] focus:outline-none"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMenuOpenTaskId(
                                    task._id === menuOpenTaskId ? null : task._id
                                  );
                                }}
                              >
                                ⋯
                              </button>
                              {menuOpenTaskId === task._id && (
                                <div
                                  ref={dropdownRef}
                                  className="absolute top-10 right-2 bg-white text-black rounded shadow z-20 min-w-[100px] text-sm"
                                >
                                  <button
                                    className="block px-3 sm:px-4 py-2 hover:bg-gray-200 w-full text-left text-xs sm:text-sm"
                                    onClick={() => {
                                      setEditingTaskId(task._id);
                                      setEditTitle(task.title);
                                      setMenuOpenTaskId(null);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="block px-3 sm:px-4 py-2 hover:bg-gray-200 w-full text-left text-xs sm:text-sm"
                                    onClick={async () => {
                                      setMenuOpenTaskId(null);
                                      try {
                                        await axios.delete(
                                          `${import.meta.env.VITE_API_URL}/api/tasks/${task._id}`,
                                          {
                                            headers: {
                                              Authorization: `Bearer ${token}`,
                                            },
                                          }
                                        );
                                        setTasks((prev) =>
                                          prev.filter((t) => t._id !== task._id)
                                        );
                                      } catch (err) {
                                        // alert("Failed to delete task");
                                        toast.error("Failed to delete task");
                                      }
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <KanbanColumn onAddTask={addTask} status={col} />
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      {/* Popup for Task Details */}
      {selectedTask && (
        <TaskDetailsPopup
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          currentUserId={currentUserId}
          isSprintCreator={isSprintCreator}
          refreshSprint={fetchTasks}
        />
      )}
    </div>
  );
}

function KanbanColumn({ onAddTask, status }) {
  const [newTask, setNewTask] = useState("");
  const [showInput, setShowInput] = useState(false);
  
  return (
    <>
      {showInput && (
        <div className="bg-[#8D2B7E] rounded-lg p-2 sm:p-3 lg:p-4 mb-2 sm:mb-3 lg:mb-4 text-white">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter task title..."
            className="w-full p-1.5 sm:p-2 rounded text-black mb-1.5 sm:mb-2 text-xs sm:text-sm lg:text-base"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              className="bg-green-500 text-white rounded px-2 sm:px-3 py-1 text-xs sm:text-sm hover:bg-green-600"
              onClick={() => {
                if (newTask.trim() !== "") {
                  onAddTask(newTask, status);
                  setNewTask("");
                  setShowInput(false);
                }
              }}
            >
              Add
            </button>
            <button
              className="bg-gray-500 text-white rounded px-3 py-1 text-sm hover:bg-gray-600"
              onClick={() => {
                setNewTask("");
                setShowInput(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <button
        className="w-full bg-[#8D2B7E] text-white rounded-lg px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 mt-2 sm:mt-3 lg:mt-4 hover:bg-[#A259C6] transition-colors font-medium text-xs sm:text-sm lg:text-base"
        onClick={() => setShowInput(true)}
      >
        + Add Task
      </button>
    </>
  );
}

export default SprintBoard;

