// src/mocks/handlers.js
import { http, HttpResponse, delay } from "msw";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * In-memory DB (새로고침하면 초기화됨)
 */
const db = {
  mentor: {
    userId: 7,
    username: "mentor01",
    name: "멘토이름2",
    role: "MENTOR",
    profileImage: "https://example.com/mentor.png",
    profile: {
      major: "컴퓨터공학",
      bio: "합격자 멘토입니다.",
      subjects: ["MATH", "ENG"],
      isVerified: true,
    },
    updatedAt: "2026-02-02T18:30:00",
  },
  mentee: {
    userId: 100,
    username: "mentee01",
    name: "홍길동",
    role: "MENTEE",
    profileImage: "https://example.com/profile.png",
    profile: {
      schoolName: "OO고",
      grade: 2,
      targetUniv: "OO대",
    },
    updatedAt: "2026-02-02T18:30:00",
  },

  // 멘토가 관리하는 멘티 목록
  mentees: [
    { userId: 100, username: "mentee01", name: "홍길동", profileImageUrl: null, unwrittenFeedbackCount: 2 },
    { userId: 101, username: "mentee02", name: "설이 멘티", profileImageUrl: null, unwrittenFeedbackCount: 1 },
    { userId: 102, username: "mentee03", name: "채영 멘티", profileImageUrl: null, unwrittenFeedbackCount: 3 },
    { userId: 103, username: "mentee04", name: "유나 멘티", profileImageUrl: null, unwrittenFeedbackCount: 0 },
    { userId: 104, username: "mentee05", name: "동수 멘티", profileImageUrl: null, unwrittenFeedbackCount: 0 },
  ],
};

function getBearerToken(request) {
  const auth = request.headers.get("authorization") || request.headers.get("Authorization");
  if (!auth) return null;
  const [type, token] = auth.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
}

/**
 * 토큰 → role 매핑 (mock 규칙)
 * - mentor 로그인 토큰: jwt.mock.token
 * - mentee 로그인 토큰: jwt.mock.mentee
 */
function tokenToRole(token) {
  if (token === "jwt.mock.token") return "MENTOR";
  if (token === "jwt.mock.mentee") return "MENTEE";
  return null;
}

export const handlers = [
  /**
   * POST /api/v1/auth/login
   * request: { username, password }
   * response: { status, message, data: { accessToken, user } }
   */
  http.post(`${API_BASE_URL}/api/v1/auth/login`, async ({ request }) => {
    await delay(300);

    const { username, password } = await request.json();

    // 간단 검증
    const okPw = password === "pw1234!";
    const known = ["mentor01", "mentee01"].includes(username);

    if (!known || !okPw) {
      return HttpResponse.json(
        { status: 401, message: "Invalid credentials", data: null },
        { status: 401 }
      );
    }

    const role = username.startsWith("mentor") ? "MENTOR" : "MENTEE";
    const accessToken = role === "MENTOR" ? "jwt.mock.token" : "jwt.mock.mentee";

    const user =
      role === "MENTOR"
        ? {
            userId: 7,
            name: "멘토이름",
            username: "mentor01",
            role: "MENTOR",
            profileImage: "https://example.com/mentor.png",
          }
        : {
            userId: 100,
            name: "홍길동",
            username: "mentee01",
            role: "MENTEE",
            profileImage: "https://example.com/profile.png",
          };

    return HttpResponse.json(
      {
        status: 200,
        message: "Success",
        data: { accessToken, user },
      },
      { status: 200 }
    );
  }),

  /**
   * POST /api/v1/mentors/me/mentees
   * Header: Authorization: Bearer {accessToken (MENTOR)}
   * body: { username, password, name, menteeProfile: {...} }
   *
   * flow:
   * - token role=MENTOR 아니면 403
   * - username 중복이면 409
   */
  http.post(`${API_BASE_URL}/api/v1/mentors/me/mentees`, async ({ request }) => {
    await delay(300);

    const token = getBearerToken(request);
    const role = token ? tokenToRole(token) : null;

    if (!token) {
      return HttpResponse.json(
        { status: 401, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    if (role !== "MENTOR") {
      return HttpResponse.json(
        { status: 403, message: "Forbidden", data: null },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { username, password, name, menteeProfile } = body || {};

    if (!username || !password || !name || !menteeProfile) {
      return HttpResponse.json(
        { status: 400, message: "Bad Request", data: null },
        { status: 400 }
      );
    }

    const exists = db.mentees.some((m) => m.username === username);
    if (exists) {
      return HttpResponse.json(
        { status: 409, message: "Username already exists", data: null },
        { status: 409 }
      );
    }

    const newId = Math.max(0, ...db.mentees.map((m) => m.userId)) + 1;

    db.mentees.push({ userId: newId, username });

    return HttpResponse.json(
      {
        status: 200,
        message: "Success",
        data: {
          mentee: {
            userId: newId,
            username,
            name,
            role: "MENTEE",
            status: "ACTIVE",
          },
          matching: {
            mentorId: 7,
            menteeId: newId,
            status: "MATCHED",
          },
        },
      },
      { status: 200 }
    );
  }),

  /**
   * GET /api/v1/users/me
   * Header: Authorization: Bearer {accessToken}
   * response: role에 따라 멘토/멘티 프로필 반환
   */
  http.get(`${API_BASE_URL}/api/v1/users/me`, async ({ request }) => {
    await delay(200);

    const token = getBearerToken(request);
    const role = token ? tokenToRole(token) : null;

    if (!token || !role) {
      return HttpResponse.json(
        { status: 401, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const data = role === "MENTOR" ? db.mentor : db.mentee;

    return HttpResponse.json(
      { status: 200, message: "Success", data },
      { status: 200 }
    );
  }),

  /**
   * PATCH /api/v1/users/me
   * Header: Authorization: Bearer {accessToken}
   *
   * flow:
   * - 요청에 포함된 필드만 업데이트
   * - 누락된 필드는 유지
   *
   * 공통 변경 가능: name, nickname, profileImage
   * 멘티 profile 변경: schoolName, grade, targetUniv
   * 멘토 profile 변경: major, subjects, (bio 허용), (profileImage 언급되어 있어 반영 가능)
   */
  /**
   * GET /api/v1/matchings?date=yyyy-MM-dd
   * 멘토의 멘티 카드 목록 조회
   */
  http.get(`${API_BASE_URL}/api/v1/matchings`, async ({ request }) => {
    await delay(200);

    const token = getBearerToken(request);
    const role = token ? tokenToRole(token) : null;

    if (!token || !role) {
      return HttpResponse.json(
        { status: 401, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    if (role !== "MENTOR") {
      return HttpResponse.json(
        { status: 403, message: "멘토만 접근할 수 있습니다.", data: null },
        { status: 403 }
      );
    }

    const data = db.mentees.map((m) => ({
      menteeId: m.userId,
      name: m.name,
      profileImageUrl: m.profileImageUrl,
      unwrittenFeedbackCount: m.unwrittenFeedbackCount,
    }));

    return HttpResponse.json(
      { status: 200, message: "Success", data },
      { status: 200 }
    );
  }),

  /**
   * POST /api/v1/mentor/tasks/batch?mentorId={mentorId}
   * 멘토가 멘티에게 할일 일괄 생성
   */
  http.post(`${API_BASE_URL}/api/v1/mentor/tasks/batch`, async ({ request }) => {
    await delay(300);

    const body = await request.json();
    const { menteeId, subject, goal, title, startDate, endDate } = body || {};

    if (!menteeId || !subject || !goal || !title || !startDate || !endDate) {
      return HttpResponse.json(
        { status: 400, message: "Bad Request", data: null },
        { status: 400 }
      );
    }

    // startDate ~ endDate 사이 날짜마다 task 생성
    const tasks = [];
    let taskIdCounter = Date.now();
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      tasks.push({
        taskId: taskIdCounter++,
        date: d.toISOString().split("T")[0],
        subject,
        goal,
        title,
        status: "UNDONE",
        createdBy: "MENTOR",
      });
    }

    return HttpResponse.json(
      {
        status: 200,
        message: "Success",
        data: {
          menteeId,
          createdCount: tasks.length,
          tasks,
        },
      },
      { status: 200 }
    );
  }),

  /**
   * PATCH /api/v1/study/tasks/:taskId?menteeId={menteeId}
   * task 상태 변경 (TODO → DONE)
   */
  http.patch(`${API_BASE_URL}/api/v1/study/tasks/:taskId`, async ({ request, params }) => {
    await delay(200);

    const { taskId } = params;
    const body = await request.json();
    const isCompleted = body?.isCompleted ?? true;

    return HttpResponse.json(
      {
        status: 200,
        message: "Success",
        data: { taskId: Number(taskId), isCompleted },
      },
      { status: 200 }
    );
  }),

  /**
   * POST /api/v1/mentor/worksheets
   * worksheet 파일 업로드 (multipart/form-data)
   */
  http.post(`${API_BASE_URL}/api/v1/mentor/worksheets`, async ({ request }) => {
    await delay(300);

    const formData = await request.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const subject = formData.get("subject");
    const materialType = formData.get("materialType") || "FILE";

    if (!file || !title || !subject) {
      return HttpResponse.json(
        { status: 400, message: "file, title, subject는 필수입니다.", data: null },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      {
        status: 200,
        message: "Success",
        data: {
          worksheetId: Date.now(),
          title,
          subject,
          materialType,
          fileUrl: `/uploads/mock_${file.name}`,
          mentorId: 7,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  }),

  http.patch(`${API_BASE_URL}/api/v1/users/me`, async ({ request }) => {
    await delay(300);

    const token = getBearerToken(request);
    const role = token ? tokenToRole(token) : null;

    if (!token || !role) {
      return HttpResponse.json(
        { status: 401, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const body = await request.json();
    const target = role === "MENTOR" ? db.mentor : db.mentee;

    // 공통 업데이트
    if (body?.name !== undefined) target.name = body.name;
    if (body?.nickname !== undefined) target.nickname = body.nickname;
    if (body?.profileImage !== undefined) target.profileImage = body.profileImage;

    // role별 profile 업데이트(부분 업데이트)
    if (body?.profile && typeof body.profile === "object") {
      if (role === "MENTEE") {
        const p = body.profile;
        if (p.schoolName !== undefined) target.profile.schoolName = p.schoolName;
        if (p.grade !== undefined) target.profile.grade = p.grade;
        if (p.targetUniv !== undefined) target.profile.targetUniv = p.targetUniv;
      } else {
        const p = body.profile;
        if (p.major !== undefined) target.profile.major = p.major;
        if (p.subjects !== undefined) target.profile.subjects = p.subjects;
        if (p.bio !== undefined) target.profile.bio = p.bio;

        // "멘토 변경 가능: ... profileImage"가 profile 안에 온다고 가정한 경우도 처리
        if (p.profileImage !== undefined) target.profileImage = p.profileImage;
      }
    }

    target.updatedAt = new Date().toISOString();

    return HttpResponse.json(
      { status: 200, message: "Success", data: target },
      { status: 200 }
    );
  }),
];
