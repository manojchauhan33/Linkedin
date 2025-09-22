import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    userName: "User",
    email: "",
    profilePicture: "",
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401) {
            // toast.error("Please log in to view your profile.");
            navigate("/login");
            return;
          } else {
            toast.error("Failed to fetch profile. Please try again later.");
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        setProfileData({
          userName: data.user?.name || "User",
          email: data.user?.email || "",
          profilePicture: data.profilePicture
            ? data.profilePicture.startsWith("http")
              ? data.profilePicture
              : `${import.meta.env.VITE_API_URL}${data.profilePicture}`
            : "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout request failed.");
      }

      
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed!");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <img
        src={profileData.profilePicture || "https://via.placeholder.com/60"}
        alt={profileData.userName}
        className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 hover:scale-105 transition ml-20"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border rounded-lg shadow-xl z-50">
          <div className="flex items-center space-x-4 px-4 py-4 border-b">
            <img
              src={profileData.profilePicture || "https://via.placeholder.com/60"}
              alt={profileData.email}
              className="w-14 h-14 rounded-full border"
            />
            <div className="overflow-hidden">
              <p className="font-semibold text-lg truncate">{profileData.userName}</p>
              <p className="text-sm text-gray-500 truncate">{profileData.email}</p>
            </div>
          </div>

          
          <button
            onClick={() => navigate("/profilePage")}
            className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
          >
            View Profile
          </button>

          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2500} theme="light" />
    </div>
  );
};

export default Profile;
