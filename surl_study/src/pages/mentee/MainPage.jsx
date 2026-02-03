import { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import TaskCard from "../../components/mentee/TaskCard";
import WeeklyCalendar from "../../components/mentee/WeeklyCalendar";
import ProgressCard from "../../components/mentee/ProgressCard";
import ColumnCard from "../../components/mentee/ColumnCard";
import FloatingButton from "../../components/common/FloatingButton";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// 더미 데이터
const tasks = [
  { id: 1, tag: "국어", tagColor: "bg-amber-100 text-amber-700", title: "강지연 국어", status: "피드백 완료", done: true },
  { id: 2, tag: "국어", tagColor: "bg-amber-100 text-amber-700", title: "독서2 지문", status: "피드백 완료", done: true },
  { id: 3, tag: "기타", tagColor: "bg-gray-100 text-gray-700", title: "플래너 업로드", status: "피드백 완료", done: true },
  { id: 4, tag: "영어", tagColor: "bg-rose-100 text-rose-700", title: "단어 암기", status: "피드백 대기", done: true },
  { id: 5, tag: "영어", tagColor: "bg-rose-100 text-rose-700", title: "단어 시험", status: "피드백 대기", done: false },
  { id: 6, tag: "수학", tagColor: "bg-emerald-100 text-emerald-700", title: "수학 오답노트", status: "피드백 대기", done: false },
  { id: 7, tag: "수학", tagColor: "bg-emerald-100 text-emerald-700", title: "수학 오답노트", status: "피드백 대기", done: false },
  { id: 8, tag: "수학", tagColor: "bg-emerald-100 text-emerald-700", title: "수학 오답노트", status: "피드백 대기", done: false },
];

// 더미 데이터 (API 실패 시 폴백)
const fallbackColumns = [
  "짧은 시간이 힘, 자투리 10분이 성적을 바꾼다",
  "공부가 하기 싫은 날, 그래도 포기하지 않는 방법",
  "지금 당장 생산적인 공부를 하는 법(2)",
  "지금 당장 생산적인 공부를 하는 법(1)",
  "수능 국어 공부법: '읽어야할 것'은 진짜입니다",
];

export default function MainPage() {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/columns/recent?limit=5`)
      .then((res) => res.json())
      .then((json) => {
        // API 응답: { status: 200, message: "Success", data: [...] }
        const titles = json.data.map((col) => col.title);
        setColumns(titles);
      })
      .catch((err) => {
        console.error("칼럼 API 호출 실패, 더미 데이터 사용:", err);
        setColumns(fallbackColumns);
      });
  }, []);
  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr]">
          {/* LEFT */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold !text-[#222222]">오늘 할 일</h2>

              <button className="inline-flex items-center gap-2 rounded-full !bg-[#6D87ED] px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100">
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
                <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                  <span className="text-xl leading-none">
                    <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.00012 1.00009L8.93924 6.51C9.47641 6.88281 9.51716 7.66236 9.02179 8.08914L1.00012 15.0001" stroke="#666666" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </span>
                </button>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <WeeklyCalendar />
                <div className="mt-4">
                  <ProgressCard />
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold !text-[#222222]">서울대쌤 칼럼</h2>
              <ColumnCard items={columns} />
            </div>
          </section>
        </div>
      </main>

      <FloatingButton />
    </div>
  );
}
