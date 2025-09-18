import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Middleware({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:5000/api/check-auth", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);

          // ✅ If user is on login or signup, but already authenticated → go home
          if (location.pathname === "/" || location.pathname === "/login") {
            navigate("/home", { replace: true });
          }
        } else {
          setIsAuthenticated(false);

          // ✅ If user tries a protected route without token → go login
          if (location.pathname !== "/" && location.pathname !== "/login") {
            navigate("/login", { replace: true });
          }
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        if (location.pathname !== "/" && location.pathname !== "/login") {
          navigate("/login", { replace: true });
        }
      })
      .finally(() => setLoading(false));
  }, [navigate, location.pathname]);

  if (loading) return <p>Loading...</p>;

  return children;
}

export default Middleware;
