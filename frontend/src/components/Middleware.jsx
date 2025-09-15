// components/Middleware.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Middleware({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/check-auth", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          navigate("/home");
        } else {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  return children;
}

export default Middleware;
