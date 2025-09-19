import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";



const EditProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/me`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();

  
    setProfile({
      ...data.profile,     // profile fields
      user: data.user,     // user object
      profilePicture: data.profilePicture,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
  }
};
    fetchProfile();
  }, []);

  if (!profile) return <div className="text-center mt-20">Loading profile...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleArrayChange = (field, index, key, value) => {
    const updatedArray = [...(profile[field] || [])];
    if (key) updatedArray[index][key] = value;
    else updatedArray[index] = value;
    setProfile({ ...profile, [field]: updatedArray });
  };

  const handleAddItem = (field, item) => {
    setProfile({ ...profile, [field]: [...(profile[field] || []), item] });
  };

  const handleRemoveItem = (field, index) => {
    const updatedArray = [...(profile[field] || [])];
    updatedArray.splice(index, 1);
    setProfile({ ...profile, [field]: updatedArray });
  };

  const handleRemoveImage = (type) => {
    if (type === "profile") {
      setProfilePictureFile(null);
      setProfile({ ...profile, profilePicture: "" });
    } else if (type === "banner") {
      setBannerFile(null);
      setProfile({ ...profile, bannerImage: "" });
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.keys(profile).forEach((key) => {
        if (key === "user") return;
        if (typeof profile[key] === "string" || typeof profile[key] === "number") {
          formData.append(key, profile[key]);
        } else if (Array.isArray(profile[key]) || typeof profile[key] === "object") {
          formData.append(key, JSON.stringify(profile[key]));
        }
      });

      if (profilePictureFile) formData.append("profilePicture", profilePictureFile);
      if (bannerFile) formData.append("bannerImage", bannerFile);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      await res.json();
      alert("Profile updated successfully!");
      navigate("/profilePage");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(`Failed to update profile: ${err.message}`);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      
      <div className="relative">
        <img
          src={
            bannerFile
              ? URL.createObjectURL(bannerFile)
              : profile.bannerImage
              ? `${import.meta.env.VITE_API_URL}${profile.bannerImage}`
              : "https://via.placeholder.com/800x200"
          }
          alt="Banner"
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
            Change Banner
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setBannerFile(e.target.files[0])}
            />
          </label>
          {(bannerFile || profile.bannerImage) && (
            <button
              onClick={() => handleRemoveImage("banner")}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-[-3rem] space-y-6 relative z-10">
        <div className="flex items-center gap-4">
          <img
            src={
              profilePictureFile
                ? URL.createObjectURL(profilePictureFile)
                : profile.profilePicture
                ? `${import.meta.env.VITE_API_URL}${profile.profilePicture}`
                : "https://via.placeholder.com/150"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
          <div className="flex flex-col gap-2">
            <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
              Change Profile
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setProfilePictureFile(e.target.files[0])}
              />
            </label>
            {(profilePictureFile || profile.profilePicture) && (
              <button
                onClick={() => handleRemoveImage("profile")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Cards for Info */}
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="p-4 border rounded-lg space-y-2">
            <h2 className="text-lg font-bold">Basic Info</h2>
            <input
              type="text"
              name="headline"
              value={profile.headline || ""}
              onChange={handleChange}
              placeholder="Headline"
              className="w-full border p-2 rounded"
            />
            <textarea
              name="bio"
              value={profile.bio || ""}
              onChange={handleChange}
              placeholder="Bio"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="location"
              value={profile.location || ""}
              onChange={handleChange}
              placeholder="Location"
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Skills */}
          <div className="p-4 border rounded-lg space-y-2">
            <h2 className="text-lg font-bold">Skills</h2>
            <button
              type="button"
              onClick={() => handleAddItem("skills", "")}
              className="text-blue-600 text-sm mb-2"
            >
              + Add Skill
            </button>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    value={skill}
                    onChange={(e) => handleArrayChange("skills", idx, null, e.target.value)}
                    className="border p-1 rounded"
                  />
                  <button
                    onClick={() => handleRemoveItem("skills", idx)}
                    className="text-red-500"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="p-4 border rounded-lg space-y-2">
            <h2 className="text-lg font-bold">Experience</h2>
            <button
              type="button"
              onClick={() =>
                handleAddItem("experience", { company: "", role: "", from: "", to: "" })
              }
              className="text-blue-600 text-sm mb-2"
            >
              + Add Experience
            </button>
            {profile.experience?.map((exp, idx) => (
              <div key={idx} className="border p-2 rounded mb-2 space-y-1">
                <input
                  placeholder="Company"
                  value={exp.company || ""}
                  onChange={(e) => handleArrayChange("experience", idx, "company", e.target.value)}
                  className="border p-1 rounded w-full"
                />
                <input
                  placeholder="Role"
                  value={exp.role || ""}
                  onChange={(e) => handleArrayChange("experience", idx, "role", e.target.value)}
                  className="border p-1 rounded w-full"
                />
                <input
                  placeholder="From"
                  value={exp.from || ""}
                  onChange={(e) => handleArrayChange("experience", idx, "from", e.target.value)}
                  className="border p-1 rounded w-full"
                />
                <input
                  placeholder="To"
                  value={exp.to || ""}
                  onChange={(e) => handleArrayChange("experience", idx, "to", e.target.value)}
                  className="border p-1 rounded w-full"
                />
                <button
                  onClick={() => handleRemoveItem("experience", idx)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="p-4 border rounded-lg space-y-2">
            <h2 className="text-lg font-bold">Education</h2>
            <button
              type="button"
              onClick={() => handleAddItem("education", { school: "", degree: "", year: "" })}
              className="text-blue-600 text-sm mb-2"
            >
              + Add Education
            </button>
            {profile.education?.map((edu, idx) => (
              <div key={idx} className="border p-2 rounded mb-2 space-y-1">
                <input
                  placeholder="School"
                  value={edu.school || ""}
                  onChange={(e) => handleArrayChange("education", idx, "school", e.target.value)}
                  className="border p-1 rounded w-full"
                />
                <input
                  placeholder="Degree"
                  value={edu.degree || ""}
                  onChange={(e) => handleArrayChange("education", idx, "degree", e.target.value)}
                  className="border p-1 rounded w-full"
                />
                <input
                  placeholder="Year"
                  value={edu.year || ""}
                  onChange={(e) => handleArrayChange("education", idx, "year", e.target.value)}
                  className="border p-1 rounded w-full"
                />
                <button
                  onClick={() => handleRemoveItem("education", idx)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="p-4 border rounded-lg space-y-2">
            <h2 className="text-lg font-bold">Social Links</h2>
            {["linkedin", "github", "twitter", "facebook"].map((platform) => (
              <input
                key={platform}
                placeholder={platform}
                value={profile.socialLinks?.[platform] || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socialLinks: { ...profile.socialLinks, [platform]: e.target.value },
                  })
                }
                className="border p-1 rounded w-full"
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
