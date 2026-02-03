export default function ColumnCard({ items }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <ul className="divide-y divide-gray-100">
        {items.map((text, idx) => (
          <li key={idx} className="flex items-center gap-2 py-3 text-sm text-gray-800">
            <a>
              <span className="line-clamp-1">{text}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
