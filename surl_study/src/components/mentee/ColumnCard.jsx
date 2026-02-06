export default function ColumnCard({ items }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <ul className="divide-y divide-gray-100">
        {items.map((item, idx) => {
          const title = typeof item === "string" ? item : item.title;
          const url = typeof item === "string" ? null : item.url;

          return (
            <li key={idx} className="flex items-center gap-2 py-3 text-sm text-gray-800">
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#6D87ED] transition-colors w-full"
                >
                  <span className="line-clamp-1">{title}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-gray-400">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              ) : (
                <span className="line-clamp-1">{title}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
