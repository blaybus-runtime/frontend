// export default function TaskCard({ task }) {
//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${task.tagColor}`}>
//             {task.tag}
//           </span>
//           <div className="mt-2 text-sm font-medium">{task.title}</div>
//         </div>

//         <div className="flex items-center gap-3">
//           <button className="rounded-md px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50">
//             ✎ {task.status}
//           </button>

//           <button
//             className={`flex h-6 w-6 items-center justify-center rounded-md border ${
//               task.done ? "border-indigo-200 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-300"
//             }`}
//             aria-label="완료 체크"
//           >
//             ✓
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
export default function TaskCard({ task }) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        {/* Left */}
        <div className="min-w-0">
          <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${task.tagColor}`}
          >
            {task.tag}
          </span>

          <div className="mt-2 truncate text-sm font-semibold text-gray-900">
            {task.title}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-2">
          {/* checkbox (top-right) */}
          <button
            className={`flex h-6 w-6 items-center justify-center rounded-md border ${
              task.done
                ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                : "border-gray-200 bg-white text-gray-300"
            }`}
            aria-label="완료 체크"
          >
            ✓
          </button>

          {/* status (bottom-right) */}
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
            <span aria-hidden>💬</span>
            <span>{task.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

