export default function MentorMenteeCard({ mentee, feedbackCount = 0 }) {
  const hasFeedback = feedbackCount > 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col items-center">
        <img
          src={mentee.avatar || "/Avator_icon.png"}
          alt={mentee.name}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div className="mt-3 text-sm font-semibold text-gray-800">{mentee.name}</div>

        <div className="mt-3 w-full border-t border-gray-200 pt-3">
          <div className={`flex items-center justify-center gap-1 text-xs font-semibold ${
            hasFeedback ? "text-[#6D87ED]" : "text-gray-400"
          }`}>
            {/* <span className="text-sm">🗒️</span> */}
            {hasFeedback
              ? `미완료 피드백 ${feedbackCount}`
              : "미완료 피드백 0"
            }
          </div>
        </div>
      </div>
    </div>
  );
}
