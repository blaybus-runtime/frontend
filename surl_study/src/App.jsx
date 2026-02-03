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
import MenteeMain from "./pages/mentee/MainPage";
import MentorMain from "./pages/mentor/MainPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 주소 뒤에 /mentee를 붙이면 이동 */}
        <Route path="/mentee" element={<MenteeMain />} />
        {/* 주소 뒤에 /mentor를 붙이면 이동 */}
        <Route path="/mentor" element={<MentorMain />} />
      </Routes>
    </BrowserRouter>
  );
}


