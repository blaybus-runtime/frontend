export default function WeeklyCalendar({ dailyStats = [] }) {
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

  const labels = ["일", "월", "화", "수", "목", "금", "토"];
  const weekDays = labels.map((label, index) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + index);

    return {
      label,
      num: date.getDate(),
      active: date.toDateString() === today.toDateString(),
    };
  });

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDays.map((d) => (
        <div key={`${d.label}-${d.num}`} className="text-center">
          <div className="text-sm text-gray-400 font-medium">{d.label}</div>
          <div
            className={`mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
              d.active
                ? "bg-[#6D87ED] text-white"
                : "text-gray-800"
            }`}
          >
            {d.num}
          </div>
        </div>
      ))}
    </div>
  );
}
