import { useState } from "react";

export default function MemoCard({ memos, onAddMemo }) {
  const [text, setText] = useState("");

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="text-xl font-semibold">메모</div>
          <button
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
          >
            <span className="text-xl leading-none">
              <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.00012 1.00009L8.93924 6.51C9.47641 6.88281 9.51716 7.66236 9.02179 8.08914L1.00012 15.0001" stroke="#666666" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </span>
          </button>
      </div>
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {memos.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">메모가 없습니다.</p>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
          {memos.map((m, idx) => (
            <li key={m.memoId ?? idx} className="flex items-center gap-2 px-3 py-3 text-sm text-gray-800">
              <span>🌿</span>
              <span className="min-w-0">{m.content}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  );
}
