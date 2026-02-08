import { useState, useEffect, useCallback } from "react";
import Header from "../../components/common/Header";
import MentorMenteeCard from "../../components/mentor/MenteeCard";
import IncompleteFeedbackCard from "../../components/mentor/IncompleteFeedbackCard";
import WeeklyCalendar from "../../components/mentor/WeeklyCalendar";
import AddMenteeModal from "../../components/mentor/AddMenteeModal";
import { useAuth } from "../../context/AuthContext";
import {
  getMyMentees,
  createMentee,
  getPendingFeedbacksByDate,
} from "../../api/matching";

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

function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// 이번 주 월~일 범위 계산
function getWeekRange() {
  const today = new Date();
  const day = today.getDay(); // 0(일)~6(토)
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { startDate: formatDate(monday), endDate: formatDate(sunday) };
}

export default function MentorMainPage() {
  const todayStr = formatDate(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allFeedbacks, setAllFeedbacks] = useState([]); // 전체 피드백 원본
  const [weekFeedbacks, setWeekFeedbacks] = useState([]); // 이번 주 필터링된 피드백
  const [selectedDate, setSelectedDate] = useState(todayStr); // 캘린더 선택 날짜
  const [displayFeedbacks, setDisplayFeedbacks] = useState([]); // 선택 날짜 or 전체

  const { token, user } = useAuth();

  // 피드백 응답 → UI 아이템 변환 헬퍼 (completedAt 원본도 보존, date로 날짜 태깅)
  const mapFeedbacks = (list, date) =>
    (Array.isArray(list) ? list : []).map((f) => ({
      id: f.taskId,
      mentee: f.menteeName,
      subject: f.subject,
      subjectColor: subjectColorMap[f.subject] || "blue",
      title: f.taskContent,
      completedAt: f.completedAt,
      timeAgo: timeAgo(f.completedAt),
      date, // 어느 날짜에 속하는 피드백인지
    }));

  // 멘티 카드 목록 조회
  const fetchMentees = useCallback(
    (date) => {
      if (!token) return;
      getMyMentees(token, date)
        .then((res) => {
          console.log("getMyMentees 응답:", JSON.stringify(res, null, 2));
          const data = res.data ?? res;
          const arr = Array.isArray(data) ? data : [];
          const list = arr.map((m) => ({
            id: m.menteeId,
            name: m.name,
            avatar: m.profileImageUrl,
            feedbackCount: m.unwrittenFeedbackCount ?? 0,
            highSchool: m.highSchool || "",
            grade: m.grade || 0,
            subjects: m.subjects || [],
          }));
          setMentees(list);
        })
        .catch((err) => {
          console.error("멘티 목록 조회 실패:", err);
          console.error("에러 상세:", err.data || err.message);
          setMentees([]);
        })
        .finally(() => setLoading(false));
    },
    [token]
  );

  // 이번 주 월~일 7일 각각 조회 → 합치기
  const fetchWeekFeedbacks = useCallback(() => {
    if (!token) return;

    const { startDate } = getWeekRange();
    const monday = new Date(startDate + "T00:00:00");

    // 월~일 7일 날짜 배열 생성
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return formatDate(d);
    });

    // 7일 동시 조회
    const requests = weekDates.map((date) =>
      getPendingFeedbacksByDate(token, date)
        .then((res) => {
          const list = res.data ?? res;
          return mapFeedbacks(list, date);
        })
        .catch(() => []) // 개별 날짜 실패 시 빈 배열
    );

    Promise.all(requests)
      .then((results) => {
        // 7일 결과 합치고 중복 제거 (taskId 기준)
        const merged = results.flat();
        const unique = [];
        const seen = new Set();
        for (const f of merged) {
          if (!seen.has(f.id)) {
            seen.add(f.id);
            unique.push(f);
          }
        }
        setAllFeedbacks(unique);
        setWeekFeedbacks(unique);
      })
      .catch((err) => {
        console.error("주간 미완료 피드백 조회 실패:", err);
        setAllFeedbacks([]);
        setWeekFeedbacks([]);
      });
  }, [token]);

  // 선택된 날짜에 따라 표시할 피드백 필터링
  useEffect(() => {
    if (!selectedDate) {
      setDisplayFeedbacks(weekFeedbacks);
    } else {
      const filtered = allFeedbacks.filter((f) => f.date === selectedDate);
      setDisplayFeedbacks(filtered);
    }
  }, [selectedDate, allFeedbacks, weekFeedbacks]);

  // 표시 중인 피드백(선택 날짜 기준)이 변경되면 멘티별 미완료 피드백 수 계산
  useEffect(() => {
    if (displayFeedbacks.length === 0 && mentees.length === 0) return;

    // 멘티 이름별 미완료 피드백 수 계산 (선택된 날짜 기준)
    const countMap = {};
    for (const f of displayFeedbacks) {
      if (f.mentee) {
        countMap[f.mentee] = (countMap[f.mentee] || 0) + 1;
      }
    }

    // mentees에 feedbackCount 반영 (이름 기준 매칭)
    setMentees((prev) => {
      const updated = prev.map((m) => ({
        ...m,
        feedbackCount: countMap[m.name] ?? 0,
      }));
      // 실제로 변경이 있을 때만 업데이트 (무한루프 방지)
      const changed = updated.some((u, i) => u.feedbackCount !== prev[i].feedbackCount);
      return changed ? updated : prev;
    });
  }, [displayFeedbacks]);

  // 초기 로드
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMentees(formatDate(new Date()));
    fetchWeekFeedbacks();
  }, [token, fetchMentees, fetchWeekFeedbacks]);

  const handleSaveMentee = async (formData) => {
    // 필수 필드 검증 (DB에서 nullable = false)
    if (!formData.name?.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    try {
      const body = {
        name: formData.name.trim(),
        menteeProfile: {
          phoneNumber: formData.phone?.trim() || "미입력",
          email: formData.email?.trim() || "미입력",
          highSchool: formData.school?.trim() || "미입력",
          grade: Number(formData.grade) || 1,
          targetUniv: "",
          subjects: formData.examTypes?.length > 0 ? formData.examTypes : ["미정"],
          messageToMentor: "",
        },
      };

      console.log("멘티 생성 요청 body:", JSON.stringify(body, null, 2));
      const res = await createMentee(token, body);
      const payload = res.data ?? res;

      setMentees((prev) => [
        ...prev,
        {
          id: payload.user.userId,
          name: payload.user.name,
          avatar: payload.user.profileImage,
          feedbackCount: 0,
        },
      ]);

      alert(`멘티 계정이 생성되었습니다.\n아이디: ${payload.user.username}\n임시 비밀번호: ${payload.tempPassword}`);
    } catch (err) {
      console.error("멘티 생성 실패:", err);
      console.error("서버 응답:", err.data);
      const serverMsg = err.data?.message || err.message || "알 수 없는 오류";
      alert(`멘티 생성에 실패했습니다.\n원인: ${serverMsg}`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header userName={user?.name || "멘토"} />

      <main className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-8">
        <div className="mx-auto max-w-6xl">
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
                {/* 주간 캘린더 (날짜 선택 가능) */}
                <WeeklyCalendar
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />

                {/* 선택 날짜 피드백 리스트 */}
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {displayFeedbacks.map((f) => (
                    <IncompleteFeedbackCard key={f.id} item={f} />
                  ))}
                  {displayFeedbacks.length === 0 && (
                    <div className="text-sm text-gray-400 text-center py-4">
                      {selectedDate
                        ? `${selectedDate.slice(5).replace("-", "/")} 미완료 피드백이 없습니다.`
                        : "이번 주 미완료 피드백이 없습니다."}
                    </div>
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
