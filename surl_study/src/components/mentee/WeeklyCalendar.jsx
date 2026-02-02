const days = [
  { label: "월", num: 26 },
  { label: "화", num: 27 },
  { label: "수", num: 28 },
  { label: "목", num: 29 },
  { label: "금", num: 30 },
  { label: "토", num: 31 },
  { label: "일", num: 1, active: true },
];

export default function WeeklyCalendar() {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d) => (
        <div key={`${d.label}-${d.num}`} className="text-center">
          <div className="text-xs text-gray-500">{d.label}</div>
          <div
            className={`mt-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
              d.active ? "bg-indigo-600 text-white" : "text-gray-800"
            }`}
          >
            {d.num}
          </div>
        </div>
      ))}
    </div>
  );
}
