import WeeklyCalendar from "../../../components/mentee/WeeklyCalendar";
import TaskCard from "../../../components/mentee/TaskCard";

const ymd = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function TaskPanel({ selectedDate, tasks, onSelectDate, dailyStats }) {
  const selectedDateStr = ymd(selectedDate);

  const handleSelectDate = (dateStr) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const newDate = new Date(y, m - 1, d);
    onSelectDate?.(newDate);
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_14px_rgba(15,23,42,0.06)]">
      <WeeklyCalendar
        dailyStats={dailyStats}
        selectedDate={selectedDateStr}
        onSelectDate={handleSelectDate}
      />

      <div className="mt-5 flex flex-col gap-4">
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} hideWorksheets />
        ))}
      </div>
    </div>
  );
}
