import { apiClient } from "./client";

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
 * POST /api/v1/mentor/tasks/batch?mentorId={mentorId}
 * 멘토가 멘티에게 할일을 일괄 생성
 *
 * body: { menteeId, subject, goal, title, startDate, endDate, worksheetId? }
 * 응답: { data: { menteeId, createdCount, tasks: [{ taskId, date, subject, goal, title, status, createdBy }] } }
 */
export function createTaskBatch(token, mentorId, body) {
  return apiClient(`/api/v1/mentor/tasks/batch?mentorId=${mentorId}`, {
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
 * GET /api/v1/assignments/{taskId}/feedback
 * 특정 task의 멘토 피드백 조회
 *
 * 응답: { status, message, data: { feedbackId, mentorName, content, createdAt, ... } }
 */
export function getFeedback(token, taskId) {
  return apiClient(`/api/v1/assignments/${taskId}/feedback`, {
    method: "GET",
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
