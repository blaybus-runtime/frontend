const DOW = ["일", "월", "화", "수", "목", "금", "토"];

const ymd = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

function Tag({ subject }) {
  const map = {
    국어: { bg: "#FFF6E4", text: "#8F752B" },
    영어: { bg: "#FAF0ED", text: "#C25D5D" },
    수학: { bg: "#E4FBE4", text: "#648969" },
    기타: { bg: "#F1F3F7", text: "#6B7280" },
  };
  const c = map[subject] ?? map.기타;

  return (
    <span
      className="inline-flex h-6 items-center rounded-md px-3 text-[12px] font-semibold"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {subject}
    </span>
  );
}

function Check({ checked, muted }) {
  const bg = muted ? "#CBD5E1" : "#6D87ED";
  return (
    <span
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg"
      style={{ backgroundColor: checked ? bg : "#FFFFFF", border: checked ? "none" : "1px solid #E5E7EB" }}
    >
      {checked && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
          <path
            d="M20 7L10 17l-5-5"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

function Feedback({ status }) {
  const done = status === "피드백 완료";
  const color = done ? "#6D87ED" : "#B0B8C4";

  return (
    <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 5h16v11H7l-3 3V5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
      <span>{status}</span>
    </div>
  );
}

function WeekHeader({ selectedDate, onSelectDate }) {
  const start = new Date(selectedDate);
  start.setDate(selectedDate.getDate() - selectedDate.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  const selKey = ymd(selectedDate);

  return (
    <div className="flex items-center justify-between px-2 pb-5">
      {days.map((d, i) => {
        const isSel = ymd(d) === selKey;
        return (
          <button
            key={i}
            className="flex w-10 flex-col items-center gap-2 cursor-pointer bg-transparent border-none p-0"
            onClick={() => onSelectDate?.(d)}
          >
            <div className="text-[12px] font-medium text-slate-400">{DOW[i]}</div>
            <div
              className={[
                "flex h-9 w-9 items-center justify-center rounded-full text-[18px] font-semibold",
                isSel ? "bg-[#DAE1FF] text-[#6D87ED]" : "text-slate-800",
              ].join(" ")}
            >
              {d.getDate()}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function TaskPanel({ selectedDate, tasks, onSelectDate }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_14px_rgba(15,23,42,0.06)]">
      <WeekHeader selectedDate={selectedDate} onSelectDate={onSelectDate} />

      <div className="flex flex-col gap-4">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-slate-100 bg-white px-5 py-4"
          >
            <div className="flex items-start justify-between">
              <Tag subject={t.subject} />
              <Check checked={t.done} muted={!t.done} />
            </div>

            <div className="mt-3 text-[18px] font-semibold text-slate-900">
              {t.title}
            </div>

            <div className="mt-3 flex justify-end">
              <Feedback status={t.feedback} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
