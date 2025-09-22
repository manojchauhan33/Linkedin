import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCamera, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import Header from "../components/Header";

const EditProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [removeProfilePic, setRemoveProfilePic] = useState(false);
  const [removeBanner, setRemoveBanner] = useState(false);
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
          ...data.profile,
          user: data.user,
          profilePicture: data.profilePicture,
        });
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
    const updatedArray = [...(profile[field] || [])];
    if (key){ 
      updatedArray[index][key] = value;
    }
    else{ 
      updatedArray[index] = value;
    }
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
    if (type === "profile") 
    {
      setProfilePictureFile(null);
      setProfile({ ...profile, profilePicture: "" });
      setRemoveProfilePic(true);
    } 

    else if (type === "banner") 
    {
      setBannerFile(null);
      setProfile({ ...profile, bannerImage: "" });
      setRemoveBanner(true);
    }

  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.keys(profile).forEach((key) => {
        // if (key === "user")
        // { 
        //   return;
        // }
        if (typeof profile[key] === "string" || typeof profile[key] === "number") 
        {
          formData.append(key, profile[key]);
        } 

        else if (Array.isArray(profile[key]) || typeof profile[key] === "object") 
        {
          formData.append(key, JSON.stringify(profile[key]));
        }

      });

      if (profilePictureFile)
      { 
        formData.append("profilePicture", profilePictureFile);
      }
      if (bannerFile)
      { 
        formData.append("bannerImage", bannerFile);
      }

      if (removeProfilePic)
      { 
        formData.append("removeProfilePic", true);
      }
      if (removeBanner) 
      {
        formData.append("removeBanner", true);
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      

      //  console.log(res.json());

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      await res.json();
      navigate("/profilePage");
    } catch (err) {
      console.error("Error updating profile:", err);
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
                ? `${import.meta.env.VITE_API_URL}${profile.bannerImage}`
                : "https://via.placeholder.com/800x200"
            }
            alt="Banner"
            className="w-full h-48 sm:h-60 object-cover"
          />

          {/*edit*/}
          <div className="absolute top-3 right-3 flex gap-2">
            <label className="bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-100">
              <FiCamera size={18} className="text-gray-600" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  setBannerFile(e.target.files[0]);
                  setRemoveBanner(false);
                }}
              />
            </label>
            {(bannerFile || profile.bannerImage) && (
              <button
                onClick={() => handleRemoveImage("banner")}
                className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
              >
                <FiTrash2 size={18} className="text-red-500" />
              </button>
            )}
          </div>


          {/* Profile picture */}
          <div className="absolute left-4 sm:left-6 -bottom-16">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
              <img
                src={
                  profilePictureFile
                    ? URL.createObjectURL(profilePictureFile)
                    : profile.profilePicture
                    ? `${import.meta.env.VITE_API_URL}${profile.profilePicture}`
                    : "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="w-full h-full rounded-full border-4 border-white object-cover shadow-md"
              />
              <div className="absolute bottom-1 right-1 flex gap-1">
                <label className="bg-white p-1.5 rounded-full shadow cursor-pointer hover:bg-gray-100">
                  <FiCamera size={14} className="text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      setProfilePictureFile(e.target.files[0]);
                      setRemoveProfilePic(false);
                    }}
                  />
                </label>
                {(profilePictureFile || profile.profilePicture) && (
                  <button
                    onClick={() => handleRemoveImage("profile")}
                    className="bg-white p-1.5 rounded-full shadow hover:bg-gray-100"
                  >
                    <FiTrash2 size={14} className="text-red-500" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>



        {/* Form */}
        <div className="p-4 sm:p-6 mt-20 space-y-6">
          {/* user info */}
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
              className="flex items-center gap-1 text-blue-600 text-sm mb-2"
            >
              <FiPlus size={16} /> Add Skill
            </button>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 border p-1 rounded flex-1 min-w-[120px]"
                >
                  <input
                    value={skill}
                    onChange={(e) =>
                      handleArrayChange("skills", idx, null, e.target.value)
                    }
                    className="border-none outline-none w-full"
                  />
                  <button onClick={() => handleRemoveItem("skills", idx)}>
                    <FiX className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>




          
          <div className="flex flex-col gap-4">
            {/* Experience */}
            <div className="p-4 border rounded-lg space-y-2">
              <h2 className="text-lg font-bold">Experience</h2>
              <button
                type="button"
                onClick={() =>
                  handleAddItem("experience", { company: "", role: "", from: "", to: "" })
                }
                className="flex items-center gap-1 text-blue-600 text-sm mb-2"
              >
                <FiPlus size={16} /> Add Experience
              </button>
              {profile.experience?.map((exp, idx) => (
                <div
                  key={idx}
                  className="border p-2 rounded mb-2 space-y-1 relative flex flex-col sm:flex-row sm:items-center sm:gap-2"
                >
                  <button
                    onClick={() => handleRemoveItem("experience", idx)}
                    className="absolute top-2 right-2 text-red-500 sm:relative sm:top-0 sm:right-0"
                  >
                    <FiTrash2 />
                  </button>
                  <input
                    placeholder="Company"
                    value={exp.company || ""}
                    onChange={(e) =>
                      handleArrayChange("experience", idx, "company", e.target.value)
                    }
                    className="border p-1 rounded w-full sm:w-1/4"
                  />
                  <input
                    placeholder="Role"
                    value={exp.role || ""}
                    onChange={(e) =>
                      handleArrayChange("experience", idx, "role", e.target.value)
                    }
                    className="border p-1 rounded w-full sm:w-1/4"
                  />
                  <input
                    placeholder="From"
                    value={exp.from || ""}
                    onChange={(e) =>
                      handleArrayChange("experience", idx, "from", e.target.value)
                    }
                    className="border p-1 rounded w-full sm:w-1/4"
                  />
                  <input
                    placeholder="To"
                    value={exp.to || ""}
                    onChange={(e) =>
                      handleArrayChange("experience", idx, "to", e.target.value)
                    }
                    className="border p-1 rounded w-full sm:w-1/4"
                  />
                </div>
              ))}
            </div>



            {/* Education */}
            <div className="p-4 border rounded-lg space-y-2">
              <h2 className="text-lg font-bold">Education</h2>
              <button
                type="button"
                onClick={() =>
                  handleAddItem("education", { school: "", degree: "", year: "" })
                }
                className="flex items-center gap-1 text-blue-600 text-sm mb-2"
              >
                <FiPlus size={16} /> Add Education
              </button>
              {profile.education?.map((edu, idx) => (
                <div
                  key={idx}
                  className="border p-2 rounded mb-2 space-y-1 relative flex flex-col sm:flex-row sm:items-center sm:gap-2"
                >
                  <button
                    onClick={() => handleRemoveItem("education", idx)}
                    className="absolute top-2 right-2 text-red-500 sm:relative sm:top-0 sm:right-0"
                  >
                    <FiTrash2 />
                  </button>
                  <input
                    placeholder="School"
                    value={edu.school || ""}
                    onChange={(e) =>
                      handleArrayChange("education", idx, "school", e.target.value)
                    }
                    className="border p-1 rounded w-full sm:w-1/3"
                  />
                  <input
                    placeholder="Degree"
                    value={edu.degree || ""}
                    onChange={(e) =>
                      handleArrayChange("education", idx, "degree", e.target.value)
                    }
                    className="border p-1 rounded w-full sm:w-1/3"
                  />
                  <input
                    placeholder="Year"
                    value={edu.year || ""}
                    onChange={(e) =>
                      handleArrayChange("education", idx, "year", e.target.value)
                    }
                    className="border p-1 rounded w-full sm:w-1/3"
                  />
                </div>
              ))}
            </div>
          </div>



          {/* Social Links */}
          <div className="p-4 border rounded-lg space-y-2">
            <h2 className="text-lg font-bold">Social Links</h2>
            <div className="flex flex-col sm:flex-row sm:gap-2 flex-wrap">
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
                  className="border p-1 rounded w-full sm:w-[48%] mb-2"
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
    </div>
  );
};

export default EditProfilePage;
