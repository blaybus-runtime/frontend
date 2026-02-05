import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import LearningContent from "../../components/mentee/LearningContent";
import MentorFeedback from "../../components/mentee/MentorFeedback";

// 더미 데이터 (실제로는 feedbackId로 API 조회)
const dummyFeedbackData = {
  1: {
    id: 1,
    menteeName: "설이 멘티",
    subject: "영어",
    subjectColor: "bg-rose-100 text-rose-700",
    teacherName: "강지연 국어",
    taskTitle: "강지연 국어 5P 풀기",
    learningContent: {
      activeTab: "학습 내용 공유",
      attachments: [
        { id: 1, type: "image", url: "/placeholder1.jpg" },
        { id: 2, type: "image", url: "/placeholder2.jpg" },
        { id: 3, type: "image", url: "/placeholder3.jpg" },
        { id: 4, type: "image", url: "/placeholder4.jpg" },
        { id: 5, type: "image", url: "/placeholder5.jpg" },
      ],
    },
    feedback: {
      mentorName: "설이쌤",
      mentorAvatar: null,
      timeAgo: "1시간 전",
      content:
        "수고했습니다! 벌써 단어의 형성 단원까지 나아갔군요! 아마 방학 기간 동안 독서, 문학, 문법을 이렇게까지 체계적으로 공부해 온 학생은 굉장히 소수일 것이라 생각합니다!\n혹시 '오답노트'를 쓰면서 확실히 이 문항을 틀렸던 근본적인 원인에 다가간다는 느낌을 받으시나요? 문법은 개념을 암기하는 것을 넘어 문항 풀이 자체로도 따로 대비해야 한다는 것을 체감할 수 있으면 합니다 ☺️ 이쪽 되어서 알선 개념을 복습하고 넘어가는 것이 좋겠습니다! 다음 문법 강의 수강일인 22일에는 새로운 강의를 듣지 말고 '용언', '수식언', '관계언', '체언' 단원의 개념을 백지복습할 수 있는 수준까지 암기해오세요! 단순 이해가 아니라 암기가 되어야 합니다 😊",
    },
    comments: [
      {
        id: 1,
        author: "설이",
        authorAvatar: null,
        timeAgo: "10분 전",
        content:
          "네 확실히 오답노트 쓰니까 이해가 되는 것 같아요!\n다음 시간까지 암기해오겠습니다.",
        isReply: true,
      },
      {
        id: 2,
        author: "설이쌤",
        authorAvatar: null,
        timeAgo: "1분 전",
        content: "화이팅~!!",
        isReply: true,
      },
    ],
  },
  2: {
    id: 2,
    menteeName: "채영 멘티",
    subject: "국어",
    subjectColor: "bg-emerald-100 text-emerald-700",
    teacherName: "강지연 국어",
    taskTitle: "강지연 국어 5P 풀기",
    learningContent: {
      activeTab: "학습 내용 공유",
      attachments: [
        { id: 1, type: "image", url: "/placeholder1.jpg" },
        { id: 2, type: "image", url: "/placeholder2.jpg" },
        { id: 3, type: "image", url: "/placeholder3.jpg" },
      ],
    },
    feedback: {
      mentorName: "설이쌤",
      mentorAvatar: null,
      timeAgo: "1시간 전",
      content:
        "수고했습니다! 벌써 단어의 형성 단원까지 나아갔군요! 아마 방학 기간 동안 독서, 문학, 문법을 이렇게까지 체계적으로 공부해 온 학생은 굉장히 소수일 것이라 생각합니다!\n혹시 '오답노트'를 쓰면서 확실히 이 문항을 틀렸던 근본적인 원인에 다가간다는 느낌을 받으시나요? 문법은 개념을 암기하는 것을 넘어 문항 풀이 자체로도 따로 대비해야 한다는 것을 체감할 수 있으면 합니다 ☺️ 이쪽 되어서 알선 개념을 복습하고 넘어가는 것이 좋겠습니다! 다음 문법 강의 수강일인 22일에는 새로운 강의를 듣지 말고 '용언', '수식언', '관계언', '체언' 단원의 개념을 백지복습할 수 있는 수준까지 암기해오세요! 단순 이해가 아니라 암기가 되어야 합니다 😊",
    },
    comments: [],
  },
};

export default function FeedbackDetailPage() {
  const { feedbackId } = useParams();
  const navigate = useNavigate();
  const data = dummyFeedbackData[feedbackId] || dummyFeedbackData[2];
  const [task] = useState(data);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName="김자연" />

      {/* 상단 흰색 영역: 과목 & 제목 */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${task.subjectColor}`}
              >
                {task.subject}
              </span>
              <h1 className="text-2xl font-bold text-gray-900">
                {task.teacherName}
              </h1>
            </div>
            <p className="mt-1.5 pl-1 text-sm text-gray-400">{task.taskTitle}</p>
          </div>

          <button className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90" style={{ backgroundColor: "#6D87ED" }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.66699 6.66699L8.00033 10.0003L11.3337 6.66699"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 10V2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            학습 자료
          </button>
        </div>
      </div>

      {/* 하단 회색 영역: 학습 내용 + 멘토 피드백 */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_3fr]">
          {/* 왼쪽: 학습 내용 */}
          <LearningContent data={task.learningContent} />

          {/* 오른쪽: 멘토 피드백 + 댓글 (수정/삭제 메뉴 포함) */}
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">멘토 피드백</h2>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="2.5" r="1.5" />
                    <circle cx="8" cy="8" r="1.5" />
                    <circle cx="8" cy="13.5" r="1.5" />
                  </svg>
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 w-28 rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-10">
                    <button
                      onClick={() => setShowMenu(false)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 1.75L12.25 3.5M1.75 12.25L2.3125 9.8125L10.0625 2.0625C10.2944 1.8306 10.6101 1.7002 10.9375 1.7002C11.2649 1.7002 11.5806 1.8306 11.8125 2.0625C12.0444 2.2944 12.1748 2.6101 12.1748 2.9375C12.1748 3.2649 12.0444 3.5806 11.8125 3.8125L4.0625 11.5625L1.75 12.25Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      수정
                    </button>
                    <button
                      onClick={() => setShowMenu(false)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.75 3.5H12.25M5.25 6.125V9.625M8.75 6.125V9.625M2.625 3.5L3.5 11.375C3.5 11.6071 3.59219 11.8296 3.75628 11.9937C3.92038 12.1578 4.14294 12.25 4.375 12.25H9.625C9.85706 12.25 10.0796 12.1578 10.2437 11.9937C10.4078 11.8296 10.5 11.6071 10.5 11.375L11.375 3.5M5.25 3.5V2.1875C5.25 2.07147 5.29609 1.96019 5.37814 1.87814C5.46019 1.79609 5.57147 1.75 5.6875 1.75H8.3125C8.42853 1.75 8.53981 1.79609 8.62186 1.87814C8.70391 1.96019 8.75 2.07147 8.75 2.1875V3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 피드백 글 카드 */}
            <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-full bg-gray-200" />
                  <span className="text-sm font-semibold text-gray-900">
                    {task.feedback.mentorName}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{task.feedback.timeAgo}</span>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                {task.feedback.content}
              </p>
            </div>

            {/* 댓글 헤더 */}
            <div className="mt-6 flex items-center gap-2 px-1">
              <span className="text-base">💬</span>
              <span className="text-sm font-bold text-gray-900">
                댓글
              </span>
            </div>

            {/* 댓글 입력 */}
            <CommentSection comments={task.comments} />
          </section>
        </div>
      </main>
    </div>
  );
}

function CommentSection({ comments }) {
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState(comments);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      author: "김자연",
      authorAvatar: null,
      timeAgo: "방금 전",
      content: newComment.trim(),
      isReply: true,
    };
    setCommentList([...commentList, comment]);
    setNewComment("");
  };

  return (
    <>
      {/* 댓글 입력 카드 */}
      <div className="mt-3 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="댓글을 남겨보세요."
            className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#6D87ED]"
          />
          <button
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            className="shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition"
            style={{
              backgroundColor: newComment.trim() ? "#6D87ED" : "#D1D5DB",
              cursor: newComment.trim() ? "pointer" : "not-allowed",
            }}
          >
            등록
          </button>
        </div>
      </div>

      {/* 댓글 목록 카드 */}
      {commentList.length > 0 && (
        <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="divide-y divide-gray-100">
            {commentList.map((comment, idx) => (
              <div
                key={comment.id}
                className={`flex gap-3 ${idx > 0 ? "pt-4" : ""} ${idx < commentList.length - 1 ? "pb-4" : ""}`}
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-gray-400">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 1V8H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-400">
                      {comment.timeAgo}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm text-gray-700">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
