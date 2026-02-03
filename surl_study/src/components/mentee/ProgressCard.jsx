// 1. 개별 링 컴포넌트
function ProgressRing({ label, percentage, isDone }) {
  const size = 40; // 전체 크기를 40px로 고정
  const strokeWidth = 4;
  const radius = size / 2;
  const normalizedRadius = radius - strokeWidth;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* 40x40 고정 컨테이너 */}
      <div className="relative h-10 w-10 flex items-center justify-center">
        {isDone ? (
          /* 완료 상태: 전체가 꽉 찬 파란색 원 */
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#6D87ED]">
            <svg width="14" height="10" viewBox="0 0 12 10" fill="none">
              <path 
                d="M1 5L4.5 8.5L11 1.5" 
                stroke="white" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ) : (
          /* 진행 중 상태: SVG 링 */
          <svg 
            height={size} 
            width={size} 
            className="rotate-[-90deg]"
          >
            {/* 배경 원 */}
            <circle
              stroke="#E2E8F0"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* 진행도 선 */}
            <circle
              stroke="#8CA3FF"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
        )}
      </div>
      {/* 라벨 텍스트 */}
      <span className="text-[11px] font-medium text-gray-500">{label}</span>
    </div>
  );
}

export default function ProgressCard() {
  return (
    <div className="flex items-center gap-8 rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
      {/* 왼쪽 불꽃 박스 */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-50 bg-white p-4 shadow-inner min-w-[100px]">
        <span className="text-4xl mb-2">🔥</span>
        <span className="text-2xl font-bold text-gray-800">97%</span>
      </div>

      {/* 오른쪽 진척도 영역 */}
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-bold text-gray-800">진척도</h3>
        <div className="flex items-center gap-5">
          <ProgressRing label="국어" percentage={75} />
          <ProgressRing label="영어" percentage={100} isDone />
          <ProgressRing label="수학" percentage={40} />
        </div>
      </div>
    </div>
  );
}