import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getComments, createComment } from "../../api/task";

// 시간 포맷 헬퍼: createdAt → "N분 전", "N시간 전" 등
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

export default function MentorFeedback({ feedback, comments: initialComments, taskId }) {
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState(initialComments || []);
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();

  // taskId가 있으면 API에서 댓글 조회
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

    // taskId가 있으면 API로 댓글 작성
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
      // API 없이 로컬 추가 (폴백)
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
    <section>
      <h2 className="text-lg font-bold text-gray-900">멘토 피드백</h2>

      {/* 1. 피드백 글 카드 */}
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
      </div>

      {/* 2. 댓글 헤더 */}
      <div className="mt-6 flex items-center gap-2 px-1">
        <img src="/comment_icon.png" alt="댓글" className="h-5 w-5" />
        <span className="text-sm font-bold text-gray-900">
          댓글 {commentList.length}
        </span>
      </div>

      {/* 3. 댓글 입력 카드 */}
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
            className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${
              newComment.trim() && !loading
                ? "!bg-[#6D87ED] hover:bg-[#5a74d4] cursor-pointer"
                : "!bg-gray-300 cursor-not-allowed"
            }`}
          >
            {loading ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>

      {/* 4. 댓글 목록 카드 */}
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
    </section>
  );
}
