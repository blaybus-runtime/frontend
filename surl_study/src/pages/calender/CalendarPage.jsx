import { useMemo, useRef, useState } from "react";
import MonthlyCalendar from "./components/MonthlyCalendar.jsx";
import MonthPickerPopover from "./components/MonthPickerPopover.jsx";
import TaskPanel from "./components/TaskPanel.jsx";
import GlobalPopup from "./components/GlobalPopup.jsx";
import Header from "../../components/common/Header";

const ymd = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// 데모: 월간 박스 진척도 (0, 0.25, 0.55, 1.0)
const progressByDate = {
  "2025-02-01": 0.25,
  "2025-02-02": 0.55,
  "2025-02-03": 0.25,
  "2025-02-04": 0.15,
  "2025-02-05": 0.9,
  "2025-02-06": 0.25,
  "2025-02-07": 0.35,
  "2025-02-08": 0.7,
  "2025-02-09": 1.0,
};

// 데모: 우측 리스트
const tasksByDate = {
  "2025-02-07": [
    { id: 1, subject: "국어", title: "강지현 국어", feedback: "피드백 완료", done: true },
    { id: 2, subject: "국어", title: "독서2 지문", feedback: "피드백 완료", done: true },
    { id: 3, subject: "기타", title: "플래너 업로드", feedback: "피드백 완료", done: true },
    { id: 4, subject: "영어", title: "단어 암기", feedback: "피드백 대기", done: true },
    { id: 5, subject: "영어", title: "단어 시험", feedback: "피드백 대기", done: false },
    { id: 6, subject: "수학", title: "수학 오답노트", feedback: "피드백 대기", done: false },
    { id: 7, subject: "수학", title: "수학 오답노트", feedback: "피드백 대기", done: false },
  ],
};

export default function CalendarPage() {
  const [selected, setSelected] = useState(new Date(2025, 1, 7));
  const [viewYear, setViewYear] = useState(2025);
  const [viewMonth0, setViewMonth0] = useState(1);

  const [pickerOpen, setPickerOpen] = useState(false);
  const anchorRef = useRef(null);

  const [popupOpen, setPopupOpen] = useState(false);

  const key = useMemo(() => ymd(selected), [selected]);
  const tasks = tasksByDate[key] ?? [];

  const onPickDate = (d) => {
    setSelected(d);
    setViewYear(d.getFullYear());
    setViewMonth0(d.getMonth());
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-[1180px] px-8 py-10">
        {/* 월 라벨 */}
        <div className="relative inline-block" ref={anchorRef}>
          <button
            className="inline-flex items-center gap-2 text-[18px] font-semibold text-slate-700"
            onClick={() => setPickerOpen((v) => !v)}
          >
            <span>{String(viewYear).slice(2)}년 {viewMonth0 + 1}월</span>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-slate-200 text-slate-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </button>

          <MonthPickerPopover
            open={pickerOpen}
            anchorRef={anchorRef}
            year={viewYear}
            month0={viewMonth0}
            selectedDate={selected}
            onClose={() => setPickerOpen(false)}
            onChangeYM={(y, m0) => {
              setViewYear(y);
              setViewMonth0(m0);
            }}
            onPickDate={(d) => {
              onPickDate(d);
              setPickerOpen(false);
            }}
          />
        </div>

        <div className="mt-6 flex gap-10">
          {/* 좌측 월간 캘린더 */}
          <div className="w-[680px]">
            <MonthlyCalendar
              year={viewYear}
              month0={viewMonth0}
              selectedDate={selected}
              onPickDate={onPickDate}
              progressByDate={progressByDate}
            />
          </div>

          {/* 우측 패널 */}
          <div className="w-[420px]">
            <TaskPanel selectedDate={selected} tasks={tasks} />
          </div>
        </div>
      </main>

      <GlobalPopup
        open={popupOpen}
        message="아직 미완료한 과제가 3개 있어요! 얼른 시작해 볼까요?"
        buttonLabel="과제 제출하기"
        onClose={() => setPopupOpen(false)}
        onClickButton={() => setPopupOpen(false)}
      />

      {/* 데모용: 팝업 띄우기 */}
      <button
        onClick={() => setPopupOpen(true)}
        className="fixed bottom-6 right-6 rounded-xl bg-[#6D87ED] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(15,23,42,0.18)]"
      >
        팝업 테스트
      </button>
    </div>
  );
}
