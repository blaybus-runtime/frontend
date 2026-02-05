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
 * POST /api/v1/mentors/me/mentees
 * 멘토가 새 멘티를 생성
 * body: { name, menteeProfile: { phoneNumber, email, highSchool, grade, targetUniv, subjects, messageToMentor } }
 * 응답: { user: { userId, username, name, role, profileImage }, tempPassword, menteeProfile: { ... } }
 */
export function createMentee(token, body) {
  return apiClient("/api/v1/mentors/me/mentees", { method: "POST", token, body });
}
