import React, { useEffect, useState } from "react";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/getpost`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setPosts(data.posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <p className="text-center mt-6 text-gray-500">Loading posts...</p>;
  }
  if (!loading && posts.length === 0) return <p className="text-center mt-6 text-gray-500">No posts yet.</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-3">
      {posts.map((post) => {
        let mediaContent = null;
        try {
          const mediaArray = post.media ? JSON.parse(post.media) : [];
          const mediaTypeArray = post.mediaType ? JSON.parse(post.mediaType) : [];

          mediaContent = mediaArray.map((m, idx) => {
            const fullUrl = m.startsWith("http") ? m : `${import.meta.env.VITE_API_URL}${m}`;
            return mediaTypeArray[idx] === "image" ? (
              <img
                key={idx}
                src={fullUrl}
                alt="Post"
                className="max-h-[400px] w-full rounded-md object-contain"
              />
            ) : (
              <video
                key={idx}
                src={fullUrl}
                controls
                className="max-h-[400px] w-full rounded-md"
              />
            );
          });
        } catch {
          console.warn("Invalid media format for post", post.id);
        }

        const profilePic = post.User?.Profile?.profilePicture
          ? post.User.Profile.profilePicture.startsWith("http")
            ? post.User.Profile.profilePicture
            : `${import.meta.env.VITE_API_URL}${post.User.Profile.profilePicture}`
          : "https://via.placeholder.com/40";

        return (
          <div key={post.id} className="bg-white rounded-lg shadow p-4 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={profilePic}
                alt={post.User?.name || "User"}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div>
                <p className="font-medium text-sm">{post.User?.name || "Unknown User"}</p>
                <p className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {post.content && (
              <p className="text-gray-800 text-sm whitespace-pre-wrap">{post.content}</p>
            )}

            {mediaContent}
          </div>
        );
      })}
    </div>
  );
};

export default Feed;
