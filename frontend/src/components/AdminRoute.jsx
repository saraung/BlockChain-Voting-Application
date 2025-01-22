import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) return <Navigate to="/login" replace />;
  return userInfo.isAdmin ? children || <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
