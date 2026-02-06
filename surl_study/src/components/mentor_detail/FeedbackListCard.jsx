export default function FeedbackListCard({ count, items, subjectStyle, onToggleFeedback }) {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="text-xl font-semibold">미완료 피드백 <span className="text-indigo-600">{count}</span></div>
      </div>
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="max-h-[360px] overflow-auto rounded-lg border border-gray-200">
        <div className="divide-y divide-gray-100">
          {items.map((it) => {
            const s = subjectStyle(it.subject);
            return (
              <div key={it.id} className="flex items-center justify-between gap-4 px-4 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${s.pill}`}>
                      {it.subject}
                    </span>
                    <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                      {it.type}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-gray-900">{it.title}</div>
                  <div className="mt-1 text-xs text-gray-500">{it.desc}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs text-gray-400">{it.date.replaceAll("-", ".")}</div>
                  <button
                    onClick={() => onToggleFeedback(it.id)}
                    className={`rounded-md px-3 py-2 text-xs font-semibold ${
                      it.feedbackDone ? "text-indigo-600 hover:bg-indigo-50" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {it.feedbackDone ? "피드백 완료" : "피드백 쓰기"}
                  </button>
                </div>
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="p-6 text-sm text-gray-500">미완료 피드백이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
