import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, userType } = useContext(AuthContext);
  if (!isAuthenticated || userType !== "admin") {
    return <Navigate to="/login/admin" replace />;
  } else {
    return <Outlet />;
  }
};
