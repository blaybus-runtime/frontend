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
import HomePage from "./pages/home/HomePage";
import MenteeMain from "./pages/mentee/MainPage";
import MentorMain from "./pages/mentor/MainPage";
import TaskDetailPage from "./pages/mentee/TaskDetailPage";
import FeedbackDetailPage from "./pages/mentor/FeedbackDetailPage";
import CalendarPage from './pages/calender/CalendarPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 홈 화면 - 멘토/멘티 역할 선택 */}
        <Route path="/" element={<HomePage />} />
        {/* 주소 뒤에 /mentee를 붙이면 이동 */}
        <Route path="/mentee" element={<MenteeMain />} />
        {/* 할일 상세 페이지 */}
        <Route path="/mentee/task/:taskId" element={<TaskDetailPage />} />
        {/* 캘린더 페이지 */}
        <Route path="/mentee/calender" element={<CalendarPage />} />
        {/* 주소 뒤에 /mentor를 붙이면 이동 */}
        <Route path="/mentor" element={<MentorMain />} />
        {/* 멘토 피드백 상세 페이지 */}
        <Route path="/mentor/feedback/:feedbackId" element={<FeedbackDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}


