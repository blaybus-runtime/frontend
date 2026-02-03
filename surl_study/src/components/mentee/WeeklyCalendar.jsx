export default function WeeklyCalendar() {
  // 1. 오늘 날짜 정보 가져오기
  const today = new Date();
  const currentDay = today.getDay(); // 0(일) ~ 6(토)
  const currentDate = today.getDate();

  // 2. 이번 주 월요일 찾기 (일요일이 0이므로 조정 필요)
  // 월요일을 시작으로 만들기 위해 일요일(0)인 경우 -6을 해줍니다.
  const diffToMonday = today.getDay() === 0 ? -6 : 1 - today.getDay();
  const monday = new Date(today);
  monday.setDate(currentDate + diffToMonday);

  // 3. 월요일부터 7일간의 데이터 생성
  const labels = ["월", "화", "수", "목", "금", "토", "일"];
  const weekDays = labels.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    
    return {
      label,
      num: date.getDate(),
      // 오늘 날짜와 계산된 날짜가 같은지 확인 (연/월/일 모두 비교가 안전)
      active: date.toDateString() === today.toDateString(),
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
                ? "bg-[#F0F3FF] text-[#6D87ED] shadow-sm" // 오늘 날짜 하이라이트
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