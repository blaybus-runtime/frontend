import { apiClient } from "./client";

/**
 * GET /api/v1/matchings?date=yyyy-MM-dd
 * 멘토의 멘티 카드 목록 조회
 * 응답: { status, message, data: [{ menteeId, name, profileImageUrl, unwrittenFeedbackCount }] }
 */
export function getMyMentees(token, date) {
  return apiClient(`/api/v1/matchings?date=${date}`, { token });
}
