// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Middleware({ children }) {
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/api/check-auth`, {
//           method: "GET",
//           credentials: "include",
//         });

//         if (res.ok) {
//           setIsAuthenticated(true); // token valid
//         } else {
//           setIsAuthenticated(false);
//           navigate("/login", { replace: true }); // redirect if invalid
//         }
//       } catch (err) {
//         setIsAuthenticated(false);
//         navigate("/login", { replace: true }); // redirect if network error
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, [navigate]);

//   if (loading) return <p>Loading...</p>;

//   return isAuthenticated ? children : null;
// }

// export default Middleware;



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
