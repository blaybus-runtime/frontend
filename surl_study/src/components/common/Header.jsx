export default function Header({ userName = "설이" }) {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="text-xl font-bold">셀스터디</div>

        <div className="flex items-center gap-5">
          <button className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
            <span className="text-lg">🔔</span>
            알림
          </button>

          <button className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-gray-100">
            <div className="h-7 w-7 rounded-full bg-gray-200" />
            <span className="text-sm font-medium">{userName}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
