import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * 로그인하지 않은 사용자가 접근하면 홈(/)으로 리다이렉트.
 * requiredRole이 지정되면 해당 role만 접근 가능.
 * role이 맞지 않으면 자신의 role에 맞는 메인 페이지로 리다이렉트.
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ showLogin: true, from: location.pathname }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    const fallback = user?.role === "MENTOR" ? "/mentor" : "/mentee";
    return <Navigate to={fallback} replace />;
  }

  return children;
}
