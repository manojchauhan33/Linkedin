import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    userName: "User",
    profilePicture: "",
  });

  const API_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/profile/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 404) {
            toast.error("Please log in to view your profile.");
          } else {
            toast.error("Failed to fetch profile. Please try again later.");
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        
        const fullProfilePictureUrl = data.profilePicture
          ? `${API_URL}${data.profilePicture}`
          : "";
        
        setProfileData({
          userName: data.user?.name || data.user?.email || "User",
          profilePicture: fullProfilePictureUrl,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout request failed.");
      }

      toast.success("Logout successful!", {
        autoClose: 2000,
        onClose: () => (window.location.href = "/login"),
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed!");
    }
  };

  return (
    <div className="relative">
      <img
        src={
          profileData.profilePicture || "https://via.placeholder.com/40"
        }
        alt={profileData.userName}
        className="w-8 h-8 rounded-full cursor-pointer"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-md z-50">
          <div className="px-4 py-2 border-b">
            <p className="font-semibold">{profileData.userName}</p>
          </div>

          <button
            onClick={() => (window.location.href = "/profilePage")}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            View Profile
          </button>

          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Profile;