import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@/context/UserContext";
import axios from "axios";
function CreateSprint() {
  const { register, handleSubmit } = useForm();
  const [showForm, setshowForm] = useState(false);
  const {userData,loading}=useUser();

  const token=localStorage.getItem('token');
  console.log("Token:", token);
  console.log(userData);
  // Add loading and error handling
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!userData) {
    return <div>Please log in to create a sprint</div>;
  }

  const onSubmit =async (data) => {
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
      const res = await axios.post("http://localhost:3000/api/sprint",sprintData,{
        headers:{ Authorization: `Bearer ${token}` }
      });
      const sprintId=res.data.sprintId;
      alert("welcome to sprint room");
    } catch (err) {
      console.error("Sprint creation failed", err);
    }
  };

  return (
    <>
      <button
        className="bg-[#8D2B7E] text-white rounded-md px-4 py-2 hover:bg-[#8D2B7E]/80 cursor-pointer absolute top-10 right-10"
        onClick={() => setshowForm(true)}
      >
        Create Sprint
      </button>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-4 relative"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setshowForm(false)}
            >
              &times;
            </button>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sprint Name
              </label>
              <input
                type="text"
                placeholder="Sprint name"
                {...register("sprintName", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8D2B7E] mb-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sprint Description
              </label>
              <textarea
                placeholder="Sprint description"
                {...register("sprintDescription", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8D2B7E] mb-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tech Stack
              </label>
              <div className="grid grid-cols-2 gap-2 mb-1">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="React"
                    {...register("techStack")}
                  />{" "}
                  React
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="Node.js"
                    {...register("techStack")}
                  />{" "}
                  Node.js
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="MongoDB"
                    {...register("techStack")}
                  />{" "}
                  MongoDB
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="Python"
                    {...register("techStack")}
                  />{" "}
                  Python
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="Express"
                    {...register("techStack")}
                  />{" "}
                  Express
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="Tailwind"
                    {...register("techStack")}
                  />{" "}
                  Tailwind
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="TypeScript"
                    {...register("techStack")}
                  />{" "}
                  TypeScript
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="JavaScript"
                    {...register("techStack")}
                  />{" "}
                  JavaScript
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sprint Duration
              </label>
              <input
                type="number"
                placeholder="Sprint duration"
                {...register("sprintDuration", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8D2B7E] mb-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sprint Start Date
              </label>
              <input
                type="date"
                placeholder="Sprint start date"
                {...register("sprintStartDate", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8D2B7E] mb-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Size
              </label>
              <input
                type="number"
                placeholder="Team size"
                {...register("teamSize", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8D2B7E] mb-1"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#8D2B7E] text-white rounded-md px-4 py-2 hover:bg-[#8D2B7E]/80 transition"
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
