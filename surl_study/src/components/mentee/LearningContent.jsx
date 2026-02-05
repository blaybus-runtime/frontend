import { useState } from "react";

export default function LearningContent({ data }) {
  const [activeTab, setActiveTab] = useState("학습 내용 공유");
  const tabs = ["학습 내용 공유", "학습지"];

  // 보이는 썸네일 수 (나머지는 +N으로 표시)
  const VISIBLE_COUNT = 3;
  const extraCount = data.attachments.length - VISIBLE_COUNT;

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900">학습 내용</h2>

      {/* 흰색 카드 영역 */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
        {/* 탭 */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg px-6 py-2.5 text-sm font-semibold transition ${
                activeTab === tab
                  ? "!bg-[#6D87ED] text-white"
                  : "!bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 첨부파일 헤더 */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">첨부파일</span>
        <button className="text-gray-400 hover:text-gray-600">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.25 3H3C2.60218 3 2.22064 3.15804 1.93934 3.43934C1.65804 3.72064 1.5 4.10218 1.5 4.5V15C1.5 15.3978 1.65804 15.7794 1.93934 16.0607C2.22064 16.342 2.60218 16.5 3 16.5H13.5C13.8978 16.5 14.2794 16.342 14.5607 16.0607C14.842 15.7794 15 15.3978 15 15V9.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.875 1.87499C14.1734 1.57662 14.578 1.40901 15 1.40901C15.422 1.40901 15.8266 1.57662 16.125 1.87499C16.4234 2.17336 16.591 2.57798 16.591 2.99999C16.591 3.42201 16.4234 3.82662 16.125 4.12499L9 11.25L6 12L6.75 8.99999L13.875 1.87499Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* 첨부파일 썸네일 그리드 */}
      <div className="mt-3 flex gap-3">
        {/* 추가 버튼 */}
        <button className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 첨부 이미지 썸네일 */}
        {data.attachments.slice(0, VISIBLE_COUNT).map((file) => (
          <div
            key={file.id}
            className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-200"
          >
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              IMG
            </div>
          </div>
        ))}

        {/* +N 표시 */}
        {extraCount > 0 && (
          <button className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-500">
            +{extraCount}
          </button>
        )}
        </div>

        {/* 학습 내용 이미지 (스크롤 가능) */}
        <div className="mt-5 overflow-hidden rounded-xl">
          <div className="relative w-full">
            {/* 플레이스홀더 이미지 영역 */}
            <div className="flex h-[400px] items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
              학습 내용 이미지가 여기에 표시됩니다
            </div>

            {/* 좌우 네비게이션 */}
            <button className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full !bg-white shadow-md hover:bg-gray-50">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="#374151"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
