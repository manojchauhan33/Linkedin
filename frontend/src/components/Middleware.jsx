import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Middleware({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/check-auth`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);

          
          if (location.pathname === "/" || location.pathname === "/login") {
            navigate("/home", { replace: true });
          }
        } else {
          setIsAuthenticated(false);

          
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
