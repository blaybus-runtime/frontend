import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

// 더미 데이터 (24시간을 12개 구간, 2시간 단위)
const DEFAULT_STUDY_DATA = [
  { time: "2",  국어: 0, 수학: 0, 영어: 0 },
  { time: "4",  국어: 0, 수학: 0, 영어: 0 },
  { time: "6",  국어: 2, 수학: 0, 영어: 0 },
  { time: "8",  국어: 3, 수학: 1, 영어: 0 },
  { time: "10", 국어: 0, 수학: 4, 영어: 2 },
  { time: "12", 국어: 0, 수학: 0, 영어: 0 },
  { time: "14", 국어: 0, 수학: 0, 영어: 0 },
  { time: "16", 국어: 1, 수학: 0, 영어: 2 },
  { time: "18", 국어: 0, 수학: 1, 영어: 0 },
  { time: "20", 국어: 0, 수학: 0, 영어: 0 },
  { time: "22", 국어: 1, 수학: 0, 영어: 0 },
  { time: "24", 국어: 0, 수학: 0, 영어: 0 },
];

const DEFAULT_SUBJECTS = [
  { name: "국어", color: "#86EFAC" },
  { name: "수학", color: "#FDE047" },
  { name: "영어", color: "#FDA4AF" },
];

export default function StudyTimeChart({
  studyData = DEFAULT_STUDY_DATA,
  totalHours = 8,
  subjects = DEFAULT_SUBJECTS,
}) {
  return (
    <div>
      {/* 범례 행 */}
      <div className="flex items-center justify-between px-2 mb-2">
        {/* 왼쪽: 총 시간 */}
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#6D87ED]" />
          <span className="text-xs text-gray-600 font-medium">
            총 {totalHours}시간
          </span>
        </div>
        {/* 오른쪽: 과목별 범례 */}
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

      {/* 레이더 차트 */}
      <div className="w-full" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={studyData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, "auto"]}
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              axisLine={false}
            />
            {subjects.map((s) => (
              <Radar
                key={s.name}
                name={s.name}
                dataKey={s.name}
                stroke={s.color}
                fill={s.color}
                fillOpacity={0.4}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
