import { useNavigate } from "react-router-dom";

// 과목명 → 스타일 직접 매핑 (Tailwind JIT가 클래스를 감지할 수 있도록 전체 문자열 사용)
// 여기 수정해야 함
const subjectStyleMap = {
  국어: "bg-amber-100 text-amber-700",
  영어: "bg-rose-100 text-rose-700",
  수학: "bg-emerald-100 text-emerald-700",
};
const defaultStyle = "bg-gray-100 text-gray-600";

export default function IncompleteFeedbackCard({ item }) {
  const badgeStyle = subjectStyleMap[item.subject] || defaultStyle;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/mentor/feedback/${item.id}`)}
      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-900">{item.mentee}</div>
        <div className="mt-1 flex items-center gap-2">
          <span className={`shrink-0 inline-flex rounded px-2 py-0.5 text-xs font-semibold ${badgeStyle}`}>
            {item.subject}
          </span>
          <span className="text-sm text-gray-500 truncate min-w-0">{item.title}</span>
        </div>
      </div>
      <span className="ml-4 shrink-0 text-xs text-gray-400">{item.timeAgo}</span>
    </div>
  );
}
