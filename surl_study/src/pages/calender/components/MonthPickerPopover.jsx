import { useEffect, useMemo, useRef } from "react";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const ymd = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

function buildMatrix(year, month0) {
  const first = new Date(year, month0, 1);
  const start = first.getDay();
  let day = 1 - start;

  const rows = [];
  for (let r = 0; r < 6; r++) {
    const row = [];
    for (let c = 0; c < 7; c++) {
      const d = new Date(year, month0, day);
      row.push({ d, inMonth: d.getMonth() === month0 });
      day++;
    }
    rows.push(row);
  }
  const lastAllNext = rows[5].every((x) => x.d.getMonth() !== month0);
  return lastAllNext ? rows.slice(0, 5) : rows;
}

export default function MonthPickerPopover({
  open,
  anchorRef,
  year,
  month0,
  selectedDate,
  onClose,
  onChangeYM,
  onPickDate,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      const pop = ref.current;
      const anchor = anchorRef?.current;
      if (pop?.contains(e.target)) return;
      if (anchor?.contains(e.target)) return;
      onClose?.();
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open, onClose, anchorRef]);

  const matrix = useMemo(() => buildMatrix(year, month0), [year, month0]);
  const years = useMemo(() => Array.from({ length: 9 }, (_, i) => 2021 + i), []);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  // 피그마: 선택일이 속한 "주(일~토)" 회색 pill 라인
  const weekStart = useMemo(() => {
    const d = new Date(selectedDate);
    d.setDate(selectedDate.getDate() - selectedDate.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }, [selectedDate]);
  const weekKeys = useMemo(() => {
    const set = new Set();
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      set.add(ymd(d));
    }
    return set;
  }, [weekStart]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-3 w-[420px] rounded-2xl bg-white p-5
                 shadow-[0_14px_40px_rgba(15,23,42,0.18)]
                 border border-slate-100"
      style={{ left: 0, top: "100%" }}
    >
      {/* 상단 컨트롤 */}
      <div className="flex items-center justify-between pb-4">
        <button
          className="h-9 w-9 rounded-lg hover:bg-slate-50 text-slate-500"
          onClick={() => {
            const prev = month0 - 1;
            if (prev < 0) onChangeYM(year - 1, 11);
            else onChangeYM(year, prev);
          }}
        >
          ‹
        </button>

        <div className="flex items-center gap-3">
          <select
            value={year}
            onChange={(e) => onChangeYM(Number(e.target.value), month0)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={month0 + 1}
            onChange={(e) => onChangeYM(year, Number(e.target.value) - 1)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
        </div>

        <button
          className="h-9 w-9 rounded-lg hover:bg-slate-50 text-slate-500"
          onClick={() => {
            const next = month0 + 1;
            if (next > 11) onChangeYM(year + 1, 0);
            else onChangeYM(year, next);
          }}
        >
          ›
        </button>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 gap-2 pb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[11px] font-medium text-slate-400">
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 gap-2">
        {matrix.flat().map(({ d, inMonth }) => {
          const k = ymd(d);
          const isInWeek = weekKeys.has(k);
          const isSelected = k === ymd(selectedDate);

          // 피그마처럼: 주간은 연한 회색 pill, 선택일은 파란 pill
          const base =
            !inMonth
              ? "text-slate-300"
              : isSelected
              ? "bg-[#6D87ED] text-white font-semibold"
              : isInWeek
              ? "bg-[#F1F3F7] text-slate-800"
              : "text-slate-900 hover:bg-slate-50";

          return (
            <button
              key={k}
              disabled={!inMonth}
              onClick={() => inMonth && onPickDate(d)}
              className={[
                "h-10 rounded-xl text-sm transition",
                base,
                !inMonth && "cursor-default bg-transparent",
              ].filter(Boolean).join(" ")}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
