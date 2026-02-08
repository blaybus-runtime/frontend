const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function WeeklyCalendar({ selectedDate, onSelectDate }) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
  // 월요일 기준 오프셋 (일=6, 월=0, 화=1 ...)
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const isToday = (d) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const isSelected = (d) => selectedDate && formatDate(d) === selectedDate;

  return (
    <div className="px-4 pt-4 pb-2 border-b border-gray-100">
      <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2">
        {DAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center">
        {dates.map((d, i) => (
          <div key={i} className="flex justify-center">
            <button
              onClick={() => onSelectDate?.(formatDate(d))}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold cursor-pointer transition-colors ${
                isSelected(d)
                  ? "bg-[#6D87ED] text-white"
                  : isToday(d)
                    ? "bg-[#E8EAF0] text-[#6D87ED]"
                    : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {d.getDate()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
