const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
    title: String,
    description: String,
    techStack: [String], // e.g., ['React', 'Node.js']
    duration: Number, // in days
    startDate: Date,
    endDate: Date,
  
    isPublic: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isFinished: { type: Boolean, default: false },
  
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    maxTeamSize: Number,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    resources: {
      githubRepo: String,
      demoLink: String,
      extraLinks: [String]
    },
  
    feedback: [{
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
      tags: [String],
      comment: String
    }]
  }, { timestamps: true });
  
  module.exports = mongoose.model("Sprint", sprintSchema);
  