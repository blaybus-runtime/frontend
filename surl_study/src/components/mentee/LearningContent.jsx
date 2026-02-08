import { useState, useRef } from "react";

export default function LearningContent({
  worksheets = [],
  submissions = [],
  onSubmitFiles,
  uploading = false,
}) {
  const [activeTab, setActiveTab] = useState("학습 내용 공유");
  const tabs = ["학습 내용 공유", "학습지"];
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (onSubmitFiles) {
      await onSubmitFiles(files);
    }
    // reset input so same file can be re-selected
    e.target.value = "";
  };

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

        {/* ── 학습 내용 공유 탭 ── */}
        {activeTab === "학습 내용 공유" && (
          <>
            {/* 첨부파일 헤더 + 추가 버튼 */}
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                첨부파일{" "}
                {submissions.length > 0 && `(${submissions.length})`}
              </span>
              {onSubmitFiles && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-indigo-50 hover:text-[#6D87ED] hover:border-indigo-200 transition-colors disabled:opacity-50"
                    title="파일 첨부"
                  >
                    {uploading ? (
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="opacity-25"
                        />
                        <path
                          d="M4 12a8 8 0 018-8"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </>
              )}
            </div>

            {/* 제출된 파일 목록 */}
            {submissions.length > 0 ? (
              <div className="mt-3 space-y-2">
                {submissions.map((file, idx) => (
                  <a
                    key={file.submissionId + "-" + idx}
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6D87ED"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-gray-900">
                        {file.fileName || "제출 파일"}
                      </div>
                      {file.createdAt && (
                        <div className="text-xs text-gray-500">
                          {file.createdAt}
                        </div>
                      )}
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9CA3AF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ))}
              </div>
            ) : (
              <div className="mt-3 flex h-20 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
                {onSubmitFiles ? "+ 버튼을 눌러 학습 내용을 제출하세요" : "제출된 학습 내용이 없습니다"}
              </div>
            )}
          </>
        )}

        {/* ── 학습지 탭 ── */}
        {activeTab === "학습지" && (
          <>
            {/* 첨부파일 헤더 */}
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                첨부파일{" "}
                {worksheets.length > 0 && `(${worksheets.length})`}
              </span>
            </div>

            {/* 학습지 목록 */}
            {worksheets.length > 0 ? (
              <div className="mt-3 space-y-2">
                {worksheets.map((file) => (
                  <a
                    key={file.worksheetId}
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6D87ED"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-gray-900">
                        {file.title || "학습지"}
                      </div>
                      {file.subject && (
                        <div className="text-xs text-gray-500">
                          {file.subject}
                        </div>
                      )}
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9CA3AF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ))}
              </div>
            ) : (
              <div className="mt-3 flex h-20 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
                등록된 학습지가 없습니다
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
