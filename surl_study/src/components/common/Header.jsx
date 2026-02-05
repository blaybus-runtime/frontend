import { Link } from "react-router-dom";

export default function Header({ userName = "설이", showAvatar = true }) {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/">
          <img src="/설스터디_아이콘.svg" alt="설스터디" className="h-8" />
        </Link>

        <div className="flex items-center">
          <button className="flex items-center gap-3 rounded-full px-3 py-2 text-sm hover:bg-gray-100 !bg-white">
            <svg width="24" height="26" viewBox="0 0 26 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.3068 26.3333C15.0724 26.7374 14.7359 27.0729 14.3311 27.306C13.9263 27.5392 13.4673 27.6619 13.0001 27.6619C12.5329 27.6619 12.074 27.5392 11.6692 27.306C11.2643 27.0729 10.9279 26.7374 10.6935 26.3333M21.0001 9C21.0001 6.87827 20.1573 4.84344 18.657 3.34315C17.1567 1.84285 15.1219 1 13.0001 1C10.8784 1 8.84356 1.84285 7.34327 3.34315C5.84298 4.84344 5.00012 6.87827 5.00012 9C5.00012 18.3333 1.00012 21 1.00012 21H25.0001C25.0001 21 21.0001 18.3333 21.0001 9Z" stroke="#2B2B2B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span className='text-base font-bold'>알림</span>
          </button>

          <button className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-gray-100 !bg-white">
            {showAvatar && <div className="h-7 w-7 rounded-full bg-gray-200" />}
            <span className="text-base font-bold">{userName}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
