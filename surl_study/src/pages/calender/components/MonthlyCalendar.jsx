import { useMemo } from "react";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const ymd = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// 피그마: 3단계(20~30 / 50~60 / 100) 느낌으로 컷팅
const snapProgress = (p) => {
  if (!p || p <= 0) return 0;
  if (p < 0.45) return 0.28;
  if (p < 0.95) return 0.58;
  return 1;
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
  // 마지막 주가 다음달로만 채워졌으면 제거
  const lastAllNext = rows[5].every((x) => x.d.getMonth() !== month0);
  return lastAllNext ? rows.slice(0, 5) : rows;
}

export default function MonthlyCalendar({
  year,
  month0,
  selectedDate,
  onPickDate,
  progressByDate = {},
}) {
  const matrix = useMemo(() => buildMatrix(year, month0), [year, month0]);
  const selectedKey = ymd(selectedDate);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-[0_2px_14px_rgba(15,23,42,0.06)]">
      {/* 요일 */}
      <div className="grid grid-cols-7 gap-4 pb-3">
        {DAYS.map((d, i) => (
          <div key={d} className={`text-center text-[13px] font-medium ${i === 0 ? "text-red-500" : "text-slate-500"}`}>
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 셀 */}
      <div className="grid grid-cols-7 gap-4">
        {matrix.flat().map(({ d, inMonth }) => {
          const key = ymd(d);
          const isSelected = key === selectedKey;

          const raw = progressByDate[key] ?? 0;
          const p = snapProgress(raw);
          const fillH = Math.round(p * 100);

          return (
            <button
              key={key}
              disabled={!inMonth}
              onClick={() => inMonth && onPickDate(d)}
              className={[
                "relative h-[92px] rounded-xl border bg-white text-left overflow-hidden",
                inMonth ? "border-slate-100 hover:border-slate-200" : "border-transparent opacity-0 pointer-events-none",
              ].join(" ")}
            >
              {/* 피그마: 하단에서 위로 차오르는 그라디언트 */}
              {p > 0 && (
                <div
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#6D87ED] to-[#ADBCF7]"
                  style={{
                    height: `${fillH}%`,
                    borderBottomLeftRadius: "12px",
                    borderBottomRightRadius: "12px",
                    opacity: 0.75,
                  }}
                />
              )}

              {/* 선택 스트로크 */}
              {isSelected && (
                <div className="absolute inset-0 rounded-xl border-2 border-[#6D87ED] pointer-events-none" />
              )}

              {/* 날짜 */}
              <div className="absolute top-1.5 left-2 z-10">
                <span
                  className={[
                    "text-[13px]",
                    isSelected ? "font-semibold text-slate-800" : "font-normal text-slate-500",
                  ].join(" ")}
                >
                  {d.getDate()}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
