export default function WeeklyCalendar({ dailyStats = [] }) {
  // 1. 오늘 날짜 정보 가져오기
  const today = new Date();
  const currentDay = today.getDay(); // 0(일) ~ 6(토)
  const currentDate = today.getDate();

  // 2. 이번 주 월요일 찾기 (일요일이 0이므로 조정 필요)
  const diffToMonday = today.getDay() === 0 ? -6 : 1 - today.getDay();
  const monday = new Date(today);
  monday.setDate(currentDate + diffToMonday);

  // 3. dailyStats를 date 키로 빠르게 조회할 수 있도록 Map 생성
  const statsMap = {};
  dailyStats.forEach((stat) => {
    statsMap[stat.date] = stat;
  });

  // 4. 월요일부터 7일간의 데이터 생성
  const labels = ["월", "화", "수", "목", "금", "토", "일"];
  const weekDays = labels.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    // yyyy-MM-dd 형식으로 변환해서 statsMap과 매칭
    const dateStr = date.toISOString().split("T")[0];
    const stat = statsMap[dateStr];

    return {
      label,
      num: date.getDate(),
      active: date.toDateString() === today.toDateString(),
      hasTodo: stat?.hasTodo || false,
      progressRate: stat?.progressRate ?? null,
    };
  });

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDays.map((d) => (
        <div key={`${d.label}-${d.num}`} className="text-center">
          <div className="text-base text-gray-400 font-medium">{d.label}</div>
          <div
            className={`mt-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-xl font-semibold transition-colors ${
              d.active
                ? "bg-[#F0F3FF] text-[#6D87ED] shadow-sm"
                : "text-gray-800 hover:bg-gray-100"
            }`}
          >
            {d.num}
          </div>
          {/* 달성률 표시 (데이터가 있을 때만) */}
          {d.progressRate !== null && (
            <div className="mt-1 text-[10px] font-medium text-[#6D87ED]">
              {d.progressRate}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
