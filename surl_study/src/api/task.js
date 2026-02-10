import { apiClient } from "./client";

/**
 * GET /api/v1/mentor/mentees/{menteeId}/memos?limit=5
 * 홈화면 메모카드 (최대 5개)
 *
 * 응답: { status, message, data: { items: [{ memoId, content, createdAt }] } }
 */
export function getMentorMemos(token, menteeId, limit = 5) {
  return apiClient(`/api/v1/mentor/mentees/${menteeId}/memos?limit=${limit}`, {
    method: "GET",
    token,
  });
}

/**
 * GET /api/v1/mentor/mentees/{menteeId}/memos
 * 메모 전체 조회 (화살표 눌렀을 때)
 *
 * 응답: { status, message, data: { items: [{ memoId, content, createdAt }] } }
 */
export function getAllMentorMemos(token, menteeId) {
  return apiClient(`/api/v1/mentor/mentees/${menteeId}/memos`, {
    method: "GET",
    token,
  });
}

/**
 * GET /api/v1/study/progress?menteeId={menteeId}&startDate={startDate}&endDate={endDate}
 * 멘티 캘린더: 기간별 진척도 조회
 *
 * 응답: { status, message, data: { menteeId, period, summary, dailyStats: [{ date, hasTodo, progressRate }] } }
 */
export function getStudyProgress(token, menteeId, startDate, endDate) {
  return apiClient(
    `/api/v1/study/progress?menteeId=${menteeId}&startDate=${startDate}&endDate=${endDate}`,
    { method: "GET", token }
  );
}

/**
 * GET /api/v1/study/daily?menteeId={menteeId}&date={date}
 * 멘티 홈화면: 특정 날짜의 todo 리스트 조회
 * 멘티 달력화면: 특정 날짜 선택 시 todo 리스트 조회
 *
 * 응답: { status, message, data: { menteeId, plannerId, date, todos: [...], timeRecords: [...] } }
 */
export function getStudyDaily(token, menteeId, date) {
  return apiClient(`/api/v1/study/daily?menteeId=${menteeId}&date=${date}`, {
    method: "GET",
    token,
  });
}

/**
 * GET /api/v1/mentor/planners/daily?menteeId={menteeId}&date={date}
 * 멘토가 특정 멘티의 일일 할 일 목록 조회
 *
 * 응답: { status, message, data: { menteeId, plannerId, date, todos: [...], timeRecords: [...] } }
 */
export function getMenteeDailyPlan(token, menteeId, date) {
  return apiClient(`/api/v1/mentor/planners/daily?menteeId=${menteeId}&date=${date}`, {
    method: "GET",
    token,
  });
}

/**
 * GET /api/v1/mentor/planners/pending-feedback?menteeId={menteeId}
 * 멘티의 전체 미완료 피드백 목록 조회 (과제완료 + 피드백 미작성)
 *
 * 응답: { status, data: [ { taskId, title, content, subject, taskType, date } ] }
 */
export function getPendingFeedback(token, menteeId) {
  return apiClient(`/api/v1/mentor/planners/pending-feedback?menteeId=${menteeId}`, {
    method: "GET",
    token,
  });
}

/**
 * POST /api/v1/mentor/tasks/batch
 * 멘토가 멘티에게 할일을 일괄 생성
 *
 * body: { menteeId, subject, goal, title, startDate, endDate, weekdays, files }
 * 응답: { data: { menteeId, createdCount, tasks: [{ taskId, date, subject, goal, title, status, createdBy }] } }
 */
export function createTaskBatch(token, body) {
  return apiClient(`/api/v1/mentor/tasks/batch`, {
    method: "POST",
    token,
    body,
  });
}

/**
 * POST /api/v1/mentee/tasks/batch
 * 멘티가 새로운 task 생성 (같은 과제 여러 날짜에 일괄 생성 가능)
 *
 * body: { subject, goal, title, startDate, endDate, days?, worksheetId? }
 * 응답: { data: { menteeId, createdCount, tasks: [{ taskId, date, subject, goal, title, status, createdBy }] } }
 */
export function createMenteeTaskBatch(token, body) {
  return apiClient(`/api/v1/mentee/tasks/batch`, {
    method: "POST",
    token,
    body,
  });
}

/**
 * PATCH /api/v1/study/tasks/{taskId}?menteeId={menteeId}
 * task 상태 변경 (TODO → DONE)
 *
 * body: { isCompleted: true/false }
 * 응답: { data: { taskId, isCompleted } }
 */
export function updateTaskStatus(token, taskId, menteeId, isCompleted) {
  return apiClient(`/api/v1/study/tasks/${taskId}?menteeId=${menteeId}`, {
    method: "PATCH",
    token,
    body: { isCompleted },
  });
}

/**
 * POST /api/v1/mentor/worksheets
 * 멘토가 생성하는 todo의 worksheet 파일 업로드 (multipart/form-data)
 *
 * form fields: file, title, subject, materialType(optional)
 * 응답: { data: { worksheetId, title, subject, materialType, fileUrl, mentorId, createdAt } }
 */
export async function uploadMentorWorksheet(token, { file, title, subject, materialType }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("subject", subject);
  if (materialType) formData.append("materialType", materialType);

  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/v1/mentor/worksheets`, {
    method: "POST",
    headers,
    body: formData,
  });

  const json = await res.json();

  if (!res.ok) {
    const err = new Error(json.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = json;
    throw err;
  }

  return json;
}

/**
 * POST /api/v1/mentee/worksheets
 * 멘티가 생성하는 todo의 worksheet 파일 업로드 (multipart/form-data)
 *
 * form fields: file, title, subject, materialType(optional)
 * 응답: { data: { worksheetId, title, subject, materialType, fileUrl, menteeId, createdAt } }
 */
export async function uploadMenteeWorksheet(token, { file, title, subject, materialType }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("subject", subject);
  if (materialType) formData.append("materialType", materialType);

  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/v1/mentee/worksheets`, {
    method: "POST",
    headers,
    body: formData,
  });

  const json = await res.json();

  if (!res.ok) {
    const err = new Error(json.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = json;
    throw err;
  }

  return json;
}

/**
 * POST /api/v1/study/time-records
 * 공부 시간 기록
 *
 * body: { plannerId, subject, startTime: "HH:mm:ss", endTime: "HH:mm:ss" }
 * 응답: { status, message, data: timeRecordId }
 */
export function recordStudyTime(token, body) {
  return apiClient("/api/v1/study/time-records", {
    method: "POST",
    token,
    body,
  });
}

/**
 * DELETE /api/v1/study/time-records/{recordId}
 * 공부 시간 기록 삭제
 */
export function deleteTimeRecord(token, recordId) {
  return apiClient(`/api/v1/study/time-records/${recordId}`, {
    method: "DELETE",
    token,
  });
}

/**
 * GET /api/v1/assignments/{assignmentId}/feedback
 * 특정 task의 멘토 피드백 조회
 */
export function getFeedback(token, assignmentId) {
  return apiClient(`/api/v1/assignments/${assignmentId}/feedback`, {
    method: "GET",
    token,
  });
}

/**
 * POST /api/v1/assignments/{assignmentId}/feedback
 * 멘토 피드백 작성 (multipart/form-data)
 *
 * form fields: content (string, required), files (optional)
 */
export async function createFeedback(token, assignmentId, { content, files }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const formData = new FormData();
  formData.append("content", content);
  if (files && files.length > 0) {
    files.forEach((f) => formData.append("files", f));
  }

  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/v1/assignments/${assignmentId}/feedback`, {
    method: "POST",
    headers,
    body: formData,
  });

  const json = await res.json();

  if (!res.ok) {
    const err = new Error(json.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = json;
    throw err;
  }

  return json;
}

/**
 * PUT /api/v1/assignments/{assignmentId}/feedback
 * 멘토 피드백 수정
 *
 * body: { content }
 */
export function updateFeedback(token, assignmentId, body) {
  return apiClient(`/api/v1/assignments/${assignmentId}/feedback`, {
    method: "PUT",
    token,
    body,
  });
}

/**
 * DELETE /api/v1/assignments/{assignmentId}/feedback
 * 멘토 피드백 삭제
 */
export function deleteFeedback(token, assignmentId) {
  return apiClient(`/api/v1/assignments/${assignmentId}/feedback`, {
    method: "DELETE",
    token,
  });
}

/**
 * GET /api/v1/comments?taskId={taskId}
 * 특정 task의 댓글 목록 조회
 *
 * 응답: { status, message, data: [{ commentId, taskId, authorId, authorName, content, createdAt }] }
 */
export function getComments(token, taskId) {
  return apiClient(`/api/v1/comments?taskId=${taskId}`, {
    method: "GET",
    token,
  });
}

/**
 * POST /api/v1/comments
 * 댓글 작성
 *
 * body: { taskId, content }
 * 응답: { status, message, data: { commentId, taskId, authorId, authorName, content, createdAt } }
 */
export function createComment(token, body) {
  return apiClient("/api/v1/comments", {
    method: "POST",
    token,
    body,
  });
}

/**
 * GET /api/v1/tasks/{taskId}
 * Todo 상세 조회 (학습지 + 제출물 포함)
 *
 * 응답: { data: { taskId, content, subject, feedbackContent, worksheets: [...], submissions: [...] } }
 */
export function getTaskDetail(token, taskId) {
  return apiClient(`/api/v1/tasks/${taskId}`, {
    method: "GET",
    token,
  });
}

/**
 * POST /api/v1/mentee/study/tasks/{taskId}/submissions
 * 멘티 학습 내용 파일 제출 (multipart/form-data)
 *
 * form fields: files (multiple)
 * 응답: { assignmentId, menteeId, taskId, status, submittedAt, files: [...] }
 */
export async function submitFiles(token, taskId, files) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));

  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/v1/mentee/study/tasks/${taskId}/submissions`, {
    method: "POST",
    headers,
    body: formData,
  });

  const json = await res.json();

  if (!res.ok) {
    const err = new Error(json.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = json;
    throw err;
  }

  return json;
}

/**
 * PUT /api/v1/mentee/study/tasks/{taskId}/submissions
 * 멘티 제출물 수정 (기존 파일 유지/삭제 + 새 파일 추가)
 *
 * form fields:
 *   - keepFileIds: "30006,30007" (유지할 파일 ID 쉼표 구분)
 *   - newFiles: 새로 추가할 파일들
 * 응답: { assignmentId, menteeId, taskId, status, submittedAt, files: [...] }
 */
export async function updateSubmissionFiles(token, taskId, keepFileIds, newFiles) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const formData = new FormData();

  if (keepFileIds && keepFileIds.length > 0) {
    formData.append("keepFileIds", keepFileIds.join(","));
  }

  if (newFiles && newFiles.length > 0) {
    newFiles.forEach((f) => formData.append("newFiles", f));
  }

  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/v1/mentee/study/tasks/${taskId}/submissions`, {
    method: "PUT",
    headers,
    body: formData,
  });

  const json = await res.json();

  if (!res.ok) {
    const err = new Error(json.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = json;
    throw err;
  }

  return json;
}

/**
 * GET /api/v1/assignments/{assignmentId}/feedback/files/{fileId}/download
 * 피드백 첨부파일 개별 다운로드
 */
export async function downloadFeedbackFile(token, assignmentId, fileId, fileName) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/v1/assignments/${assignmentId}/feedback/files/${fileId}/download`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  const disposition = res.headers.get("Content-Disposition");
  a.download = disposition?.match(/filename="?(.+?)"?$/)?.[1] || fileName || "download";

  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

/**
 * GET /api/v1/tasks/{taskId}/worksheets/download
 * 멘토가 등록한 학습지를 zip으로 일괄 다운로드
 */
export async function downloadWorksheets(token, taskId) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/v1/tasks/${taskId}/worksheets/download`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  const disposition = res.headers.get("Content-Disposition");
  const filename = disposition?.match(/filename="?(.+?)"?$/)?.[1] || `worksheets_${taskId}.zip`;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
