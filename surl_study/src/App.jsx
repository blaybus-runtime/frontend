import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Routes>
        {/* 홈 화면 - 멘토/멘티 역할 선택 */}
        <Route path="/" element={<HomePage />} />
        {/* 멘티 페이지 (로그인 필수) */}
        <Route path="/mentee" element={<ProtectedRoute><MenteeMain /></ProtectedRoute>} />
        <Route path="/mentee/task/:taskId" element={<ProtectedRoute><TaskDetailPage /></ProtectedRoute>} />
        <Route path="/mentee/calender" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        {/* 멘토 페이지 (로그인 필수) */}
        <Route path="/mentor" element={<ProtectedRoute><MentorMain /></ProtectedRoute>} />
        <Route path="/mentor/feedback/:feedbackId" element={<ProtectedRoute><FeedbackDetailPage /></ProtectedRoute>} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


