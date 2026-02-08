import { useEffect, useMemo, useRef, useState } from "react";
import MonthlyCalendar from "./components/MonthlyCalendar.jsx";
import MonthPickerPopover from "./components/MonthPickerPopover.jsx";
import TaskPanel from "./components/TaskPanel.jsx";
import GlobalPopup from "./components/GlobalPopup.jsx";
import Header from "../../components/common/Header";
import { useAuth } from "../../context/AuthContext";
import { getStudyDaily } from "../../api/task";

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

export default function CalendarPage() {
  const today = new Date();
  const [selected, setSelected] = useState(today);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth0, setViewMonth0] = useState(today.getMonth());

  const [pickerOpen, setPickerOpen] = useState(false);
  const anchorRef = useRef(null);

  const [popupOpen, setPopupOpen] = useState(false);

  const [tasks, setTasks] = useState([]);
  const { token, user } = useAuth();

  const key = useMemo(() => ymd(selected), [selected]);

  useEffect(() => {
    if (!user?.userId || !token) return;

    let cancelled = false;
    (async () => {
      try {
        const json = await getStudyDaily(token, user.userId, key);
        if (cancelled) return;
        const data = json.data ?? json;
        const todos = data.todos ?? [];
        setTasks(
          todos.map((t) => ({
            id: t.id,
            subject: t.subject ?? "기타",
            title: t.content ?? t.title,
            feedback: t.isFeedbackDone || t.isFeedbackCompleted ? "피드백 완료" : "피드백 대기",
            done: !!t.isCompleted,
            isSubmitted: t.isSubmitted ?? false,
          }))
        );
      } catch (err) {
        if (!cancelled) {
          console.error("캘린더 할 일 API 호출 실패:", err);
          setTasks([]);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [key, token, user]);

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
            <TaskPanel selectedDate={selected} tasks={tasks} onSelectDate={onPickDate} />
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
