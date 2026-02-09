import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import { useAuth } from "../../context/AuthContext";
import { createTaskBatch, createMenteeTaskBatch, uploadMentorWorksheet, uploadMenteeWorksheet } from "../../api/task";
import { getMyMentees } from "../../api/matching";

const SUBJECTS = ["국어", "영어", "수학", "기타"];
const SUBJECT_STYLE = {
  국어: "!bg-amber-50 !text-amber-700 ring-1 ring-amber-300",
  영어: "!bg-rose-50 !text-rose-700 ring-1 ring-rose-300",
  수학: "!bg-emerald-50 !text-emerald-700 ring-1 ring-emerald-300",
  기타: "!bg-indigo-50 !text-indigo-700 ring-1 ring-indigo-300",
};
const WEEKDAYS = [
  { key: 0, label: "일" },
  { key: 1, label: "월" },
  { key: 2, label: "화" },
  { key: 3, label: "수" },
  { key: 4, label: "목" },
  { key: 5, label: "금" },
  { key: 6, label: "토" },
];

function toISO(date) {
  return format(date, "yyyy-MM-dd");
}

export default function AddTaskModal({ onClose, onTaskAdded, fixedMenteeId }) {
  const { token, user } = useAuth();

  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  });
  const todayKey = new Date().getDay();
  const [repeatDays, setRepeatDays] = useState([todayKey]);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  // 멘토용
  const [mentees, setMentees] = useState([]);
  const [selectedMenteeId, setSelectedMenteeId] = useState(fixedMenteeId ? String(fixedMenteeId) : "");
  const isMentor = user?.role === "MENTOR";
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!isMentor || !token) return;
    getMyMentees(token, today)
      .then((res) => {
        const list = (res.data ?? res) || [];
        setMentees(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("멘티 목록 조회 실패:", err);
        setMentees([]);
      });
  }, [isMentor, token, today]);

  const toggleRepeatDay = (dayKey) => {
    setRepeatDays((prev) =>
      prev.includes(dayKey)
        ? prev.filter((d) => d !== dayKey)
        : [...prev, dayKey].sort((a, b) => a - b)
    );
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) {
      const newFiles = selected.map((f) => ({ file: f, days: [] }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 파일별 요일 드롭다운 토글
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleFileDay = (fileIndex, dayKey) => {
    if (!repeatDays.includes(dayKey)) return;
    setFiles((prev) =>
      prev.map((item, i) =>
        i === fileIndex
          ? {
              ...item,
              days: item.days.includes(dayKey)
                ? item.days.filter((d) => d !== dayKey)
                : [...item.days, dayKey].sort((a, b) => a - b),
            }
          : item
      )
    );
  };

  const getFileDaysLabel = (item) => {
    if (item.days.length === 0) return "요일 선택";
    return item.days.map((k) => WEEKDAYS.find((w) => w.key === k)?.label).join(", ");
  };

  const getFileExtension = (filename) => {
    const ext = filename.split(".").pop().toUpperCase();
    if (["PDF", "PNG", "JPG", "JPEG", "DOC", "DOCX", "HWP"].includes(ext)) return ext;
    return "FILE";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isMentor && !selectedMenteeId) {
      setError("할 일을 추가할 멘티를 선택해주세요.");
      return;
    }
    if (!subject || !title || !goal) {
      setError("과목, 제목, 목표를 모두 입력해주세요.");
      return;
    }
    if (!startDate || !endDate) {
      setError("시작일과 종료일을 선택해주세요.");
      return;
    }
    if (repeatDays.length === 0) {
      setError("반복 요일을 하나 이상 선택해주세요.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const uploadFn = isMentor ? uploadMentorWorksheet : uploadMenteeWorksheet;
      const uploadedFiles = [];

      for (const f of files) {
        try {
          const wsRes = await uploadFn(token, {
            file: f.file,
            title,
            subject,
          });
          const wsPayload = wsRes.data ?? wsRes;
          const fileDayLabels = { 0: "일", 1: "월", 2: "화", 3: "수", 4: "목", 5: "금", 6: "토" };
          uploadedFiles.push({
            worksheetId: wsPayload.worksheetId,
            weekdays: f.days.length > 0 ? f.days.map((k) => fileDayLabels[k]) : null,
          });
        } catch (uploadErr) {
          console.error("파일 업로드 실패:", f.file.name, uploadErr);
        }
      }

      const weekdayLabels = { 0: "일", 1: "월", 2: "화", 3: "수", 4: "목", 5: "금", 6: "토" };
      const weekdays = repeatDays.map((k) => weekdayLabels[k]);

      const body = {
        subject,
        goal,
        title,
        startDate: toISO(startDate),
        endDate: toISO(endDate),
        weekdays,
        files: uploadedFiles,
      };

      let res;
      if (isMentor) {
        body.menteeId = Number(selectedMenteeId);
        res = await createTaskBatch(token, body);
      } else {
        res = await createMenteeTaskBatch(token, body);
      }
      const payload = res.data ?? res;
      onTaskAdded?.(payload);
      onClose();
    } catch (err) {
      console.error("할 일 생성 실패:", err);
      setError("할 일 생성에 실패했습니다. 다시 시도해주세요.");
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
        className="w-full max-w-2xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="px-8 pt-8 pb-2">
          <h2 className="text-xl font-bold text-gray-900">할 일 추가</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8">
          {/* 멘토용: 멘티 선택 */}
          {isMentor && !fixedMenteeId && (
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-gray-800">멘티 선택</label>
              <select
                value={selectedMenteeId}
                onChange={(e) => setSelectedMenteeId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#6D87ED] focus:ring-1 focus:ring-[#6D87ED]"
              >
                <option value="">멘티를 선택하세요</option>
                {mentees.map((m) => (
                  <option key={m.menteeId} value={m.menteeId}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 과목 */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              과목 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubject(s)}
                  className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${
                    subject === s
                      ? SUBJECT_STYLE[s]
                      : "!bg-gray-100 text-gray-500 hover:!bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 날짜 + 반복 요일 (같은 줄) */}
          <div className="mt-5 flex gap-6">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                날짜 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <DatePicker
                    selected={startDate}
                    onChange={(d) => setStartDate(d)}
                    locale={ko}
                    dateFormat="yyyy.MM.dd"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#6D87ED]"
                  />
                </div>
                <span className="text-gray-400">~</span>
                <div className="flex-1">
                  <DatePicker
                    selected={endDate}
                    onChange={(d) => setEndDate(d)}
                    locale={ko}
                    dateFormat="yyyy.MM.dd"
                    minDate={startDate}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#6D87ED]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">반복 요일 설정</label>
              <div className="flex gap-1">
                {WEEKDAYS.map((w) => (
                  <button
                    key={w.key}
                    type="button"
                    onClick={() => toggleRepeatDay(w.key)}
                    className={`h-10 w-10 rounded-lg text-sm font-medium transition-all ${
                      repeatDays.includes(w.key)
                        ? "!bg-[#6D87ED] text-white"
                        : "!bg-gray-100 text-gray-500 hover:!bg-gray-200"
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 제목 */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="예: 강지영 국어"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#6D87ED] focus:ring-1 focus:ring-[#6D87ED]"
            />
          </div>

          {/* 목표 */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              목표 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="예: 강지영 국어 5p 풀기"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#6D87ED] focus:ring-1 focus:ring-[#6D87ED]"
            />
          </div>

          {/* 학습지 파일 */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-gray-800">학습지 파일</label>

            {/* 파일 목록 */}
            {files.length > 0 && (
              <div className="space-y-2 mb-3">
                {files.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2"
                  >
                    {/* 파일 정보 */}
                    <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5">
                      <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                        {getFileExtension(item.file.name)}
                      </span>
                      <span className="flex-1 truncate text-sm text-gray-700">
                        {item.file.name.replace(/\.[^/.]+$/, "")}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="ml-1 text-gray-400 hover:text-red-500"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>

                    {/* 요일 선택 드롭다운 */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                        className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 whitespace-nowrap"
                      >
                        {getFileDaysLabel(item)}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>

                      {openDropdown === idx && (
                        <div className="absolute right-0 top-full z-10 mt-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                          <div className="flex gap-1">
                            {repeatDays.map((dayKey) => {
                              const label = WEEKDAYS.find((w) => w.key === dayKey)?.label;
                              return (
                                <button
                                  key={dayKey}
                                  type="button"
                                  onClick={() => toggleFileDay(idx, dayKey)}
                                  className={`h-8 w-8 rounded-md text-xs font-medium transition-all ${
                                    item.days.includes(dayKey)
                                      ? "!bg-[#6D87ED] text-white"
                                      : "!bg-gray-100 text-gray-500 hover:!bg-gray-200"
                                  }`}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 파일 추가 영역 */}
            <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-5 text-gray-400 hover:border-[#6D87ED] hover:text-[#6D87ED] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="text-sm">PDF 및 칼럼 추가</span>
              <input
                ref={fileRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

          {/* 하단 버튼 */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg !bg-[#F1F1F4] py-3 text-sm font-semibold text-gray-600 hover:!bg-[#E5E5EA] transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 rounded-lg py-3 text-sm font-bold text-white transition-all ${
                loading
                  ? "!bg-[#B0BEE8] cursor-not-allowed"
                  : "!bg-[#6D87ED] hover:!bg-[#5a74d6] cursor-pointer"
              }`}
            >
              {loading ? (files.length > 0 ? "업로드 및 추가 중..." : "추가 중...") : "할 일 추가"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
