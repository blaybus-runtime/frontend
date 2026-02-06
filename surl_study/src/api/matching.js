import { apiClient } from "./client";

/**
 * GET /api/v1/matchings?date=yyyy-MM-dd
 * 멘토의 멘티 카드 목록 조회
 * 응답: { status, message, data: [{ menteeId, name, profileImageUrl, unwrittenFeedbackCount }] }
 */
export function getMyMentees(token, date) {
  return apiClient(`/api/v1/matchings?date=${date}`, { token });
}

/**
 * GET /api/v1/matchings/daily-tasks
 * 멘토의 모든 멘티 전체 미완료 피드백 목록 조회 (date 없으면 전체)
 * 응답: { status, message, data: [{ menteeId, menteeName, plannerId, taskId, subject, taskContent, completedAt }] }
 */
export function getAllPendingFeedbacks(token) {
  return apiClient("/api/v1/matchings/daily-tasks", { token });
}

/**
 * GET /api/v1/matchings/daily-tasks?date=yyyy-MM-dd
 * 멘토의 모든 멘티 특정 날짜 미완료 피드백 목록 조회
 * 응답: { status, message, data: [{ menteeId, menteeName, plannerId, taskId, subject, taskContent, completedAt }] }
 */
export function getPendingFeedbacksByDate(token, date) {
  return apiClient(`/api/v1/matchings/daily-tasks?date=${date}`, { token });
}

/**
 * POST /api/v1/mentors/me/mentees
 * 멘토가 새 멘티를 생성
 * body: { name, menteeProfile: { phoneNumber, email, highSchool, grade, targetUniv, subjects, messageToMentor } }
 * 응답: { user: { userId, username, name, role, profileImage }, tempPassword, menteeProfile: { ... } }
 */
export function createMentee(token, body) {
  return apiClient("/api/v1/mentors/me/mentees", { method: "POST", token, body });
}
