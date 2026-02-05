import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";

export default function HomePage() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleStart = () => {
    if (selected === "mentor") navigate("/mentor");
    if (selected === "mentee") navigate("/mentee");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
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
              className={`flex w-36 flex-col items-center rounded-xl border-2 px-5 py-5 transition-all !bg-white ${
                selected === "mentor"
                  ? "border-[#6D87ED] shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="#B0BEE8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                    stroke="#B0BEE8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                멘토
              </span>
            </button>

            {/* 멘티 카드 */}
            <button
              onClick={() => setSelected("mentee")}
              className={`flex w-36 flex-col items-center rounded-xl border-2 px-5 py-5 transition-all !bg-white ${
                selected === "mentee"
                  ? "border-[#6D87ED] shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="#B0BEE8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                    stroke="#B0BEE8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                멘티
              </span>
            </button>
          </div>

          {/* 시작하기 버튼 */}
          <button
            onClick={handleStart}
            disabled={!selected}
            className={`w-full rounded-lg py-2.5 text-sm font-bold text-white transition-all ${
              selected
                ? "!bg-[#6D87ED] hover:!bg-[#5a74d6] cursor-pointer"
                : "!bg-gray-300 cursor-not-allowed"
            }`}
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
