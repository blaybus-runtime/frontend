import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * 로그인하지 않은 사용자가 접근하면 홈(/)으로 리다이렉트.
 * state에 showLogin: true를 넘겨서 홈에서 로그인 모달을 자동으로 띄움.
 */
export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ showLogin: true, from: location.pathname }} replace />;
  }

  return children;
}
