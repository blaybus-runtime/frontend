import { useState } from "react";
import Header from "../../components/common/Header";
import LearningContent from "../../components/mentee/LearningContent";
import MentorFeedback from "../../components/mentee/MentorFeedback";

// 더미 데이터
const dummyTask = {
  id: 1,
  subject: "국어",
  subjectColor: "bg-amber-100 text-amber-700",
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
};

export default function TaskDetailPage() {
  const [task] = useState(dummyTask);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName="설이" />

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

          <button className="flex items-center gap-2 rounded-full !bg-[#6D87ED] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#5a74d4]">
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

          {/* 오른쪽: 멘토 피드백 + 댓글 */}
          <MentorFeedback
            feedback={task.feedback}
            comments={task.comments}
          />
        </div>
      </main>
    </div>
  );
}
