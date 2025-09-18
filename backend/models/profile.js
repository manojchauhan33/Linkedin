import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  headline: { type: String, default: "" },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
  bannerImage: { type: String, default: "" },
  experience: [
    {
      title: String,
      company: String,
      startDate: Date,
      endDate: Date,
      description: String,
    },
  ],
  education: [
    {
      school: String,
      degree: String,
      startDate: Date,
      endDate: Date,
      description: String,
    },
  ],
  skills: [String],
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    website: String,
  },
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
