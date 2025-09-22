import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { MdOutlineModeEditOutline } from "react-icons/md";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/me`,
          { method: "GET", credentials: "include" }
        );
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        setProfile({
          ...data.profile,
          name: data.user?.name,
          email: data.user?.email,
          profilePicture: data.profilePicture
            ? `${import.meta.env.VITE_API_URL}${data.profilePicture}`     //ternoary
            : "",
          bannerImage: data.profile?.bannerImage
            ? `${import.meta.env.VITE_API_URL}${data.profile.bannerImage}`
            : "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    // console.log("mounted");
    fetchProfile();
  }, []);

  if (!profile){ 
    return <div className="text-center mt-20">Loading profile...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-6">

        
        <div className="relative">
          <img
            src={profile.bannerImage || "https://via.placeholder.com/800x200"}
            alt="Banner"
            className="w-full h-48 sm:h-60 object-cover"
          />

          
          <Link
            to="/edit-profile"
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            <MdOutlineModeEditOutline size={20} className="text-gray-600" />
          </Link>


          {/* picture of profile  */}
          <div className="absolute left-4 sm:left-6 -bottom-16 w-24 h-24 sm:w-32 sm:h-32">
            <img
              src={profile.profilePicture || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-full h-full rounded-full border-4 border-white object-cover shadow-md"
            />
          </div>
        </div>



        {/* Profile info */}
        <div className="p-4 sm:p-6 mt-20 space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{profile.name}</h1>
          <p className="text-gray-600">{profile.headline}</p>
          <p className="text-gray-500 text-sm">{profile.location}</p>
          <p className="text-gray-700 mt-2">{profile.bio}</p>



          {/* links */}
          <div className="flex flex-wrap gap-3 mt-3">
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

        <hr />

        {/* Experience */}
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">
            Experience
          </h2>
          {profile.experience?.length > 0 ? (
            profile.experience.map((exp, idx) => (
              <div key={idx} className="mb-3 sm:mb-4">
                <h3 className="font-semibold text-gray-800">{exp.role}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">
                  {exp.from || ""} - {exp.to || "Present"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No experience added yet.</p>
          )}
        </div>

        <hr />

        {/* Education */}
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">
            Education
          </h2>
          {profile.education?.length > 0 ? (
            profile.education.map((edu, idx) => (
              <div key={idx} className="mb-3 sm:mb-4">
                <h3 className="font-semibold text-gray-800">{edu.school}</h3>
                <p className="text-gray-600">{edu.degree}</p>
                <p className="text-sm text-gray-500">{edu.year || ""}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No education added yet.</p>
          )}
        </div>

        <hr />

        {/* Skills */}
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">
            Skills
          </h2>
          {profile.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
