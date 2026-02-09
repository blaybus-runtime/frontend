import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "./LoginModal";
import { getNotifications, markNotificationRead } from "../../api/notification";

const SUBJECT_COLOR = {
  국어: { bg: "#FFF6E4", text: "#8F752B" },
  영어: { bg: "#FAF0ED", text: "#C25D5D" },
  수학: { bg: "#E4FBE4", text: "#648969" },
  기타: { bg: "#F1F3F7", text: "#6B7280" },
};

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return date.toLocaleDateString("ko-KR");
}

export default function Header({ userName, showAvatar = true }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const auth = useAuth();
  const navigate = useNavigate();
  const notifRef = useRef(null);

  const displayName = auth.isLoggedIn ? auth.user.name : (userName || "로그인");
  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;

  const fetchNotifications = useCallback(async () => {
    if (!auth.isLoggedIn || !auth.token) return;
    try {
      const res = await getNotifications(auth.token);
      const data = res.data ?? res;
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      // 실패해도 무시
    }
  }, [auth.isLoggedIn, auth.token]);

  // 초기 로딩 + 5초 폴링
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    }
    if (showNotif) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotif]);

  // 백엔드 URL을 프론트 라우트에 맞게 변환
  const resolveUrl = (n) => {
    const raw = n.url || n.relatedUrl || "";
    const isMentor = auth.user?.role === "MENTOR";

    // /tasks/{id} -> 멘티: /mentee/task/{id}, 멘토: /mentor/feedback/{id}
    const taskMatch = raw.match(/^\/tasks\/(\d+)/);
    if (taskMatch) {
      const taskId = taskMatch[1];
      return isMentor ? `/mentor/feedback/${taskId}` : `/mentee/task/${taskId}`;
    }

    // /planner?date=... -> 멘티 홈으로
    if (raw.startsWith("/planner")) {
      return isMentor ? "/" : "/mentee";
    }

    return raw || "/";
  };

  const handleNotifClick = async (n) => {
    // 읽음 처리
    if (!n.isRead && !n.read) {
      try {
        await markNotificationRead(auth.token, n.id);
        setNotifications((prev) =>
          prev.map((item) => (item.id === n.id ? { ...item, isRead: true, read: true } : item))
        );
      } catch {
        // 실패해도 이동
      }
    }
    setShowNotif(false);
    navigate(resolveUrl(n));
  };

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/">
            <img src="/설스터디_아이콘.svg" alt="설스터디" className="h-8" />
          </Link>

          <div className="flex items-center">
            {/* 알림 버튼 */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setShowNotif((v) => !v);
                  if (!showNotif) fetchNotifications();
                }}
                className="flex items-center gap-3 rounded-full px-3 py-2 text-sm hover:bg-gray-100 !bg-white relative"
              >
                <div className="relative">
                  <svg width="24" height="26" viewBox="0 0 26 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.3068 26.3333C15.0724 26.7374 14.7359 27.0729 14.3311 27.306C13.9263 27.5392 13.4673 27.6619 13.0001 27.6619C12.5329 27.6619 12.074 27.5392 11.6692 27.306C11.2643 27.0729 10.9279 26.7374 10.6935 26.3333M21.0001 9C21.0001 6.87827 20.1573 4.84344 18.657 3.34315C17.1567 1.84285 15.1219 1 13.0001 1C10.8784 1 8.84356 1.84285 7.34327 3.34315C5.84298 4.84344 5.00012 6.87827 5.00012 9C5.00012 18.3333 1.00012 21 1.00012 21H25.0001C25.0001 21 21.0001 18.3333 21.0001 9Z" stroke="#2B2B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white min-w-[18px] px-1">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-base font-bold">알림</span>
              </button>

              {/* 알림 드롭다운 */}
              {showNotif && (
                <div className="absolute right-0 top-full mt-2 w-[380px] rounded-2xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-50 overflow-hidden">
                  {/* 헤더 */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-gray-900">알림</span>
                      {unreadCount > 0 && (
                        <span className="text-base font-bold text-[#6D87ED]">{unreadCount}</span>
                      )}
                    </div>
                  </div>

                  {/* 알림 리스트 */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-5 py-10 text-center text-sm text-gray-400">
                        알림이 없습니다.
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const isUnread = !n.isRead && !n.read;
                        const subjectKey = n.subject || n.type;
                        const color = SUBJECT_COLOR[subjectKey] || SUBJECT_COLOR.기타;

                        // type에서 과목 태그 텍스트 결정
                        let tagText = n.subject;
                        if (!tagText) {
                          if (n.type === "NEW_COMMENT") tagText = "댓글";
                          else if (n.type === "NEW_TODO") tagText = "할일";
                          else if (n.type === "NEW_FEEDBACK") tagText = "피드백";
                          else if (n.type === "SUBMISSION") tagText = "제출";
                          else tagText = "알림";
                        }

                        return (
                          <button
                            key={n.id}
                            onClick={() => handleNotifClick(n)}
                            className={`w-full text-left px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                              isUnread ? "!bg-[#F8F9FF]" : "!bg-white"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                {/* 과목 태그 */}
                                <span
                                  className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold mb-1.5"
                                  style={{ backgroundColor: color.bg, color: color.text }}
                                >
                                  {tagText}
                                </span>
                                {/* 내용 */}
                                <p className={`text-sm leading-relaxed ${isUnread ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                                  {n.content}
                                </p>
                              </div>
                              {/* 시간 */}
                              <span className="shrink-0 text-xs text-gray-400 mt-0.5 whitespace-nowrap">
                                {timeAgo(n.createdAt)}
                              </span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (auth.isLoggedIn) {
                  auth.logout();
                  navigate("/");
                } else {
                  setShowLogin(true);
                }
              }}
              className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-gray-100 !bg-white"
            >
              {(showAvatar || auth.isLoggedIn) && <div className="h-7 w-7 rounded-full bg-gray-200" />}
              <span className="text-base font-bold">{displayName}</span>
            </button>
          </div>
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
