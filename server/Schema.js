import mongoose from "mongoose";

// ===================== USER SCHEMA =====================
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  usertype: {
    type: String,
    required: true
  }
});

// ===================== FREELANCER SCHEMA =====================
const freelancerSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users"
  },
  skills: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    default: ""
  },
  currentProjects: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  completedProjects: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  applications: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  funds: {
    type: Number,
    default: 0
  }
});

// ===================== PROJECT SCHEMA =====================
const projectSchema = mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  clientName: String,
  clientEmail: String,
  title: String,
  description: String,
  budget: Number,
  skills: [String],
  bids: [mongoose.Schema.Types.ObjectId],
  bidAmounts: [Number],
  postedDate: String,
  status: {
    type: String,
    default: "Available"
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  freelancerName: String,
  deadline: String,
  submission: {
    type: Boolean,
    default: false
  },
  submissionAccepted: {
    type: Boolean,
    default: false
  },
  projectLink: {
    type: String,
    default: ""
  },
  manualLink: {
    type: String,
    default: ""
  },
  submissionDescription: {
    type: String,
    default: ""
  }
});

// ===================== APPLICATION SCHEMA =====================
const applicationSchema = mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projects"
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  clientName: String,
  clientEmail: String,
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  freelancerName: String,
  freelancerEmail: String,
  freelancerSkills: [String],
  title: String,
  description: String,
  budget: Number,
  requiredSkills: [String],
  proposal: String,
  bidAmount: Number,
  estimatedTime: Number,
  status: {
    type: String,
    default: "Pending"
  }
});

// ===================== CHAT SCHEMA =====================
const chatSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  messages: {
    type: Array
  }
});

// ===================== EXPORT MODELS =====================
export const User = mongoose.model("users", userSchema);
export const Freelancer = mongoose.model("freelancer", freelancerSchema);
export const Project = mongoose.model("projects", projectSchema);
export const Application = mongoose.model("applications", applicationSchema);
export const Chat = mongoose.model("chats", chatSchema);
