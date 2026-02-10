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
    <div className="grid grid-cols-7 gap-2 p-4">
      {weekDays.map((d) => (
        <div
          key={`${d.label}-${d.num}`}
          className="text-center cursor-pointer"
          onClick={() => onSelectDate?.(d.dateStr)}
        >
          {/* 요일 라벨 스타일 */}
          <div className="text-sm text-gray-400 font-medium mb-1">{d.label}</div>

          {/* 날짜 숫자 스타일 */}
          <div
              className={`inline-flex h-9 w-9 items-center justify-center text-sm font-bold transition-all ${
                  d.isSelected
                      ? "bg-[#6D87ED] text-white rounded-full shadow-sm" // 🔴 1. rounded-xl로 더 둥글게 수정
                      : "text-gray-800 hover:bg-gray-100 rounded-xl"  // 🔴 2. 오늘 날짜(isToday) 특수 CSS 제거
              }`}
          >
            {d.num}
          </div>
        </div>
      ))}
    </div>
  );
}
