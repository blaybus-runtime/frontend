import React, { useMemo } from "react";

const K_DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const clamp01 = (n) => Math.max(0, Math.min(1, n));

const ymdKey = (date) => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getMonthMatrix = (year, monthIndex0) => {
  const first = new Date(year, monthIndex0, 1);
  const startDay = first.getDay();
  const cells = [];
  let day = 1 - startDay;

  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(year, monthIndex0, day);
      row.push({
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        date,
        inMonth: date.getMonth() === monthIndex0,
      });
      day++;
    }
    cells.push(row);
  }

  const lastRowAllNext = cells[5].every((c) => c.date.getMonth() !== monthIndex0);
  return lastRowAllNext ? cells.slice(0, 5) : cells;
};

export default function CalendarMonth({
  year,
  monthIndex0,
  selectedDate,
  onSelectDate,
  progressByDate = {},
}) {
  const matrix = useMemo(() => getMonthMatrix(year, monthIndex0), [year, monthIndex0]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_2px_14px_rgba(15,23,42,0.06)]">
      <div className="grid grid-cols-7 gap-3">
        {K_DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-slate-400">
            {d}
          </div>
        ))}

        {matrix.flat().map((cell) => {
          const key = ymdKey(cell.date);
          const inMonth = cell.inMonth;
          const progress = clamp01(progressByDate[key] ?? 0);
          const isSelected = ymdKey(selectedDate) === key;
          const fillH = Math.round(progress * 100);

          return (
            <button
              key={cell.key}
              onClick={() => inMonth && onSelectDate(cell.date)}
              disabled={!inMonth}
              className={[
                "relative h-[74px] rounded-xl border text-left transition overflow-hidden",
                inMonth ? "bg-white" : "bg-white/50 opacity-40 cursor-default",
                isSelected ? "border-[#6D87ED]" : "border-slate-100 hover:border-slate-200",
              ].join(" ")}
            >
              {/* ✅ 진척도 그라디언트 채움: from #ADBCF7 → to #6D87ED */}
              {inMonth && progress > 0 ? (
                <div
                  className="absolute inset-x-0 bottom-0 rounded-xl bg-gradient-to-b from-[#ADBCF7] to-[#6D87ED]"
                  style={{ height: `${fillH}%` }}
                />
              ) : null}

              {/* 선택 스트로크 */}
              {isSelected ? (
                <div className="absolute inset-0 rounded-xl border-2 border-[#6D87ED]" />
              ) : null}

              {/* 날짜 */}
              <div className="relative z-10 p-2">
                <span
                  className={[
                    "text-xs",
                    isSelected ? "font-semibold text-slate-700" : "font-normal text-slate-500",
                  ].join(" ")}
                >
                  {cell.date.getDate()}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
