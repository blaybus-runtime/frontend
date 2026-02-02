export default function MentorMenteeCard({ mentee }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col items-center">
        <div className="h-16 w-16 rounded-full bg-gray-200" />
        <div className="mt-3 text-sm font-semibold text-gray-800">{mentee.name}</div>

        <div className="mt-3 w-full border-t border-gray-100 pt-3">
          <div className={`flex items-center justify-center gap-2 text-xs font-semibold ${mentee.done ? "text-indigo-600" : "text-gray-400"}`}>
            <span className="text-sm">🗒️</span>
            {mentee.status}
          </div>
        </div>
      </div>
    </div>
  );
}
