export default function SubmittedTaskCard({ item }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-gray-800">{item.mentee}</div>
          <div className="mt-2 text-sm text-gray-600">{item.title}</div>
        </div>

        <button className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold ${
          item.done ? "text-indigo-600 hover:bg-indigo-50" : "text-gray-400 hover:bg-gray-50"
        }`}>
          <span>🗒️</span>
          {item.status}
        </button>
      </div>
    </div>
  );
}
