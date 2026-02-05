import { useState } from "react";
import Header from "../../components/common/Header";
import MentorMenteeCard from "../../components/mentor/MenteeCard";
import IncompleteFeedbackCard from "../../components/mentor/IncompleteFeedbackCard";
import WeeklyCalendar from "../../components/mentor/WeeklyCalendar";
import AddMenteeModal from "../../components/mentor/AddMenteeModal";

const mentees = [
  { id: 1, name: "설이 멘티" },
  { id: 2, name: "채영 멘티" },
  { id: 3, name: "유나 멘티" },
  { id: 4, name: "동수 멘티" },
  { id: 5, name: "동하 멘티" },
  { id: 6, name: "지원 멘티" },
  { id: 7, name: "수빈 멘티" },
  { id: 8, name: "정은 멘티" },
  { id: 9, name: "재욱 멘티" },
  { id: 10, name: "상현 멘티" },
];

const incompleteFeedbacks = [
  { id: 1, mentee: "설이 멘티", subject: "영어", subjectColor: "rose", title: "단어암기", timeAgo: "12시간 전" },
  { id: 2, mentee: "채영 멘티", subject: "국어", subjectColor: "emerald", title: "강지연 국어5P 듣기", timeAgo: "12시간 전" },
  { id: 3, mentee: "채영 멘티", subject: "수학", subjectColor: "blue", title: "수학 오답노트", timeAgo: "11시간 전" },
  { id: 4, mentee: "유나 멘티", subject: "수학", subjectColor: "blue", title: "단어암기", timeAgo: "방금 전" },
  { id: 5, mentee: "유나 멘티", subject: "수학", subjectColor: "blue", title: "단어암기", timeAgo: "방금 전" },
  { id: 6, mentee: "유나 멘티", subject: "수학", subjectColor: "blue", title: "단어암기", timeAgo: "방금 전" },
  { id: 7, mentee: "유나 멘티", subject: "수학", subjectColor: "blue", title: "단어암기", timeAgo: "방금 전" },
];

// 멘티별 미완료 피드백 카운트 계산
function getMenteeFeedbackCount(menteeName) {
  return incompleteFeedbacks.filter((f) => f.mentee === menteeName).length;
}

export default function MentorMainPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveMentee = (formData) => {
    console.log("멘티 저장:", formData);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header userName="김자연" />

      <main className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-8">
        <div className="mx-auto max-w-6xl">
          {/* 본문 2열 레이아웃 */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
            {/* LEFT: 멘티 카드 그리드 */}
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">멘티 {mentees.length}명</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {mentees.map((m) => (
                  <MentorMenteeCard
                    key={m.id}
                    mentee={m}
                    feedbackCount={getMenteeFeedbackCount(m.name)}
                  />
                ))}

                {/* 멘티 추가 카드 */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ backgroundColor: "white" }}
                >
                  <div className="h-16 w-16 rounded-full bg-[#E8EAF0] flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="#8B92A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="mt-1 text-sm font-semibold text-[#8B92A0]">멘티 추가</span>
                </button>
              </div>
            </section>

            {/* RIGHT: 미완료 피드백 */}
            <section>
              <div className="mb-3">
                <h2 className="text-lg font-semibold">미완료 피드백</h2>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* 주간 캘린더 */}
                <WeeklyCalendar />

                {/* 피드백 리스트 */}
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {incompleteFeedbacks.map((f) => (
                    <IncompleteFeedbackCard key={f.id} item={f} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <AddMenteeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMentee}
      />
    </div>
  );
}
