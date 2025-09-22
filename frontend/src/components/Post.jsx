import React, { useEffect, useState } from "react";
import { MdPhotoSizeSelectActual } from "react-icons/md";
import { RiVideoFill } from "react-icons/ri";
import { PiArticleNyTimesThin } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";

const Post = () => {
  const [profilePicture, setProfilePicture] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/me`,
          { method: "GET", credentials: "include" }
        );

        if (!res.ok) {
          console.error("Failed to fetch profile");
          return;
        }

        const data = await res.json();
        setProfilePicture(
          data.profilePicture
            ? data.profilePicture.startsWith("http")
              ? data.profilePicture
              : `${import.meta.env.VITE_API_URL}${data.profilePicture}`
            : ""
        );
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-12 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-3">
        <Link to="/profilePage">
          <img
            src={profilePicture || "https://via.placeholder.com/40"}
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer"
          />
        </Link>
        <input
          type="text"
          placeholder="Start a post"
          readOnly
          onClick={() => navigate("/postpage")}
          className="flex-1 border rounded-full px-3 py-2 cursor-pointer text-gray-600"
        />
      </div>

      
      
      <div className="flex justify-around text-gray-500 text-sm mt-2">
        <button className="flex items-center gap-2 hover:text-blue-600">
          <RiVideoFill size={20} className="text-green-500" /> Video
        </button>
        <button className="flex items-center gap-2 hover:text-blue-600">
          <MdPhotoSizeSelectActual size={20} className="text-blue-500" /> Photo
        </button>
        <button className="flex items-center gap-2 hover:text-blue-600">
          <PiArticleNyTimesThin size={20} className="text-red-400" /> Write article
        </button>
      </div>
    </div>
  );
};

export default Post;
