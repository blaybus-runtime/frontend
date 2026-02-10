import { useEffect, useState, useCallback, forwardRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { format, parseISO } from "date-fns";

import Header from "../../components/common/Header";
import WeekStrip from "../../components/mentor_detail/WeekStrip";
import TodoRow from "../../components/mentor_detail/TodoRow";
import MemoCard from "../../components/mentor_detail/MemoCard";
import FeedbackListCard from "../../components/mentor_detail/FeedbackListCard";
import AddTaskModal from "../../components/mentee/AddTaskModal";
import { useAuth } from "../../context/AuthContext";
import { getMenteeDailyPlan, getStudyDaily, getMentorMemos } from "../../api/task";
import { getMyMentees, getPendingFeedbacksByDate } from "../../api/matching";

// 과목 목록 → 전형 표시 텍스트 변환
function formatSubjects(subjects) {
  if (!subjects || subjects.length === 0) return "";
  return subjects.join(", ");
}


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
  const location = useLocation();

  const today = format(new Date(), "yyyy-MM-dd");
  const [selectedDate, setSelectedDate] = useState(today);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingFeedback, setPendingFeedback] = useState([]);
  const [memos, setMemos] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [mentee, setMentee] = useState({
    id: menteeId,
    name: `멘티 ${menteeId}`,
    school: "",
    track: "",
    targetUniv: "",
  });

  // 멘티 프로필 정보 로드 — 항상 API 호출하여 최신 정보 반영
  useEffect(() => {
    if (!token) return;

    // navigate state가 있으면 우선 이름만 표시 (로딩 중)
    const info = location.state?.menteeInfo;
    if (info?.name) {
      setMentee((prev) => ({ ...prev, name: info.name }));
    }

    // API에서 학교/과목 등 상세 정보 가져오기
    getMyMentees(token, today)
      .then((res) => {
        const list = res.data ?? [];
        const found = list.find((m) => String(m.menteeId) === String(menteeId));
        if (found) {
          setMentee({
            id: menteeId,
            name: found.name,
            school: found.highSchool
              ? `${found.highSchool}${found.grade ? ` ${found.grade}학년` : ""}`
              : "",
            track: formatSubjects(found.subjects),
            targetUniv: found.targetUniv || "",
          });
        }
      })
      .catch((err) => console.error("멘티 정보 조회 실패:", err));
  }, [menteeId, token]);

  // 메모 조회 (최대 5개)
  useEffect(() => {
    if (!token) return;
    getMentorMemos(token, menteeId)
      .then((res) => {
        const items = res.data?.items ?? [];
        setMemos(items);
      })
      .catch((err) => console.error("메모 조회 실패:", err));
  }, [token, menteeId]);

  // API에서 할 일 데이터 조회 (멘토 API + study/daily API로 worksheet 병합)
  const fetchDailyTodos = useCallback(async (date) => {
    setLoading(true);
    try {
      // 멘토 API와 study/daily API를 병렬 호출
      const [json, studyJson] = await Promise.all([
        getMenteeDailyPlan(token, menteeId, date),
        getStudyDaily(token, menteeId, date).catch(() => null),
      ]);

      // study/daily에서 worksheet 맵 + submission 맵 구성
      const worksheetMap = {};
      const submittedMap = {};
      if (studyJson) {
        const studyData = studyJson.data ?? studyJson;
        const studyTodos = studyData.todos ?? (Array.isArray(studyData) ? studyData : []);
        for (const t of studyTodos) {
          const tid = t.id ?? t.taskId;
          if (tid) {
            submittedMap[tid] = t.isSubmitted ?? false;
            if (t.worksheets?.length > 0) {
              worksheetMap[tid] = t.worksheets.map((w) => ({
                worksheetId: w.worksheetId,
                title: w.title,
                subject: w.subject,
                fileUrl: w.fileUrl,
              }));
            }
          }
        }
      }

      const list = json.data ?? json;
      const tasks = Array.isArray(list) ? list : (list.todos ?? []);
      const apiTodos = tasks.map((t) => {
      const tid = t.taskId ?? t.id;

      const rawTitle = t.title || t.content || "";
      const finalTitle = rawTitle.split("|").pop().trim();

      const rawGoal = t.goal || "목표 없음";

      console.log(`ID: ${tid}, Title: ${finalTitle}, Goal: ${rawGoal}`); // 디버깅용 로그

      return {
        id: tid,
        subject: t.subject,
        type: t.taskType === "ASSIGNMENT" ? "PDF" : "자습",
        title: finalTitle,   // ✅ "멘티 첨부파일 테스트"만 남음
        desc: "",
        goal: rawGoal,
        date: date,
        taskDone: t.isTaskCompleted ?? t.isCompleted ?? false,
        feedbackDone: t.isFeedbackCompleted ?? t.isFeedbackDone ?? false,
        isSubmitted: t.isSubmitted ?? submittedMap[tid] ?? false,
        worksheets: worksheetMap[tid] || [],
      };
    });

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

  // 미완료 피드백 조회 (이번 주 7일 각각 조회 → menteeId로 필터)
  useEffect(() => {
    if (!token) return;

    // 이번 주 월~일 날짜 배열 생성
    const now = new Date();
    const day = now.getDay(); // 0(일)~6(토)
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return format(d, "yyyy-MM-dd");
    });

    // 7일 동시 조회
    Promise.all(
      weekDates.map((date) =>
        getPendingFeedbacksByDate(token, date)
          .then((res) => {
            const list = res.data ?? [];
            return list
              .filter((f) => String(f.menteeId) === String(menteeId))
              .map((f) => ({
                id: f.taskId,
                subject: f.subject,
                type: "PDF",
                title: (f.taskContent || "").split("|").pop().trim(),
                goal: "",
                date,
                taskDone: true,
                feedbackDone: false,
              }));
          })
          .catch(() => [])
      )
    )
      .then((results) => {
        const merged = results.flat();
        // taskId 기준 중복 제거
        const seen = new Set();
        const unique = merged.filter((f) => {
          if (seen.has(f.id)) return false;
          seen.add(f.id);
          return true;
        });
        setPendingFeedback(unique);
      })
      .catch(() => setPendingFeedback([]));
  }, [token, menteeId]);

  const todosOfDay = todos;

  const toggleTaskDone = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, taskDone: !t.taskDone } : t)));
  };

  const toggleFeedbackDone = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, feedbackDone: !t.feedbackDone } : t)));
  };

  const addMemo = (text) => {
    const v = text.trim();
    if (!v) return;
    setMemos((prev) => [{ content: v, createdAt: new Date().toISOString() }, ...prev]);
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
              <div className="text-lg font-bold text-gray-900">
                {mentee.name}
              </div>
            </div>
            <p className="mt-2 pl-1 text-sm text-gray-400">
              {[mentee.school, mentee.track, mentee.targetUniv].filter(Boolean).join(" | ") || "정보 없음"}
            </p>
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
                  <div className="text-xl font-semibold px-1.5">오늘 할 일</div>

                  <div className="justify-self-center">
                    <DatePicker
                        selected={parseISO(selectedDate)}
                        onChange={(date) => setSelectedDate(format(date, "yyyy-MM-dd"))}
                        locale={ko}
                        dateFormat="yy년 M월 d일"
                        customInput={<CustomDateInput />}
                        popperPlacement="bottom"
                        /* 🔴 시안과 동일한 배치를 위한 옵션 순서 */
                        showYearDropdown    // 년도를 먼저 표시하도록 유도
                        showMonthDropdown   // 그 다음에 월 표시
                        dropdownMode="select"
                        yearDropdownItemNumber={10}
                    />
                  </div>
                </div>

                <div className="py-4">
                  <WeekStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

                  <div className="rounded-lg !border !border-gray-200 border border-none bg-white px-4 mt-4">
                    <button
                      onClick={() => setOpenCreate(true)}
                      className="w-full !bg-white py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      + 할일 추가하기
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {todosOfDay.map((t) => (
                      <TodoRow
                        key={t.id}
                        item={t}
                        goal={t.goal}
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
              <FeedbackListCard
                count={pendingFeedback.length}
                items={pendingFeedback}
                subjectStyle={subjectStyle}
                onToggleFeedback={toggleFeedbackDone}
              />
            </section>
          </div>
      </main>
      {openCreate && (
        <AddTaskModal
          fixedMenteeId={Number(menteeId)}
          onClose={() => setOpenCreate(false)}
          onTaskAdded={() => {
            fetchDailyTodos(selectedDate);
          }}
        />
      )}

    </div>
  );
}
