import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";



const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

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
          name: data.user?.name || "User",
          email: data.user?.email,
          profilePicture: data.profilePicture
            ? `${import.meta.env.VITE_API_URL}${data.profilePicture}`
            : "",
          bannerImage: data.profile?.bannerImage
            ? `${import.meta.env.VITE_API_URL}${data.profile.bannerImage}`
            : "",
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

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-6">
        <div className="relative">
          <img
            src={
              profile.bannerImage ||
              "https://via.placeholder.com/800x200"
            }
            alt="Banner"
            className="w-full h-72 object-cover"
          />
          <img
            src={
              profile.profilePicture ||
              "https://via.placeholder.com/150"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white absolute left-6 -bottom-16 object-cover"
          />
        </div>

        

        <div className="p-6 mt-16 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-gray-500 text-sm">{profile.email}</p>
            <p className="text-lg font-semibold mt-2">{profile.headline}</p>
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

          

          <div>
            <h2 className="text-xl font-bold mb-2">Experience</h2>
            {profile.experience?.length > 0 ? (
              profile.experience.map((exp, idx) => (
                <div key={idx} className="mb-4 border-b pb-2">
                  <h3 className="font-semibold">{exp.role}</h3>
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

          

          <div>
            <h2 className="text-xl font-bold mb-2">Education</h2>
            {profile.education?.length > 0 ? (
              profile.education.map((edu, idx) => (
                <div key={idx} className="mb-4 border-b pb-2">
                  <h3 className="font-semibold">{edu.school}</h3>
                  <p className="text-gray-600">{edu.degree}</p>
                  <p className="text-sm text-gray-500">{edu.year || ""}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No education added yet.</p>
            )}
          </div>

          

          <div>
            <h2 className="text-xl font-bold mb-2">Skills</h2>
            {profile.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills added yet.</p>
            )}
          </div>

          
          
          <div className="flex justify-end">
            <Link
              to="/edit-profile"
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
