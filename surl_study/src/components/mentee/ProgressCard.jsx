function Ring({ label, active }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full border-4 ${active ? "border-indigo-500" : "border-indigo-200"}`}>
        <div className={`h-6 w-6 rounded-full ${active ? "bg-indigo-500" : "bg-indigo-200"}`} />
      </div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}

export default function ProgressCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center gap-5">
        <div className="flex items-end gap-3">
          <div className="text-3xl">🔥</div>
          <div className="text-2xl font-bold">97%</div>
        </div>

        <div className="flex-col gap-3">
          <div className="mr-2 text-sm font-semibold text-gray-700">진척도</div>
          <div className="flex items-center gap-6">
            <Ring label="국어" active />
            <Ring label="영어" active={false} />
            <Ring label="수학" active={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
