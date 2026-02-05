import { apiClient } from "./client";

export function login(username, password) {
  return apiClient("/api/v1/auth/login", {
    method: "POST",
    body: { username, password },
  });
}
