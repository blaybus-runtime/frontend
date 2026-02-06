import { useMemo } from "react";
import { parseISO, startOfWeek, addDays, format } from "date-fns";
import { ko } from "date-fns/locale";

const labels = ["일", "월", "화", "수", "목", "금", "토"];

export default function WeekStrip({ selectedDate, onSelectDate }) {
  const week = useMemo(() => {
    const base = parseISO(selectedDate); // "2026-02-01" -> Date
    const start = startOfWeek(base, { weekStartsOn: 0 }); // 일요일 시작

    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(start, i);
      return {
        label: labels[i],
        day: format(d, "d", { locale: ko }),            // "1", "2" ...
        date: format(d, "yyyy-MM-dd"),                 // "2026-02-01"
      };
    });
  }, [selectedDate]);

  return (
    <div className="rounded-lg border border-none bg-white px-4 py-3">
      <div className="grid grid-cols-7 gap-2">
        {week.map((d) => {
          const isActive = d.date === selectedDate;

          return (
            <button 
              key={d.date} 
              onClick={() => onSelectDate(d.date)} 
              className="text-center !bg-white"
              type="button"
            >
              <div className="text-base text-gray-500">{d.label}</div>
              <div
                className={`mt-2 inline-flex h-9 w-9 items-center justify-center rounded-full text- font-semibold ${
                  isActive ? "bg-[#6D87ED] text-white" : "text-gray-600"
                }`}
              >
                {d.day}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
