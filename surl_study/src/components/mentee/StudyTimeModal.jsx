import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { recordStudyTime, deleteTimeRecord } from "../../api/task";

const SUBJECTS = ["국어", "수학", "영어"];

const SUBJECT_COLORS = {
  국어: { bg: "#FFF8E1", text: "#B8860B", border: "#F0E0A0" },
  수학: { bg: "#E8F5E9", text: "#2E7D32", border: "#A5D6A7" },
  영어: { bg: "#FCE4EC", text: "#C62828", border: "#F48FB1" },
};

export default function StudyTimeModal({ onClose, onRecorded, plannerId, timeRecords = [], editMode = false }) {
  const { token } = useAuth();

  const [subject, setSubject] = useState("국어");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [currentTab, setCurrentTab] = useState(editMode ? "list" : "add"); // "add" | "list"

  const handleSubmit = async () => {
    if (!subject) {
      setError("과목을 선택해주세요.");
      return;
    }
    if (!startTime || !endTime) {
      setError("시작 시간과 종료 시간을 입력해주세요.");
      return;
    }
    if (startTime >= endTime) {
      setError("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }
    if (!plannerId) {
      setError("오늘의 플래너가 없습니다. 할일을 먼저 추가해주세요.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const body = {
        plannerId,
        subject,
        startTime: startTime + ":00", // HH:mm → HH:mm:ss
        endTime: endTime + ":00",
      };

      await recordStudyTime(token, body);
      onRecorded?.();
      onClose();
    } catch (err) {
      console.error("공부 시간 기록 실패:", err);
      console.error("err.data:", err.data);
      console.error("err.message:", err.message);
      console.error("err.status:", err.status);
      const msg = err.data?.message || err.data?.error || err.message || "";
      if (
        msg.includes("이미") ||
        msg.includes("already") ||
        msg.includes("겹") ||
        msg.includes("overlap") ||
        msg.includes("공부 기록")
      ) {
        setError("시간이 겹칩니다. 다른 시간으로 설정해주세요.");
      } else if (err.status === 500) {
        setError("시간이 겹칩니다. 다른 시간으로 설정해주세요.");
      } else {
        setError("공부 시간 기록에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordId) => {
    setDeletingId(recordId);
    try {
      await deleteTimeRecord(token, recordId);
      onRecorded?.();
    } catch (err) {
      console.error("공부 시간 삭제 실패:", err);
      setError("삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setDeletingId(null);
    }
  };

  // 공부 시간 계산
  const getDuration = () => {
    if (!startTime || !endTime || startTime >= endTime) return null;
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
  };

  // 시간 포맷 (HH:mm:ss → HH:mm)
  const formatTime = (t) => {
    if (!t) return "";
    return t.slice(0, 5);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {currentTab === "list" ? "공부 시간 관리" : "공부 시간 기록"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* 탭 전환 (기록이 있을 때만) */}
        {timeRecords.length > 0 && (
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => { setCurrentTab("add"); setError(""); }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                currentTab === "add"
                  ? "!bg-[#6D87ED] text-white"
                  : "!bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              새 기록
            </button>
            <button
              onClick={() => { setCurrentTab("list"); setError(""); }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                currentTab === "list"
                  ? "!bg-[#6D87ED] text-white"
                  : "!bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              기록 관리
            </button>
          </div>
        )}

        {/* 새 기록 탭 */}
        {currentTab === "add" && (
          <>
            {/* 시간 입력 */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">공부 시간</label>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#6D87ED] focus:ring-1 focus:ring-[#6D87ED]"
                />
                <span className="text-gray-400">~</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#6D87ED] focus:ring-1 focus:ring-[#6D87ED]"
                />
              </div>
              {getDuration() && (
                <p className="mt-2 text-sm text-[#6D87ED] font-medium">
                  총 {getDuration()}
                </p>
              )}
            </div>

            {/* 과목 선택 */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">과목</label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((s) => {
                  const colors = SUBJECT_COLORS[s];
                  const isSelected = subject === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSubject(s)}
                      className="rounded-lg px-5 py-2 text-sm font-medium transition-all"
                      style={
                        isSelected
                          ? { backgroundColor: colors.bg, color: colors.text, border: `1.5px solid ${colors.border}` }
                          : { backgroundColor: "#F3F4F6", color: "#6B7280", border: "1.5px solid transparent" }
                      }
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-1 rounded-lg py-2.5 text-sm font-bold text-white transition-all ${
                  loading
                    ? "!bg-[#B0BEE8] cursor-not-allowed"
                    : "!bg-[#6D87ED] hover:!bg-[#5a74d6] cursor-pointer"
                }`}
              >
                {loading ? "기록 중..." : "확인"}
              </button>
            </div>
          </>
        )}

        {/* 기록 관리 탭 */}
        {currentTab === "list" && (
          <>
            {timeRecords.length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
                기록된 공부 시간이 없습니다
              </div>
            ) : (
              <div className="max-h-80 space-y-2 overflow-y-auto">
                {timeRecords.map((record) => {
                  const colors = SUBJECT_COLORS[record.subject] || { bg: "#F3F4F6", text: "#6B7280", border: "#D1D5DB" };
                  const isDeleting = deletingId === record.id;
                  return (
                    <div
                      key={record.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="rounded-md px-2.5 py-1 text-xs font-semibold"
                          style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                        >
                          {record.subject}
                        </span>
                        <span className="text-sm text-gray-700">
                          {formatTime(record.startTime)} ~ {formatTime(record.endTime)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(record.id)}
                        disabled={isDeleting}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-50"
                        title="삭제"
                      >
                        {isDeleting ? (
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

            <div className="mt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
