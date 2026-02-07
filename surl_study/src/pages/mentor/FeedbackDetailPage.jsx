import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/common/Header";
import LearningContent from "../../components/mentee/LearningContent";
import { useAuth } from "../../context/AuthContext";
import { getFeedback, createFeedback, updateFeedback, deleteFeedback, getComments, createComment } from "../../api/task";

// 과목별 태그 색상 매핑
const SUBJECT_COLORS = {
  국어: "bg-amber-100 text-amber-700",
  영어: "bg-rose-100 text-rose-700",
  수학: "bg-emerald-100 text-emerald-700",
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// 시간 포맷 헬퍼
function formatTimeAgo(createdAt) {
  if (!createdAt) return "";
  const now = new Date();
  const date = new Date(createdAt);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}일 전`;
}

export default function FeedbackDetailPage() {
  const { feedbackId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAuth();
  const taskFromState = location.state?.task;

  // navigate state에서 task 정보 구성
  const subject = taskFromState?.subject || "";
  const subjectColor = SUBJECT_COLORS[subject] || "bg-gray-100 text-gray-700";

  const [task] = useState({
    id: feedbackId,
    subject,
    subjectColor,
    teacherName: taskFromState?.title || "",
    taskTitle: taskFromState?.goal ? `${taskFromState.desc || taskFromState.title} | ${taskFromState.goal}` : (taskFromState?.desc || ""),
    learningContent: {
      activeTab: "학습 내용 공유",
      attachments: [],
    },
  });

  const [showMenu, setShowMenu] = useState(false);

  // 피드백 상태: API에서 조회
  const [feedback, setFeedback] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // 피드백 API 조회
  useEffect(() => {
    if (!feedbackId || !token) return;

    getFeedback(token, feedbackId)
      .then((json) => {
        const data = json.data ?? json;
        if (data && data.content) {
          setFeedback({
            mentorName: data.mentorName ?? data.writerName ?? user?.name ?? "멘토",
            mentorAvatar: data.mentorProfileUrl ?? data.writerProfileUrl ?? null,
            timeAgo: formatTimeAgo(data.createdAt),
            content: data.content,
            files: data.files ?? [],
          });
        }
      })
      .catch((err) => {
        console.error("피드백 조회 실패:", err);
        // 피드백이 없으면 null 유지 → 작성 폼 표시
      });
  }, [feedbackId, token]);

  // 수정 모드
  const [isEditing, setIsEditing] = useState(false);

  // 피드백 작성 핸들러 (POST)
  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim() || feedbackLoading) return;
    setFeedbackLoading(true);

    try {
      const rawFiles = uploadedFiles.map((f) => f.file).filter(Boolean);
      const json = await createFeedback(token, feedbackId, { content: feedbackText.trim(), files: rawFiles });
      const data = json.data ?? json;
      setFeedback({
        mentorName: data.mentorName ?? data.writerName ?? user?.name ?? "멘토",
        mentorAvatar: data.mentorProfileUrl ?? data.writerProfileUrl ?? null,
        timeAgo: formatTimeAgo(data.createdAt) || "방금 전",
        content: data.content ?? feedbackText.trim(),
        files: data.files ?? [],
      });
      setFeedbackText("");
      setUploadedFiles([]);
    } catch (err) {
      console.error("피드백 작성 실패:", err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  // 피드백 수정 핸들러 (PUT)
  const handleFeedbackUpdate = async () => {
    if (!feedbackText.trim() || feedbackLoading) return;
    setFeedbackLoading(true);

    try {
      const json = await updateFeedback(token, feedbackId, { content: feedbackText.trim() });
      const data = json.data ?? json;
      setFeedback({
        ...feedback,
        content: data.content ?? feedbackText.trim(),
        timeAgo: formatTimeAgo(data.createdAt) || feedback.timeAgo,
      });
      setFeedbackText("");
      setIsEditing(false);
    } catch (err) {
      console.error("피드백 수정 실패:", err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  // 피드백 삭제 핸들러 (DELETE)
  const handleFeedbackDelete = async () => {
    try {
      await deleteFeedback(token, feedbackId);
      setFeedback(null);
      setFeedbackText("");
    } catch (err) {
      console.error("피드백 삭제 실패:", err);
    }
  };

  // 파일 업로드 핸들러
  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((f) => ({
      id: Date.now() + Math.random(),
      name: f.name,
      type,
      file: f,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={user?.name} />

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
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4.66699 6.66699L8.00033 10.0003L11.3337 6.66699" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 10V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            학습 내용 다운
          </button>
        </div>
      </div>

      {/* 하단 회색 영역 */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_3fr]">
          {/* 왼쪽: 학습 내용 */}
          <LearningContent data={task.learningContent} />

          {/* 오른쪽: 멘토 피드백 영역 */}
          <section>
            {!feedback ? (
              /* ===== 피드백 미작성: 작성 폼 ===== */
              <>
                <h2 className="text-lg font-bold text-gray-900">멘토 피드백</h2>
                <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
                  {/* 프로필 */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-gray-200 overflow-hidden">
                      {user?.profileImage && (
                        <img src={user.profileImage} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                  </div>

                  {/* 피드백 입력 */}
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="피드백을 남겨주세요."
                      rows={5}
                      className="w-full resize-none bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                    />

                    {/* 업로드된 파일 목록 */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {uploadedFiles.map((f) => (
                          <div key={f.id} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-gray-600">
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                              {f.type === "image" ? "IMG" : "FILE"}
                            </span>
                            <span className="truncate">{f.name}</span>
                            <button
                              onClick={() => setUploadedFiles((prev) => prev.filter((item) => item.id !== f.id))}
                              className="ml-auto text-gray-400 hover:text-gray-600"
                            >
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 하단: 업로드 버튼 + 등록 */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* 이미지 업로드 */}
                      <label className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                          <path d="M11.3337 5.33301L8.00033 1.99967L4.66699 5.33301" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8 2V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        이미지 업로드
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "image")}
                        />
                      </label>

                      {/* 파일 업로드 */}
                      <label className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.33333 1.33301H4C3.64638 1.33301 3.30724 1.47348 3.05719 1.72353C2.80714 1.97358 2.66667 2.31272 2.66667 2.66634V13.333C2.66667 13.6866 2.80714 14.0258 3.05719 14.2758C3.30724 14.5259 3.64638 14.6663 4 14.6663H12C12.3536 14.6663 12.6928 14.5259 12.9428 14.2758C13.1929 14.0258 13.3333 13.6866 13.3333 13.333V5.33301L9.33333 1.33301Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9.33301 1.33301V5.33301H13.333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        파일 업로드
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "file")}
                        />
                      </label>
                    </div>

                    <button
                      onClick={handleFeedbackSubmit}
                      disabled={!feedbackText.trim() || feedbackLoading}
                      className="rounded-lg px-5 py-2 text-sm font-semibold text-white transition"
                      style={{
                        backgroundColor: feedbackText.trim() && !feedbackLoading ? "#6D87ED" : "#D1D5DB",
                        cursor: feedbackText.trim() && !feedbackLoading ? "pointer" : "not-allowed",
                      }}
                    >
                      {feedbackLoading ? "등록 중..." : "등록"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* ===== 피드백 작성 완료: 피드백 보기 + 수정/삭제 + 댓글 ===== */
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">멘토 피드백</h2>
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
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
                          onClick={() => {
                            setShowMenu(false);
                            setFeedbackText(feedback.content);
                            setIsEditing(true);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.5 1.75L12.25 3.5M1.75 12.25L2.3125 9.8125L10.0625 2.0625C10.2944 1.8306 10.6101 1.7002 10.9375 1.7002C11.2649 1.7002 11.5806 1.8306 11.8125 2.0625C12.0444 2.2944 12.1748 2.6101 12.1748 2.9375C12.1748 3.2649 12.0444 3.5806 11.8125 3.8125L4.0625 11.5625L1.75 12.25Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          수정
                        </button>
                        <button
                          onClick={() => { setShowMenu(false); handleFeedbackDelete(); }}
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
                        {feedback.mentorName}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{feedback.timeAgo}</span>
                  </div>
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                    {feedback.content}
                  </p>

                  {/* 첨부 파일 표시 */}
                  {feedback.files && feedback.files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {feedback.files.map((f) => (
                        <div key={f.id} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
                          <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500">
                            {f.type === "image" ? "IMG" : "FILE"}
                          </span>
                          <span className="truncate">{f.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 수정 모드 */}
                {isEditing && (
                  <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="피드백을 수정해주세요."
                        rows={5}
                        className="w-full resize-none bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                      />
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        onClick={() => { setIsEditing(false); setFeedbackText(""); }}
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleFeedbackUpdate}
                        disabled={!feedbackText.trim() || feedbackLoading}
                        className="rounded-lg px-5 py-2 text-sm font-semibold text-white transition"
                        style={{
                          backgroundColor: feedbackText.trim() && !feedbackLoading ? "#6D87ED" : "#D1D5DB",
                          cursor: feedbackText.trim() && !feedbackLoading ? "pointer" : "not-allowed",
                        }}
                      >
                        {feedbackLoading ? "수정 중..." : "수정 완료"}
                      </button>
                    </div>
                  </div>
                )}

                {/* 댓글 영역 */}
                <div className="mt-6 flex items-center gap-2 px-1">
                  <img src="/comment_icon.png" alt="댓글" className="h-5 w-5" />
                  <span className="text-sm font-bold text-gray-900">댓글</span>
                </div>
                <CommentSection taskId={feedbackId} />
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* ===== 댓글 섹션 (동일한 /api/v1/comments API 사용) ===== */
function CommentSection({ taskId }) {
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();

  // API에서 댓글 조회
  useEffect(() => {
    if (!taskId || !token) return;

    getComments(token, taskId)
      .then((json) => {
        const data = json.data ?? json;
        if (Array.isArray(data)) {
          const mapped = data.map((c) => ({
            id: c.commentId,
            author: c.writerName,
            authorAvatar: c.writerProfileUrl ?? null,
            timeAgo: formatTimeAgo(c.createdAt),
            content: c.content,
            isReply: true,
          }));
          setCommentList(mapped);
        }
      })
      .catch((err) => {
        console.error("댓글 조회 실패:", err);
      });
  }, [taskId, token]);

  const handleSubmit = async () => {
    if (!newComment.trim() || loading) return;

    if (taskId && token) {
      setLoading(true);
      try {
        const json = await createComment(token, {
          taskId,
          content: newComment.trim(),
        });
        const data = json.data ?? json;
        const comment = {
          id: data.commentId ?? Date.now(),
          author: data.writerName ?? user?.name ?? "나",
          authorAvatar: null,
          timeAgo: formatTimeAgo(data.createdAt) || "방금 전",
          content: data.content ?? newComment.trim(),
          isReply: true,
        };
        setCommentList((prev) => [...prev, comment]);
        setNewComment("");
      } catch (err) {
        console.error("댓글 작성 실패:", err);
      } finally {
        setLoading(false);
      }
    } else {
      const comment = {
        id: Date.now(),
        author: user?.name ?? "나",
        authorAvatar: null,
        timeAgo: "방금 전",
        content: newComment.trim(),
        isReply: true,
      };
      setCommentList((prev) => [...prev, comment]);
      setNewComment("");
    }
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
            disabled={!newComment.trim() || loading}
            className="shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition"
            style={{
              backgroundColor: newComment.trim() && !loading ? "#6D87ED" : "#D1D5DB",
              cursor: newComment.trim() && !loading ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "등록 중..." : "등록"}
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
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                  <img src="/reply.png" alt="답글" className="h-4 w-4" />
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
