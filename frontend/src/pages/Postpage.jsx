import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdClose, MdPhotoSizeSelectActual } from "react-icons/md";
import { RiVideoFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";

const Postpage = () => {
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");
  // const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const modalRef = useRef();
  const fileInputRef = useRef();

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/me`, {
          credentials: "include",
        });
        const data = await res.json();
        setProfilePicture(
          data.profilePicture 
            ? data.profilePicture.startsWith("http")
              ? data.profilePicture
              : `${import.meta.env.VITE_API_URL}${data.profilePicture}`
            : ""
        );
        // setUserName(data.name);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();

    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      file,
      type: file.type.startsWith("image") ? "image" : "video",
    }));
    setMediaFiles((prev) => [...prev, ...newFiles]);
  };

  
  
  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  
  
  const handleAddMoreClick = () => {
    fileInputRef.current.click();
  };

  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && mediaFiles.length === 0) return;

    const formData = new FormData();
    formData.append("content", content);
    mediaFiles.forEach((m) => {
      formData.append("media", m.file);
      formData.append("mediaType", m.type);
    });



    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/post`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success) navigate("/home");
      else alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Error creating post!");
    }
  };

  
  const handleOverlayClick = (e) => {
    if (e.target === modalRef.current){ 
      navigate("/home");
    }
  };



  return (
    <div
      ref={modalRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 flex justify-center items-start sm:items-center p-4 overflow-auto z-50"
    >
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 relative flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-semibold">Create a post</h2>
          <button
            onClick={() => navigate("/home")}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdClose size={24} />
          </button>
        </div>

        
        <div className="flex items-center gap-3 mb-4">
          <img
            src={profilePicture || "https://via.placeholder.com/40"}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          {/* <span className="font-medium">{userName}</span> */}
        </div>

        
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What do you want to talk about?"
          className="w-full border rounded-md p-3 text-gray-700 resize-none mb-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        
        
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-blue-600">
            <MdPhotoSizeSelectActual size={20} /> Add images
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-green-600">
            <RiVideoFill size={20} /> Add Videos
            <input
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        
        
        {mediaFiles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 relative">
            {mediaFiles.map((m, index) => (
              <div key={index} className="relative group">
                {m.type === "image" ? (
                  <img
                    src={URL.createObjectURL(m.file)}
                    alt="preview"
                    className="w-full h-40 object-cover rounded-md"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(m.file)}
                    controls
                    className="w-full h-40 rounded-md"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-black transition"
                >
                  <MdClose size={16} />
                </button>
              </div>
            ))}

            

            <div
              onClick={handleAddMoreClick}
              className="w-full h-40 border-2 border-dashed border-gray-400 rounded-md flex justify-center items-center cursor-pointer hover:border-blue-500 hover:bg-gray-50"
            >
              <AiOutlinePlus size={28} className="text-gray-500" />
            </div>
          </div>
        )}

        
        
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!content && mediaFiles.length === 0}
            className={`px-4 py-2 rounded-md text-white ${
              content || mediaFiles.length > 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Postpage;
