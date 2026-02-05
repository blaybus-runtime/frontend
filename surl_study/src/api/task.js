import { apiClient } from "./client";

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
 * worksheet 파일 업로드 (multipart/form-data)
 *
 * form fields: file, title, subject, materialType(optional)
 * 응답: { data: { worksheetId, title, subject, materialType, fileUrl, mentorId, createdAt } }
 */
export async function uploadWorksheet(token, { file, title, subject, materialType }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("subject", subject);
  if (materialType) formData.append("materialType", materialType);

  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  // Content-Type은 브라우저가 boundary와 함께 자동 설정하므로 직접 넣지 않음

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
