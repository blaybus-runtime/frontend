//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//     {/* tailwind tag 테스트 */}
//       <div className="bg-blue-500 text-white p-4">Hello</div>
//     </>
//   )
// }

// export default App


import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import HomePage from "./pages/home/HomePage";
import MenteeMain from "./pages/mentee/MainPage";
import MentorMain from "./pages/mentor/MainPage";
import TaskDetailPage from "./pages/mentee/TaskDetailPage";
import FeedbackDetailPage from "./pages/mentor/FeedbackDetailPage";
import CalendarPage from './pages/calender/CalendarPage';
import MentorMenteeDetailPage from './pages/mentee/MenteeDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Routes>
        {/* 홈 화면 - 멘토/멘티 역할 선택 */}
        <Route path="/" element={<HomePage />} />
        {/* 멘티 페이지 (MENTEE role 필수) */}
        <Route path="/mentee" element={<ProtectedRoute requiredRole="MENTEE"><MenteeMain /></ProtectedRoute>} />
        <Route path="/mentee/task/:taskId" element={<ProtectedRoute requiredRole="MENTEE"><TaskDetailPage /></ProtectedRoute>} />
        <Route path="/mentee/calendar" element={<ProtectedRoute requiredRole="MENTEE"><CalendarPage /></ProtectedRoute>} />
        {/* 멘토 페이지 (MENTOR role 필수) */}
        <Route path="/mentor" element={<ProtectedRoute requiredRole="MENTOR"><MentorMain /></ProtectedRoute>} />
        <Route path="/mentor/feedback/:feedbackId" element={<ProtectedRoute requiredRole="MENTOR"><FeedbackDetailPage /></ProtectedRoute>} />
        <Route path="/mentor/mentees/:menteeId" element={<ProtectedRoute requiredRole="MENTOR"><MentorMenteeDetailPage /></ProtectedRoute>} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


