import React, { useEffect, useState } from "react";
import Header from "../components/Header";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const API_URL = "http://localhost:5000"; 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/profile/me`, {
          method: "GET",
          credentials: "include", 
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="text-center mt-20">Loading profile...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleArrayChange = (field, index, key, value) => {
    const updatedArray = [...profile[field]];
    if (key) {
      updatedArray[index][key] = value;
    } else {
      updatedArray[index] = value;
    }
    setProfile({ ...profile, [field]: updatedArray });
  };

  const handleAddItem = (field, item) => {
    const updatedArray = [...(profile[field] || []), item];
    setProfile({ ...profile, [field]: updatedArray });
  };

  const handleRemoveItem = (field, index) => {
    const updatedArray = [...profile[field]];
    updatedArray.splice(index, 1);
    setProfile({ ...profile, [field]: updatedArray });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      Object.keys(profile).forEach((key) => {
        if (key === 'user') return; 

        if (typeof profile[key] === "string" || typeof profile[key] === "number") {
          formData.append(key, profile[key]);
        } else if (Array.isArray(profile[key])) {
          
          formData.append(key, JSON.stringify(profile[key]));
        } else if (typeof profile[key] === "object" && profile[key] !== null) {
          
          formData.append(key, JSON.stringify(profile[key]));
        }
      });

      
      if (profilePictureFile) formData.append("profilePicture", profilePictureFile);
      if (bannerFile) formData.append("bannerImage", bannerFile);

      const res = await fetch(`${API_URL}/api/profile`, {
        method: "POST",
        credentials: "include",
        body: formData, 
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setProfile(data); 
      setEditing(false);
      setProfilePictureFile(null); 
      setBannerFile(null);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(`Failed to update profile: ${err.message}`);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-6">
        
        <div className="relative">
          <img
            src={
              bannerFile
                ? URL.createObjectURL(bannerFile)
                : profile.bannerImage
                  ? `${API_URL}${profile.bannerImage}`
                  : "https://via.placeholder.com/800x200"
            }
            alt="Banner"
            className="w-full h-48 object-cover"
          />

          
          <div className="absolute top-4 right-4">
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="px-3 py-1 rounded hover:bg-gray-100"
              >
                ⋯
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
                  <button
                    onClick={() => {
                      setEditing(true);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>

          
          <img
            src={
              profilePictureFile
                ? URL.createObjectURL(profilePictureFile)
                : profile.profilePicture
                  ? `${API_URL}${profile.profilePicture}` 
                  : "https://via.placeholder.com/150"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white absolute left-6 -bottom-16 object-cover"
          />
        </div>

        <div className="p-6 mt-16 space-y-6">
          {editing ? (
            <div className="space-y-3">
              <input
                type="text"
                name="headline"
                value={profile.headline || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Headline"
              />
              <textarea
                name="bio"
                value={profile.bio || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Bio"
              />
              <input
                type="text"
                name="location"
                value={profile.location || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Location"
              />

              
              
              <div>
                <label className="block mb-1">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePictureFile(e.target.files[0])}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files[0])}
                  className="w-full"
                />
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold">{profile.headline}</h1>
              <p className="text-gray-600">{profile.bio}</p>
              <p className="text-sm text-gray-500">{profile.location}</p>

              

              <div className="flex space-x-4 mt-3">
                {profile.socialLinks &&
                  Object.entries(profile.socialLinks).map(
                    ([key, url]) =>
                      url && ( 
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline capitalize"
                        >
                          {key}
                        </a>
                      )
                  )}
              </div>
            </div>
          )}

          
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Experience</h2>
              {editing && (
                <button
                  onClick={() =>
                    handleAddItem("experience", { title: "", company: "", startDate: "", endDate: "", description: "" })
                  }
                  className="text-blue-600 text-sm"
                >
                  + Add
                </button>
              )}
            </div>
            {profile.experience?.length > 0 ? (
              profile.experience.map((exp, idx) => (
                <div key={idx} className="mb-4 border-b pb-3">
                  {editing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={exp.title || ""}
                        onChange={(e) => handleArrayChange("experience", idx, "title", e.target.value)}
                        placeholder="Title"
                        className="w-full border p-2 rounded"
                      />
                      <input
                        type="text"
                        value={exp.company || ""}
                        onChange={(e) => handleArrayChange("experience", idx, "company", e.target.value)}
                        placeholder="Company"
                        className="w-full border p-2 rounded"
                      />
                      <input
                        type="date"
                        value={exp.startDate?.split("T")[0]}
                        onChange={(e) => handleArrayChange("experience", idx, "startDate", e.target.value)}
                        className="border p-2 rounded w-full sm:w-auto" // Responsive width
                      />
                      <input
                        type="date"
                        value={exp.endDate?.split("T")[0]}
                        onChange={(e) => handleArrayChange("experience", idx, "endDate", e.target.value)}
                        className="border p-2 rounded w-full sm:w-auto" // Responsive width
                      />
                      <textarea
                        value={exp.description || ""}
                        onChange={(e) => handleArrayChange("experience", idx, "description", e.target.value)}
                        placeholder="Description"
                        className="w-full border p-2 rounded"
                      />
                      <button
                        onClick={() => handleRemoveItem("experience", idx)}
                        className="text-red-500 text-sm mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold">{exp.title}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">
                        {exp.startDate?.split("T")[0]} - {exp.endDate?.split("T")[0] || "Present"}
                      </p>
                      <p className="text-sm text-gray-700">{exp.description}</p>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No experience added yet.</p>
            )}
          </div>

          
          <div className="bg-white p-4 rounded shadow mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Education</h2>
              {editing && (
                <button
                  onClick={() =>
                    handleAddItem("education", { school: "", degree: "", startDate: "", endDate: "", description: "" })
                  }
                  className="text-blue-600 text-sm"
                >
                  + Add
                </button>
              )}
            </div>
            {profile.education?.length > 0 ? (
              profile.education.map((edu, idx) => (
                <div key={idx} className="mb-4 border-b pb-3">
                  {editing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={edu.school || ""}
                        onChange={(e) => handleArrayChange("education", idx, "school", e.target.value)}
                        placeholder="School"
                        className="w-full border p-2 rounded"
                      />
                      <input
                        type="text"
                        value={edu.degree || ""}
                        onChange={(e) => handleArrayChange("education", idx, "degree", e.target.value)}
                        placeholder="Degree"
                        className="w-full border p-2 rounded"
                      />
                      <input
                        type="date"
                        value={edu.startDate?.split("T")[0]}
                        onChange={(e) => handleArrayChange("education", idx, "startDate", e.target.value)}
                        className="border p-2 rounded w-full sm:w-auto"
                      />
                      <input
                        type="date"
                        value={edu.endDate?.split("T")[0]}
                        onChange={(e) => handleArrayChange("education", idx, "endDate", e.target.value)}
                        className="border p-2 rounded w-full sm:w-auto"
                      />
                      <textarea
                        value={edu.description || ""}
                        onChange={(e) => handleArrayChange("education", idx, "description", e.target.value)}
                        placeholder="Description"
                        className="w-full border p-2 rounded"
                      />
                      <button
                        onClick={() => handleRemoveItem("education", idx)}
                        className="text-red-500 text-sm mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold">{edu.school}</h3>
                      <p className="text-gray-600">{edu.degree}</p>
                      <p className="text-sm text-gray-500">
                        {edu.startDate?.split("T")[0]} - {edu.endDate?.split("T")[0] || "Present"}
                      </p>
                      <p className="text-sm text-gray-700">{edu.description}</p>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No education added yet.</p>
            )}
          </div>

          
          <div className="bg-white p-4 rounded shadow mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Skills</h2>
              {editing && (
                <button onClick={() => handleAddItem("skills", "")} className="text-blue-600 text-sm">
                  + Add
                </button>
              )}
            </div>
            {profile.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, idx) =>
                  editing ? (
                    <div key={idx} className="flex items-center gap-1">
                      <input
                        value={skill || ""}
                        onChange={(e) => handleArrayChange("skills", idx, null, e.target.value)}
                        className="border px-2 py-1 rounded"
                      />
                      <button
                        onClick={() => handleRemoveItem("skills", idx)}
                        className="text-red-500"
                      >
                        x
                      </button>
                    </div>
                  ) : (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500">No skills added yet.</p>
            )}
          </div>

          {editing && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;