import { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import MentorMenteeCard from "../../components/mentor/MenteeCard";
import IncompleteFeedbackCard from "../../components/mentor/IncompleteFeedbackCard";
import WeeklyCalendar from "../../components/mentor/WeeklyCalendar";
import AddMenteeModal from "../../components/mentor/AddMenteeModal";
import { useAuth } from "../../context/AuthContext";
import { getMyMentees, createMentee, getAllPendingFeedbacks } from "../../api/matching";

const subjectColorMap = {
  "영어": "rose",
  "국어": "emerald",
  "수학": "blue",
  "과학": "purple",
};

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now - past;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}시간 전`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}일 전`;
}

function getToday() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function MentorMainPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);

  const { token, user } = useAuth();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    getMyMentees(token, getToday())
      .then((res) => {
        const list = res.data.map((m) => ({
          id: m.menteeId,
          name: m.name,
          avatar: m.profileImageUrl,
          feedbackCount: m.unwrittenFeedbackCount ?? 0,
        }));
        setMentees(list);
      })
      .catch((err) => {
        console.error("멘티 목록 조회 실패:", err);
        setMentees([]);
      })
      .finally(() => setLoading(false));

    getAllPendingFeedbacks(token)
      .then((res) => {
        const list = res.data ?? res;
        const items = (Array.isArray(list) ? list : []).map((f) => ({
          id: f.taskId,
          mentee: f.menteeName,
          subject: f.subject,
          subjectColor: subjectColorMap[f.subject] || "blue",
          title: f.taskContent,
          timeAgo: timeAgo(f.completedAt),
        }));
        setFeedbacks(items);
      })
      .catch((err) => {
        console.error("미완료 피드백 조회 실패:", err);
        setFeedbacks([]);
      });
  }, [token]);

  const handleSaveMentee = async (formData) => {
    try {
      const body = {
        name: formData.name,
        menteeProfile: {
          phoneNumber: formData.phone,
          email: formData.email,
          highSchool: formData.school,
          grade: Number(formData.grade) || 1,
          subjects: [],
          messageToMentor: "",
        },
      };

      const res = await createMentee(token, body);
      const payload = res.data ?? res;

      // 새 멘티를 목록에 추가
      setMentees((prev) => [
        ...prev,
        {
          id: payload.user.userId,
          name: payload.user.name,
          avatar: payload.user.profileImage,
          feedbackCount: 0,
        },
      ]);

      // 생성된 계정 정보 알림
      alert(`멘티 계정이 생성되었습니다.\n아이디: ${payload.user.username}\n임시 비밀번호: ${payload.tempPassword}`);
    } catch (err) {
      console.error("멘티 생성 실패:", err);
      alert("멘티 생성에 실패했습니다. 다시 시도해주세요.");
    }

    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header userName={user?.name || "멘토"} />

      <main className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-8">
        <div className="mx-auto max-w-6xl">
          {/* 본문 2열 레이아웃 */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
            {/* LEFT: 멘티 카드 그리드 */}
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">멘티 {mentees.length}명</h2>
              </div>

              {loading ? (
                <p className="text-sm text-gray-400">불러오는 중...</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {mentees.map((m) => (
                    <MentorMenteeCard
                      key={m.id}
                      mentee={m}
                      feedbackCount={m.feedbackCount}
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
              )}
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
                  {feedbacks.map((f) => (
                    <IncompleteFeedbackCard key={f.id} item={f} />
                  ))}
                  {feedbacks.length === 0 && (
                    <div className="text-sm text-gray-400 text-center py-4">미완료 피드백이 없습니다.</div>
                  )}
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
