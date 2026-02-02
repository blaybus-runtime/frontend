import Header from "../../components/common/Header";
import MentorMenteeCard from "../../components/mentor/MentorMenteeCard";
import SubmittedTaskCard from "../../components/mentor/SubmittedTaskCard";
import FeedbackCard from "../../components/mentor/FeedbackCard";

const mentees = [
  { id: 1, name: "설이 멘티", status: "과제 완료", done: true },
  { id: 2, name: "채영 멘티", status: "과제 완료", done: true },
  { id: 3, name: "유나 멘티", status: "과제 미제출", done: false },
  { id: 4, name: "동수 멘티", status: "과제 미제출", done: false },
  { id: 5, name: "동하 멘티", status: "과제 미제출", done: false },
  { id: 6, name: "지원 멘티", status: "과제 미제출", done: false },
  { id: 7, name: "수빈 멘티", status: "과제 미제출", done: false },
  { id: 8, name: "정은 멘티", status: "과제 미제출", done: false },
  { id: 9, name: "재욱 멘티", status: "과제 미제출", done: false },
  { id: 10, name: "상현 멘티", status: "과제 미제출", done: false },
];

const submittedTasks = [
  { id: 1, mentee: "설이 멘티", title: "단어암기", status: "과제 완료", done: true },
  { id: 2, mentee: "채영 멘티", title: "단어암기", status: "과제 완료", done: true },
  { id: 3, mentee: "유나 멘티", title: "영어 강의", status: "과제 미제출", done: false },
];

const feedbacks = [
  { id: 1, mentee: "설이 멘티", title: "영어 강의", status: "피드백 쓰기", done: false },
  { id: 2, mentee: "채영 멘티", title: "영어 강의", status: "피드백 완료", done: true },
];

export default function MentorMainPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header userName="민석" />

      <main className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-8">
        {/* 상단 타이틀 영역 */}
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-md bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700">
                영어
              </span>
              <h1 className="text-xl font-bold">강민석 영어 멘토</h1>
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                +
              </span>
              일정 추가
            </button>
          </div>

          {/* 본문 2열 레이아웃 */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
            {/* LEFT: 멘티 카드 그리드 */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">멘티 10명</h2>

                <button className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                    +
                  </span>
                  멘티 추가
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {mentees.map((m) => (
                  <MentorMenteeCard key={m.id} mentee={m} />
                ))}
              </div>
            </section>

            {/* RIGHT: 제출 과제 / 피드백 */}
            <section className="space-y-6">
              {/* 제출 과제 */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">제출 과제</h2>
                  <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                    <span className="text-xl leading-none">›</span>
                  </button>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="space-y-3">
                    {submittedTasks.map((t) => (
                      <SubmittedTaskCard key={t.id} item={t} />
                    ))}
                  </div>
                </div>
              </div>

              {/* 피드백 */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">피드백</h2>
                  <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                    <span className="text-xl leading-none">›</span>
                  </button>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="space-y-3">
                    {feedbacks.map((f) => (
                      <FeedbackCard key={f.id} item={f} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
