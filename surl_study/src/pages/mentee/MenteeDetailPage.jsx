import { useEffect, useMemo, useState, useCallback, forwardRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { format, parseISO } from "date-fns";

import Header from "../../components/common/Header";
import WeekStrip from "../../components/mentor_detail/WeekStrip";
import TodoRow from "../../components/mentor_detail/TodoRow";
import MemoCard from "../../components/mentor_detail/MemoCard";
import FeedbackListCard from "../../components/mentor_detail/FeedbackListCard";
import CreateTodoModal from "../../components/mentor_detail/CreateTodoModal";
import { useAuth } from "../../context/AuthContext";
import { getMenteeDailyPlan } from "../../api/task";

const mockMenteeById = {
  1: { id: 1, name: "설이 멘티", school: "달천고등학교 3학년", track: "수시전형" },
  2: { id: 2, name: "채영 멘티", school: "OO고등학교 2학년", track: "정시전형" },
};

const initialMemos = ["후반 집중력 키우기", "중요단어 지문 반복 복습 우선", "오답은 개념 복습보다 지문 구조 파악 지점에서 주로 발생", "단기 목표 지문 처리 시간 단축"];

const subjectStyle = (subject) => {
  switch (subject) {
    case "영어":
      return { pill: "bg-rose-50 text-rose-700", dot: "bg-rose-500" };
    case "국어":
      return { pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" };
    case "수학":
      return { pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" };
    default:
      return { pill: "bg-indigo-50 text-indigo-700", dot: "bg-indigo-500" };
  }
};

const CustomDateInput = forwardRef(function CustomDateInput({ value, onClick }, ref) {
  return (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-lg font-bold text-gray-800 hover:bg-gray-100"
    >
      <span>{value}</span>
      <span className="flex h-5 w-5 items-center justify-center rounded border border-gray-200 bg-white">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-400"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </button>
  );
});



export default function MentorMenteeDetailPage() {
  const nav = useNavigate();
  const { menteeId } = useParams();
  const { token } = useAuth();

  const mentee = mockMenteeById[menteeId] ?? { id: menteeId, name: `멘티 ${menteeId}`, school: "학교 정보", track: "전형" };

  const today = format(new Date(), "yyyy-MM-dd");
  const [selectedDate, setSelectedDate] = useState(today);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [memos, setMemos] = useState(initialMemos);
  const [openCreate, setOpenCreate] = useState(false);

  // API에서 할 일 데이터 조회
  const fetchDailyTodos = useCallback(async (date) => {
    setLoading(true);
    try {
      const json = await getMenteeDailyPlan(token, menteeId, date);
      const data = json.data ?? json;
      const apiTodos = (data.todos ?? []).map((t) => ({
        id: t.id,
        subject: t.subject,
        type: t.taskType === "ASSIGNMENT" ? "PDF" : "자습",
        title: t.title || t.content,
        desc: t.goal || t.content,
        date: data.date || date,
        taskDone: t.isCompleted ?? false,
        feedbackDone: t.isFeedbackDone ?? false,
      }));
      setTodos(apiTodos);
    } catch (err) {
      console.error("멘티 일일 할 일 API 호출 실패:", err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }, [token, menteeId]);

  // selectedDate가 변경될 때마다 API 호출
  useEffect(() => {
    fetchDailyTodos(selectedDate);
  }, [selectedDate, fetchDailyTodos]);

  const todosOfDay = todos;

  const pendingFeedback = useMemo(
    () => todos.filter((t) => t.taskDone && !t.feedbackDone).sort((a, b) => (a.date < b.date ? 1 : -1)),
    [todos]
  );

  const toggleTaskDone = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, taskDone: !t.taskDone } : t)));
  };

  const toggleFeedbackDone = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, feedbackDone: !t.feedbackDone } : t)));
  };

  const addMemo = (text) => {
    const v = text.trim();
    if (!v) return;
    setMemos((prev) => [v, ...prev]);
  };

  const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <div 
      className="flex items-center gap-1 text-lg font-bold text-gray-800 cursor-pointer"
      onClick={onClick}
      ref={ref}
    >
      <span>
        {format(parseISO(selectedDate), "yy년 M월 d일")}
      </span>
      <div className="flex items-center justify-center w-5 h-5 rounded border border-gray-200 bg-white">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>
    </div>
  ));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

          {/* 상단 바 */}
      <div className="border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-gray-900">
                {mentee.name}
              </div>
            </div>
            <p className="mt-1.5 pl-1 text-sm text-gray-400">{mentee.school} | {mentee.track} </p>
          </div>
          <button
            onClick={() => setOpenCreate(true)}
            className="inline-flex items-center gap-2 rounded-full !bg-[#6D87ED] px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100 cursor-pointer"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 7V15M7 11H15M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span className="text-white font-bold">할일 추가</span>
          </button>
        </div>
      </div>

          {/* 본문 */}
          <main className="mx-auto max-w-6xl px-6">

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
            {/* LEFT */}
            <section>
              <div>
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                  <div className="text-xl font-semibold px-1.5">오늘 할일</div>

                  <div className="justify-self-center">
                    <DatePicker
                      selected={parseISO(selectedDate)}
                      onChange={(date) => setSelectedDate(format(date, "yyyy-MM-dd"))}
                      locale={ko}
                      dateFormat="yy년 M월 d일"
                      customInput={<CustomDateInput />}
                      popperPlacement="bottom"
                    />
                  </div>
                </div>

                <div className="py-4">
                  <WeekStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

                  <div className="rounded-lg !border !border-gray-200 border border-none bg-white px-4 mt-4">
                    <button className="w-full !bg-white py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100">
                      + 할일 추가하기
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {todosOfDay.map((t) => (
                      <TodoRow
                        key={t.id}
                        item={t}
                        subjectStyle={subjectStyle(t.subject)}
                        onToggleTask={() => toggleTaskDone(t.id)}
                      />
                    ))}

                    {loading && (
                      <div className="rounded-lg border border-dashed border-gray-200 p-6 text-sm text-gray-400 text-center">
                        불러오는 중...
                      </div>
                    )}

                    {!loading && todosOfDay.length === 0 && (
                      <div className="rounded-lg border border-dashed border-gray-200 p-6 text-sm text-gray-500">
                        선택한 날짜에 할 일이 없습니다.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT */}
            <section className="space-y-6">
              <MemoCard memos={memos} onAddMemo={addMemo} />

              <FeedbackListCard
                count={pendingFeedback.length}
                items={pendingFeedback}
                subjectStyle={subjectStyle}
                onToggleFeedback={toggleFeedbackDone}
              />
            </section>
          </div>
      </main>
      <CreateTodoModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={(payload) => {
          console.log("새 할일 payload:", payload);
          setOpenCreate(false);
          // 할일 생성 후 현재 날짜 데이터를 API에서 다시 불러오기
          fetchDailyTodos(selectedDate);
        }}
      />

    </div>
  );
}
