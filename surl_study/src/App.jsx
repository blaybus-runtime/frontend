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


import MainPage from "./pages/mentee/MainPage";

export default function App() {
  return <MainPage />;
}
