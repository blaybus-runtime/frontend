import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "../../components/common/Header";
import LearningContent from "../../components/mentee/LearningContent";
import MentorFeedback from "../../components/mentee/MentorFeedback";
import { useAuth } from "../../context/AuthContext";
import { downloadWorksheets, getTaskDetail, submitFiles } from "../../api/task";

// 과목별 태그 색상 매핑
const SUBJECT_COLORS = {
  국어: "bg-amber-100 text-amber-700",
  영어: "bg-rose-100 text-rose-700",
  수학: "bg-emerald-100 text-emerald-700",
};

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const location = useLocation();
  const { token } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const taskFromState = location.state?.task;

  // API에서 가져온 상세 데이터
  const [worksheets, setWorksheets] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // 기본 정보 (navigation state에서)
  const subject = taskFromState?.subject || "국어";
  const subjectColor = SUBJECT_COLORS[subject] || "bg-gray-100 text-gray-700";
  const taskTitle = taskFromState?.taskTitle || "";
  const goal = taskFromState?.goal || "";
  const content = taskFromState?.title || "";

  // Task 상세 조회 (학습지 + 제출물)
  const fetchTaskDetail = useCallback(async () => {
    if (!token || !taskId) return;
    try {
      const res = await getTaskDetail(token, taskId);
      const data = res.data || res;
      setWorksheets(data.worksheets || []);
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error("할일 상세 조회 실패:", err);
    }
  }, [token, taskId]);

  useEffect(() => {
    fetchTaskDetail();
  }, [fetchTaskDetail]);

  // 학습 자료 다운로드
  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadWorksheets(token, taskId);
    } catch (err) {
      console.error("학습 자료 다운로드 실패:", err);
      alert("학습 자료 다운로드에 실패했습니다.");
    } finally {
      setDownloading(false);
    }
  };

  // 학습 내용 파일 제출
  const handleSubmitFiles = async (files) => {
    if (uploading) return;
    setUploading(true);
    try {
      await submitFiles(token, taskId, files);
      // 제출 후 목록 새로고침
      await fetchTaskDetail();
    } catch (err) {
      console.error("파일 제출 실패:", err);
      alert("파일 제출에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName="설이" />

      {/* 상단 흰색 영역: 과목 & 제목 */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${subjectColor}`}
              >
                {subject}
              </span>
              <h1 className="text-lg font-bold text-gray-900">
                {taskTitle}
              </h1>
            </div>
            <p className="mt-2 pl-14 text-sm text-gray-400">
              {goal ? `${subject} ${goal}` : content}
            </p>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 rounded-full !bg-[#6D87ED] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#5a74d4] disabled:opacity-50"
          >
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
            {downloading ? "다운로드 중..." : "학습 자료"}
          </button>
        </div>
      </div>

      {/* 하단 회색 영역: 학습 내용 + 멘토 피드백 */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_3fr]">
          {/* 왼쪽: 학습 내용 */}
          <LearningContent
            worksheets={worksheets}
            submissions={submissions}
            onSubmitFiles={handleSubmitFiles}
            uploading={uploading}
          />

          {/* 오른쪽: 멘토 피드백 + 댓글 */}
          <MentorFeedback taskId={taskId} />
        </div>
      </main>
    </div>
  );
}
