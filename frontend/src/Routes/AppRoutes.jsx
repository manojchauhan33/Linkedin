import { Routes, Route } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Home from "../pages/Home";
import ProfilePage from "../pages/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage";
import Middleware from "../components/Middleware";
import Postpage from "../pages/Postpage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Middleware>
            <Signup />
          </Middleware>
        }
      />
      <Route
        path="/login"
        element={
          <Middleware>
            <Login />
          </Middleware>
        }
      />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        path="/home"
        element={
          <Middleware>
            <Home />
          </Middleware>
        }
      />
      <Route
        path="/profilePage"
        element={
          <Middleware>
            <ProfilePage />
          </Middleware>
        }
      />
      <Route
        path="/edit-profile"
        element={
          <Middleware>
            <EditProfilePage />
          </Middleware>
        }
      />
      <Route
        path="postpage"
        element={
          <Middleware>
            <Postpage/>
          </Middleware>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
