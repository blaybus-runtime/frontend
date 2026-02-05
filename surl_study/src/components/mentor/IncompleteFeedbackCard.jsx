import { useNavigate } from "react-router-dom";

const colorMap = {
  rose: { bg: "bg-rose-50", text: "text-rose-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
};

export default function IncompleteFeedbackCard({ item }) {
  const colors = colorMap[item.subjectColor] || colorMap.blue;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/mentor/feedback/${item.id}`)}
      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-900">{item.mentee}</div>
        <div className="mt-1 flex items-center gap-2">
          <span className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}>
            {item.subject}
          </span>
          <span className="text-sm text-gray-500 truncate">{item.title}</span>
        </div>
      </div>
      <span className="ml-4 shrink-0 text-xs text-gray-400">{item.timeAgo}</span>
    </div>
  );
}
