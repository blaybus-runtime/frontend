import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { recordStudyTime } from "../../api/task";

const SUBJECTS = ["국어", "수학", "영어"];

const SUBJECT_COLORS = {
  국어: { bg: "#FFF8E1", text: "#B8860B", border: "#F0E0A0" },
  수학: { bg: "#E8F5E9", text: "#2E7D32", border: "#A5D6A7" },
  영어: { bg: "#FCE4EC", text: "#C62828", border: "#F48FB1" },
};

export default function StudyTimeModal({ onClose, onRecorded, plannerId }) {
  const { token } = useAuth();

  const [subject, setSubject] = useState("국어");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        // 백엔드에서 시간 겹침 시 RuntimeException → 500 에러 반환
        setError("시간이 겹칩니다. 다른 시간으로 설정해주세요.");
      } else {
        setError("공부 시간 기록에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
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
          <h2 className="text-lg font-bold text-gray-900">공부 시간 기록</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

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
      </div>
    </div>
  );
}
