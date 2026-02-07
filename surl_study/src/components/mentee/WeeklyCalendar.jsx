export default function WeeklyCalendar({ dailyStats = [], selectedDate, onSelectDate }) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0(일) ~ 6(토)

  // 이번 주 일요일 찾기
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);

  // dailyStats를 date 키로 조회할 수 있도록 Map 생성
  const statsMap = {};
  dailyStats.forEach((stat) => {
    statsMap[stat.date] = stat;
  });

  const fmt = (d) => d.toISOString().split("T")[0];

  const labels = ["일", "월", "화", "수", "목", "금", "토"];
  const weekDays = labels.map((label, index) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + index);
    const dateStr = fmt(date);

    return {
      label,
      num: date.getDate(),
      dateStr,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: selectedDate === dateStr,
    };
  });

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDays.map((d) => (
        <div
          key={`${d.label}-${d.num}`}
          className="text-center cursor-pointer"
          onClick={() => onSelectDate?.(d.dateStr)}
        >
          <div className="text-sm text-gray-400 font-medium">{d.label}</div>
          <div
            className={`mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
              d.isSelected
                ? "bg-[#6D87ED] text-white"
                : d.isToday
                  ? "ring-2 ring-[#6D87ED] text-[#6D87ED]"
                  : "text-gray-800 hover:bg-gray-100"
            }`}
          >
            {d.num}
          </div>
        </div>
      ))}
    </div>
  );
}
