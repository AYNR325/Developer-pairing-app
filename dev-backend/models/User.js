const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String, unique: true },
    profilePicture: { type: String },
    bio: { type: String ,default: ""},
    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Expert"],
    },
    experienceYear: { type: Number },
    location: { type: String, default: "" },
    preferredLanguages: {
      type: [String],
      enum: [
        "JavaScript",
        "Python",
        "Java",
        "C++",
        "Ruby",
        "PHP",
        "Swift",
        "Go",
        "C#",
        "Kotlin",
        "Rust",
        "TypeScript",
        "Dart",
        "Scala",
        "Perl",
        "Shell",
        "C",
      ],
    },
    availability: {
      type: String,
      enum: ["Full-time", "Part-time", "Weekends"],
    },
    additionalSkills: {
      type: [String],
      enum: [
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Machine Learning",
        "Cloud Computing",
        "DevOps",
        "Cybersecurity",
        "UI/UX Design",
        "Game Development",
        "Blockchain",
        "AR/VR",
        "IoT",
      ],
    },
    sprints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' }],
    
    // Track incoming connection requests (user IDs)
    connectionRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // Track accepted connections (user IDs)
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
