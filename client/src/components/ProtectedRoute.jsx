import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const { token, user } = useSelector((state) => state.auth);

  // Non loggato → vai al login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
