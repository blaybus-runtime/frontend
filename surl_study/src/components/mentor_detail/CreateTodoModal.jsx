import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { format } from "date-fns";


const SUBJECTS = ["국어", "영어", "수학", "기타"];
const WEEKDAYS = [
  { key: 0, label: "일" },
  { key: 1, label: "월" },
  { key: 2, label: "화" },
  { key: 3, label: "수" },
  { key: 4, label: "목" },
  { key: 5, label: "금" },
  { key: 6, label: "토" },
];

// function toYMD(date) {
//   return format(date, "yyyy.MM.dd");
// }
function toISO(date) {
  return format(date, "yyyy-MM-dd");
}

export default function CreateTodoModal({ open, onClose, onSubmit }) {
  const [subject, setSubject] = useState("국어");
  const [startDate, setStartDate] = useState(new Date(2026, 1, 1)); // 2026-02-01
  const [endDate, setEndDate] = useState(new Date(2026, 1, 28));
  const [repeatDays, setRepeatDays] = useState([1]); // 월 반복(예시)
  const [title, setTitle] = useState("강지연 국어");
  const [goal, setGoal] = useState("강지연 국어 5p 풀기");
  const [fileName, setFileName] = useState("20260205 학습지");
  const [file, setFile] = useState(null);

  // 모달 열릴 때 스크롤 잠금 + ESC 닫기
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const canSubmit = useMemo(() => {
    return title.trim().length > 0 && goal.trim().length > 0 && startDate && endDate;
  }, [title, goal, startDate, endDate]);

  const toggleRepeat = (dayKey) => {
    setRepeatDays((prev) =>
      prev.includes(dayKey) ? prev.filter((d) => d !== dayKey) : [...prev, dayKey].sort((a, b) => a - b)
    );
  };

  const handleSubmit = () => {
    console.log("handleSubmit 클릭됨", { canSubmit, title, goal, startDate, endDate });
    if (!canSubmit) return;

    // 제출 데이터 (나중에 API로 보내면 됨)
    const payload = {
      subject,
      startDateISO: toISO(startDate),
      endDateISO: toISO(endDate),
      repeatDays, // [1,3,5] 등
      title: title.trim(),
      goal: goal.trim(),
      fileName: fileName.trim(),
      file, // File 객체
    };

    onSubmit?.(payload);
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* dim */}
      <button
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="모달 닫기"
        type="button"
      />

      {/* modal */}
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
        <div className="text-lg font-bold text-gray-900">할 일 생성</div>

        {/* 과목 */}
        <div className="mt-5">
          <div className="text-sm font-semibold text-gray-800">
            과목 <span className="text-rose-500">*</span>
          </div>

          <div className="mt-2 flex gap-2">
            {SUBJECTS.map((s) => {
              const active = s === subject;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubject(s)}
                  className={`rounded-md px-3 py-2 text-sm font-semibold ${
                    active ? "bg-amber-50 text-amber-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* 날짜 */}
        <div className="mt-5">
          <div className="text-sm font-semibold text-gray-800">
            날짜 <span className="text-rose-500">*</span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <div className="w-full">
              <DatePicker
                selected={startDate}
                onChange={(d) => setStartDate(d)}
                locale={ko}
                dateFormat="yyyy.MM.dd"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-300"
              />
            </div>
            <span className="text-gray-400">~</span>
            <div className="w-full">
              <DatePicker
                selected={endDate}
                onChange={(d) => setEndDate(d)}
                locale={ko}
                dateFormat="yyyy.MM.dd"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-300"
              />
            </div>
          </div>

          {/* 반복 요일 */}
          <div className="mt-3">
            <div className="text-sm font-semibold text-gray-800">반복 요일 설정</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {WEEKDAYS.map((w) => {
                const active = repeatDays.includes(w.key);
                return (
                  <button
                    key={w.key}
                    type="button"
                    onClick={() => toggleRepeat(w.key)}
                    className={`h-9 w-9 rounded-md text-sm font-bold ${
                      active ? "bg-indigo-50 text-indigo-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {w.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 제목 */}
        <div className="mt-5">
          <div className="text-sm font-semibold text-gray-800">
            제목 <span className="text-rose-500">*</span>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-300"
            placeholder="예: 강지연 국어"
          />
        </div>

        {/* 목표 */}
        <div className="mt-4">
          <div className="text-sm font-semibold text-gray-800">
            목표 <span className="text-rose-500">*</span>
          </div>
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-300"
            placeholder="예: 강지연 국어 5p 풀기"
          />
        </div>

        {/* 학습지 파일 */}
        <div className="mt-4">
          <div className="text-sm font-semibold text-gray-800">학습지 파일</div>

          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">PDF</span>

            <input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-300"
              placeholder="파일 이름"
            />
          </div>

          <label className="mt-3 flex h-24 cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-sm font-semibold text-gray-500 hover:bg-gray-100">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">+</span>
              <span>PDF 파일 첨부 추가</span>
            </div>
          </label>

          {file && <div className="mt-2 text-xs text-gray-500">선택됨: {file.name}</div>}
        </div>

        {/* footer */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-100 py-3 text-sm font-bold text-gray-700 hover:bg-gray-200"
          >
            취소
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className={`rounded-xl py-3 text-sm font-bold text-white ${
              canSubmit ? "bg-[#6D87ED] hover:opacity-90" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            할일 추가
          </button>
        </div>
      </div>
    </div>
  );
}
