import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// 과목별 색상
const SUBJECT_COLORS = {
  국어: "#FDE68A", // 노랑
  수학: "#86EFAC", // 초록
  영어: "#FDA4AF", // 분홍
};

const EMPTY_COLOR = "transparent";
const STROKE_COLOR = "#E5E7EB";

const DEFAULT_SUBJECTS = [
  { name: "국어", color: "#FDE68A" },
  { name: "수학", color: "#86EFAC" },
  { name: "영어", color: "#FDA4AF" },
];

// timeRecords를 24시간 스케줄로 변환하는 함수
// timeRecords: [{ id, subject, startTime: "HH:mm:ss", endTime: "HH:mm:ss" }, ...]
function convertTimeRecordsToSchedule(timeRecords) {
  // 24시간 초기화 (모두 null)
  const schedule = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    subject: null,
  }));

  if (!timeRecords || timeRecords.length === 0) {
    return schedule;
  }

  // 각 timeRecord를 해당 시간대에 매핑
  timeRecords.forEach((record) => {
    const startHour = parseInt(record.startTime?.split(":")[0], 10);
    const endHour = parseInt(record.endTime?.split(":")[0], 10);
    const endMinute = parseInt(record.endTime?.split(":")[1], 10);

    if (isNaN(startHour) || isNaN(endHour)) return;

    // startHour부터 endHour까지 해당 과목으로 채움
    // endHour가 정각이 아니면 해당 시간도 포함
    const actualEndHour = endMinute > 0 ? endHour : endHour - 1;

    for (let h = startHour; h <= actualEndHour && h < 24; h++) {
      schedule[h].subject = record.subject;
    }
  });

  return schedule;
}

// 총 공부 시간 계산 (분 단위 → 시간)
function calculateTotalHours(timeRecords) {
  if (!timeRecords || timeRecords.length === 0) return 0;

  let totalMinutes = 0;
  timeRecords.forEach((record) => {
    const [sh, sm] = (record.startTime || "00:00:00").split(":").map(Number);
    const [eh, em] = (record.endTime || "00:00:00").split(":").map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    if (diff > 0) totalMinutes += diff;
  });

  return Math.round(totalMinutes / 60 * 10) / 10; // 소수점 1자리
}

// 24시간 라벨 위치를 계산 (시계 방향, 12시=24/0)
function getHourLabelPos(hour, radius) {
  // 24시간 시계: 0시(=24시)가 상단(12시 방향)
  // 각도: 0시 → -90도, 시계방향으로 15도씩
  const angle = (hour / 24) * 360 - 90;
  const rad = (angle * Math.PI) / 180;
  return {
    x: Math.cos(rad) * radius,
    y: Math.sin(rad) * radius,
  };
}

export default function StudyTimeChart({
  timeRecords = [],
  subjects = DEFAULT_SUBJECTS,
}) {
  // timeRecords를 24시간 스케줄로 변환
  const schedule = useMemo(
    () => convertTimeRecordsToSchedule(timeRecords),
    [timeRecords]
  );

  // 총 공부 시간 계산
  const totalHours = useMemo(
    () => calculateTotalHours(timeRecords),
    [timeRecords]
  );

  // PieChart용 데이터: 모든 슬라이스가 동일한 크기(value=1), 24개
  const pieData = schedule.map((slot) => ({
    name: `${slot.hour}시`,
    value: 1,
    subject: slot.subject,
  }));

  return (
    <div>
      {/* 범례 행 */}
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#6D87ED]" />
          <span className="text-xs text-gray-600 font-medium">
            총 {totalHours}시간
          </span>
        </div>
        <div className="flex items-center gap-3">
          {subjects.map((s) => (
            <div key={s.name} className="flex items-center gap-1">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-xs text-gray-600">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 24시간 시계형 파이 차트 */}
      <div className="relative w-full [&_path]:outline-none [&_.recharts-sector]:outline-none" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius="1%"
              outerRadius="72%"
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke={STROKE_COLOR}
              strokeWidth={1}
              isAnimationActive={false}
              activeIndex={-1}
              activeShape={null}
              style={{ outline: "none" }}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.subject
                      ? SUBJECT_COLORS[entry.subject] || "#D1D5DB"
                      : EMPTY_COLOR
                  }
                  fillOpacity={entry.subject ? 0.6 : 0}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* 시간 라벨 오버레이 (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="-150 -150 300 300"
        >
          {Array.from({ length: 24 }, (_, i) => {
            const hour = i;
            const labelRadius = 132;
            const pos = getHourLabelPos(hour, labelRadius);
            // 6, 12, 18, 24(0)만 볼드 + 크게
            const isMajor = hour === 0 || hour === 6 || hour === 12 || hour === 18;
            const displayHour = hour === 0 ? "24" : String(hour);
            return (
              <text
                key={hour}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isMajor ? 13 : 10}
                fontWeight={isMajor ? 700 : 400}
                fill={isMajor ? "#374151" : "#9CA3AF"}
              >
                {displayHour}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
