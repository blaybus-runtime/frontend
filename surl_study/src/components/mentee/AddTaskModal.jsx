import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { createTaskBatch, uploadWorksheet } from "../../api/task";

const SUBJECTS = ["국어", "영어", "수학", "과학", "사회"];

export default function AddTaskModal({ onClose, onTaskAdded }) {
  const { token, user } = useAuth();

  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !title || !goal) {
      setError("과목, 할일, 목표를 모두 입력해주세요.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let worksheetId = null;

      // 파일이 있으면 먼저 worksheet 업로드
      if (file) {
        const wsRes = await uploadWorksheet(token, {
          file,
          title,
          subject,
        });
        worksheetId = wsRes.data.worksheetId;
      }

      // task 생성
      const body = {
        menteeId: user.userId,
        subject,
        goal,
        title,
        startDate: today,
        endDate: today,
      };
      if (worksheetId) body.worksheetId = worksheetId;

      const res = await createTaskBatch(token, user.userId, body);
      onTaskAdded?.(res.data);
      onClose();
    } catch (err) {
      console.error("할일 생성 실패:", err);
      setError("할일 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">할일 추가</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 과목 선택 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">과목</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubject(s)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                    subject === s
                      ? "!bg-[#6D87ED] text-white"
                      : "!bg-gray-100 text-gray-600 hover:!bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 할일 제목 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">할일</label>
            <input
              type="text"
              placeholder="예: 단어 암기 30개"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#6D87ED] focus:ring-1 focus:ring-[#6D87ED]"
            />
          </div>

          {/* 목표 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">목표</label>
            <input
              type="text"
              placeholder="예: 영단어 Day 15 완료"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#6D87ED] focus:ring-1 focus:ring-[#6D87ED]"
            />
          </div>

          {/* 파일 첨부 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              첨부파일 <span className="text-gray-400 font-normal">(선택)</span>
            </label>

            {!file ? (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-[#6D87ED] hover:text-[#6D87ED] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.44 11.05L12.25 20.24C10.12 22.37 6.71 22.37 4.58 20.24C2.45 18.11 2.45 14.7 4.58 12.57L13.07 4.08C14.48 2.67 16.78 2.67 18.19 4.08C19.6 5.49 19.6 7.79 18.19 9.2L10.4 16.99C9.7 17.69 8.56 17.69 7.86 16.99C7.16 16.29 7.16 15.15 7.86 14.45L14.65 7.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                파일 선택
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.89 2 4 2.89 4 4V20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#6D87ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="truncate text-sm text-gray-700">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="ml-2 text-gray-400 hover:text-red-500 text-lg leading-none"
                >
                  &times;
                </button>
              </div>
            )}
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-2.5 text-sm font-bold text-white transition-all ${
              loading
                ? "!bg-[#B0BEE8] cursor-not-allowed"
                : "!bg-[#6D87ED] hover:!bg-[#5a74d6] cursor-pointer"
            }`}
          >
            {loading ? (file ? "업로드 및 추가 중..." : "추가 중...") : "추가하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
