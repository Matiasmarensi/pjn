// PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("authHeader") !== null;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;