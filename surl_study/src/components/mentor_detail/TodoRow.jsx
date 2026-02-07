import { useNavigate } from "react-router-dom";

export default function TodoRow({ item, subjectStyle, onToggleTask }) {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/mentor/feedback/${item.id}`, { state: { task: item } })}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-col gap-4">
          <div className="flex items-center gap-1.5 mb-3">
            <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${subjectStyle.pill}`}>
              {item.subject}
            </span>
            <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
              {item.type}
            </span>
          </div>
          <div>
            <span className="mt-2 px-0.8 text-sm font-semibold text-gray-900">{item.title}</span>
            {item.desc && (
              <>
                <span className="mx-2 text-gray-500">|</span>
                <span className="mt-1 text-xs text-gray-500">{item.desc}</span>
              </>
            )}
            {item.goal && (
              <>
                <span className="mx-2 text-gray-500">|</span>
                <span className="mt-1 text-xs text-gray-500">{item.goal}</span>
              </>
            )}
          </div>

          {item.worksheets && item.worksheets.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.worksheets.map((w) => (
                <a
                  key={w.worksheetId}
                  href={w.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  {w.title || "학습지"}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="mt-3 text-right text-xs text-gray-400">
            {item.taskDone ? "과제 완료" : "과제 미완료"}
          </div>
          <div className="mt-3 text-right text-xs text-gray-400">
            {item.taskDone ? "피드백 작성 가능" : "과제 완료 후 피드백"}
          </div>
        </div>
      </div>
    </div>
  );
}
