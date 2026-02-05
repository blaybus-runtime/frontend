import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/common/Header";
import LoginModal from "../../components/common/LoginModal";

export default function HomePage() {
  const [selected, setSelected] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ProtectedRoute에서 리다이렉트되어 왔을 때 자동으로 로그인 모달 띄우기
  useEffect(() => {
    if (location.state?.showLogin) {
      setShowLogin(true);
      // state 초기화 (뒤로가기 시 다시 안 뜨도록)
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const handleStart = () => {
    if (selected === "mentor") navigate("/mentor");
    if (selected === "mentee") navigate("/mentee");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Header userName="로그인" showAvatar={false} />

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm overflow-visible text-center">
          <p className="mb-1 whitespace-nowrap text-base font-bold text-gray-900">
            설스터디와 함께 스터디를 시작해 보세요!
          </p>
          <p className="mb-6 text-xs text-gray-400">
            로그인 할 본인의 역할을 선택해주세요.
          </p>

          {/* Role selection cards */}
          <div className="mb-6 flex justify-center gap-5">
            {/* 멘토 카드 */}
            <button
              onClick={() => setSelected("mentor")}
              className={`rounded-xl overflow-hidden transition-all ${
                selected === "mentor"
                  ? "ring-3 ring-[#6D87ED]"
                  : "ring-1 ring-gray-200 hover:ring-gray-300"
              }`}
            >
              <img src="/멘토_버튼.png" alt="멘토" className="w-36" />
            </button>

            {/* 멘티 카드 */}
            <button
              onClick={() => setSelected("mentee")}
              className={`rounded-xl overflow-hidden transition-all ${
                selected === "mentee"
                  ? "ring-3 ring-[#6D87ED]"
                  : "ring-1 ring-gray-200 hover:ring-gray-300"
              }`}
            >
              <img src="/멘티_버튼.png" alt="멘티" className="w-36" />
            </button>
          </div>

          {/* 시작하기 버튼 */}
          <button
            onClick={handleStart}
            disabled={!selected}
            className={`w-full rounded-lg py-2.5 text-sm font-bold text-white transition-all ${
              selected
                ? "!bg-[#6D87ED] hover:!bg-[#5a74d6] cursor-pointer"
                : "!bg-[#B0BEE8] cursor-not-allowed"
            }`}
          >
            시작하기
          </button>
        </div>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
