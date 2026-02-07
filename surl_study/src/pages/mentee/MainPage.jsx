import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import TaskCard from "../../components/mentee/TaskCard";
import WeeklyCalendar from "../../components/mentee/WeeklyCalendar";
import StudyTimeChart from "../../components/mentee/StudyTimeChart";
import ColumnCard from "../../components/mentee/ColumnCard";
import FloatingButton from "../../components/common/FloatingButton";
import AddTaskModal from "../../components/mentee/AddTaskModal";
import StudyTimeModal from "../../components/mentee/StudyTimeModal";
import { useAuth } from "../../context/AuthContext";
import { getStudyDaily } from "../../api/task";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// 과목별 태그 색상 매핑
const SUBJECT_COLORS = {
  국어: "bg-amber-100 text-amber-700",
  영어: "bg-rose-100 text-rose-700",
  수학: "bg-emerald-100 text-emerald-700",
};
const DEFAULT_TAG_COLOR = "bg-gray-100 text-gray-700";

// 더미 데이터 (API 실패 시 폴백)
const fallbackTasks = [
  { id: 1, tag: "국어", tagColor: "bg-amber-100 text-amber-700", title: "강지연 국어", status: "피드백 완료", done: true },
  { id: 2, tag: "영어", tagColor: "bg-rose-100 text-rose-700", title: "단어 암기", status: "피드백 대기", done: false },
];

// 서울대쌤 칼럼 (하드코딩)
const COLUMNS = [
  { title: "🍀짧은 시간이 힘, 자투리 10분이 성적을 바꾼다", url: "https://malachite-fontina-5e0.notion.site/10-2a2a56db4060803ca058df5adf8e85b2" },
  { title: "🔥공부가 하기 싫은 날, 그래도 포기하지 않는 방법", url: "https://malachite-fontina-5e0.notion.site/2a2a56db40608002adbfff5b2891a30e" },
  { title: "📚지금 당장 생산적인 공부를 하는 법(1)", url: "https://malachite-fontina-5e0.notion.site/1-2f2a56db40608040bb50cfda6bc9fbeb" },
  { title: "📕수능 국어 공부법: '읽어야할 것'은 진짜입니다", url: "https://malachite-fontina-5e0.notion.site/2a3a56db406080c4993fc37c401887f4" },
];

// 이번 주 월~일 날짜를 yyyy-MM-dd 형식으로 구하는 헬퍼
function getWeekRange() {
  const today = new Date();
  const day = today.getDay(); // 0(일)~6(토)
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (d) => d.toISOString().split("T")[0];
  return { startDate: fmt(monday), endDate: fmt(sunday) };
}

export default function MainPage() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [tasks, setTasks] = useState([]);
  const [totalRate, setTotalRate] = useState(0);
  const [subjectStats, setSubjectStats] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showStudyTime, setShowStudyTime] = useState(false);
  const [plannerId, setPlannerId] = useState(null);
  const [timeRecords, setTimeRecords] = useState([]);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  // 오늘 할 일 데이터를 가져오는 공통 함수
  const fetchDailyTasks = async (date) => {
    const menteeId = user.userId;
    try {
      const json = await getStudyDaily(token, menteeId, date);
      const data = json.data ?? json;
      const responseMenteeId = data.menteeId ?? menteeId;
      const todos = data.todos ?? [];

      if (data.plannerId) setPlannerId(data.plannerId);
      if (data.timeRecords) setTimeRecords(data.timeRecords);

      const mapped = todos.map((t) => ({
        id: t.id,
        menteeId: responseMenteeId,
        tag: t.subject,
        tagColor: SUBJECT_COLORS[t.subject] || DEFAULT_TAG_COLOR,
        title: t.content,
        status: t.isCompleted ? "피드백 완료" : "피드백 대기",
        done: t.isCompleted,
        subject: t.subject,
        taskTitle: t.title,
        goal: t.goal,
        worksheets: (t.worksheets ?? []).map((w) => ({
          worksheetId: w.worksheetId,
          title: w.title,
          subject: w.subject,
          fileUrl: w.fileUrl,
        })),
      }));
      setTasks(mapped);
    } catch (err) {
      console.error("오늘 할 일 API 호출 실패, 더미 데이터 사용:", err);
      setTasks(fallbackTasks);
    }
  };

  // 선택된 날짜의 할 일 + 공부 시간 데이터 가져오기
  useEffect(() => {
    if (!user?.userId) return;
    fetchDailyTasks(selectedDate);
  }, [user, selectedDate]);

  // 학습 진척도 API
  useEffect(() => {
    if (!user?.userId) return;
    const { startDate, endDate } = getWeekRange();
    const menteeId = user.userId;

    fetch(`${API_BASE}/api/v1/study/progress?menteeId=${menteeId}&startDate=${startDate}&endDate=${endDate}`)
      .then((res) => res.json())
      .then((json) => {
        // API 응답: { status, message, data: { menteeId, period, summary, dailyStats } }
        const data = json.data;
        if (data?.summary) {
          setTotalRate(data.summary.totalProgressRate ?? 0);
          setSubjectStats(data.summary.subjectStats ?? []);
        }
        if (data?.dailyStats) {
          setDailyStats(data.dailyStats);
        }
      })
      .catch((err) => {
        console.error("진척도 API 호출 실패:", err);
      });
  }, [user]);
  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr]">
          {/* LEFT */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold !text-[#222222]">
                {selectedDate === todayStr ? "오늘 할 일" : `${selectedDate.slice(5).replace("-", "/")} 할 일`}
              </h2>

              <button
                onClick={() => setShowAddTask(true)}
                className="inline-flex items-center gap-2 rounded-full !bg-[#6D87ED] px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100 cursor-pointer"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 7V15M7 11H15M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span className="text-white font-bold">할일 추가</span>
              </button>
            </div>

            <div className="space-y-4">
              {tasks.map((t) => (
                <TaskCard key={t.id} task={t} />
              ))}
            </div>
          </section>

          {/* RIGHT */}
          <section className="space-y-6">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold !text-[#222222]">주간 캘린더</h2>
                <button
                  onClick={() => navigate("/mentee/calendar")}
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                >
                  <span className="text-xl leading-none">
                    <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.00012 1.00009L8.93924 6.51C9.47641 6.88281 9.51716 7.66236 9.02179 8.08914L1.00012 15.0001" stroke="#666666" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </span>
                </button>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <WeeklyCalendar
                  dailyStats={dailyStats}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <StudyTimeChart timeRecords={timeRecords} />
                </div>
                <button
                  onClick={() => setShowStudyTime(true)}
                  className="mt-4 w-full rounded-lg !bg-[#6D87ED] py-3 text-sm font-semibold text-white hover:!bg-[#5A74D6] transition-colors cursor-pointer"
                >
                  공부 시간 기록
                </button>
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold !text-[#222222]">서울대쌤 칼럼</h2>
              <ColumnCard items={COLUMNS} />
            </div>
          </section>
        </div>
      </main>

      <FloatingButton />

      {showStudyTime && (
        <StudyTimeModal
          plannerId={plannerId}
          onClose={() => setShowStudyTime(false)}
          onRecorded={() => {
            fetchDailyTasks(selectedDate);
          }}
        />
      )}

      {showAddTask && (
        <AddTaskModal
          onClose={() => setShowAddTask(false)}
          onTaskAdded={() => {
            fetchDailyTasks(selectedDate);
          }}
        />
      )}
    </div>
  );
}
