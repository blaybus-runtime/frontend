import { apiClient } from "./client";

/**
 * GET /api/v1/notifications
 * 내 알림 목록 조회 (최신순)
 */
export function getNotifications(token) {
  return apiClient("/api/v1/notifications", { method: "GET", token });
}

/**
 * PATCH /api/v1/notifications/{notificationId}/read
 * 알림 읽음 처리
 */
export function markNotificationRead(token, notificationId) {
  return apiClient(`/api/v1/notifications/${notificationId}/read`, {
    method: "PATCH",
    token,
  });
}
