import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import { useAuth } from "../../context/AuthContext";
import { createTaskBatch, createMenteeTaskBatch, uploadMentorWorksheet, uploadMenteeWorksheet } from "../../api/task";
import { getMyMentees } from "../../api/matching";

const SUBJECTS = ["국어", "영어", "수학"];
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
  // 날짜 범위 선택
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  });
  // 반복 요일 설정 (0=일, 1=월, ... 6=토)
  const todayKey = new Date().getDay(); // 0(일)~6(토)
  const [repeatDays, setRepeatDays] = useState([todayKey]);
  // 다중 파일: [{ file, days: [] }, ...]
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  // 멘토용: 멘티 목록 & 선택된 멘티
  const [mentees, setMentees] = useState([]);
  const [selectedMenteeId, setSelectedMenteeId] = useState(fixedMenteeId ? String(fixedMenteeId) : "");
  const isMentor = user?.role === "MENTOR";

  const today = new Date().toISOString().split("T")[0];

  // 멘토 로그인 시 멘티 목록 조회
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
    // input 초기화 (같은 파일 재선택 가능)
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isMentor && !selectedMenteeId) {
      setError("할일을 추가할 멘티를 선택해주세요.");
      return;
    }

    if (!subject || !title || !goal) {
      setError("과목, 할일, 목표를 모두 입력해주세요.");
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
      // 1) 모든 파일을 먼저 worksheet로 업로드 → worksheetId 획득
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

      // 2) 백엔드 요청 body 구성
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
        const menteeId = Number(selectedMenteeId);
        body.menteeId = menteeId;
        res = await createTaskBatch(token, body);
      } else {
        res = await createMenteeTaskBatch(token, body);
      }
      const payload = res.data ?? res;
      onTaskAdded?.(payload);
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
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto"
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
          {/* 멘토용: 멘티 선택 (fixedMenteeId가 있으면 숨김) */}
          {isMentor && !fixedMenteeId && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">멘티 선택</label>
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

          {/* 날짜 범위 선택 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              날짜 <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <DatePicker
                  selected={startDate}
                  onChange={(d) => setStartDate(d)}
                  locale={ko}
                  dateFormat="yyyy.MM.dd"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#6D87ED] focus:ring-1 focus:ring-[#6D87ED]"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#6D87ED] focus:ring-1 focus:ring-[#6D87ED]"
                />
              </div>
            </div>
          </div>

          {/* 반복 요일 설정 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">반복 요일 설정</label>
            <div className="flex gap-1.5">
              {WEEKDAYS.map((w) => (
                <button
                  key={w.key}
                  type="button"
                  onClick={() => toggleRepeatDay(w.key)}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                    repeatDays.includes(w.key)
                      ? "!bg-[#6D87ED] text-white"
                      : "!bg-gray-100 text-gray-600 hover:!bg-gray-200"
                  }`}
                >
                  {w.label}
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

          {/* 다중 파일 첨부 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              첨부파일 <span className="text-gray-400 font-normal">(선택, 다중 업로드 가능)</span>
            </label>

            {/* 파일 추가 버튼 */}
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-[#6D87ED] hover:text-[#6D87ED] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.44 11.05L12.25 20.24C10.12 22.37 6.71 22.37 4.58 20.24C2.45 18.11 2.45 14.7 4.58 12.57L13.07 4.08C14.48 2.67 16.78 2.67 18.19 4.08C19.6 5.49 19.6 7.79 18.19 9.2L10.4 16.99C9.7 17.69 8.56 17.69 7.86 16.99C7.16 16.29 7.16 15.15 7.86 14.45L14.65 7.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              파일 선택
              <input
                ref={fileRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* 업로드된 파일 목록 + 요일 배정 */}
            {files.length > 0 && (
              <div className="mt-2 space-y-2">
                {files.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    {/* 파일 이름 & 삭제 */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6C4.89 2 4 2.89 4 4V20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#6D87ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="truncate text-sm text-gray-700">{item.file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="ml-2 text-gray-400 hover:text-red-500 text-lg leading-none"
                      >
                        &times;
                      </button>
                    </div>

                    {/* 요일 배정 칩 */}
                    {repeatDays.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {repeatDays.map((dayKey) => {
                          const label = WEEKDAYS.find((w) => w.key === dayKey)?.label;
                          return (
                            <button
                              key={dayKey}
                              type="button"
                              onClick={() => toggleFileDay(idx, dayKey)}
                              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                                item.days.includes(dayKey)
                                  ? "!bg-[#6D87ED] text-white"
                                  : "!bg-white text-gray-500 border border-gray-300 hover:border-[#6D87ED] hover:text-[#6D87ED]"
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {repeatDays.length === 0 && (
                      <p className="text-xs text-gray-400">위에서 반복 요일을 먼저 선택해주세요</p>
                    )}
                  </div>
                ))}
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
            {loading ? (files.length > 0 ? "업로드 및 추가 중..." : "추가 중...") : "추가하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
