export default function GlobalPopup({
  open,
  message,
  buttonLabel,
  onClose,
  onClickButton,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center pb-10">
      <div
        className="w-[520px] rounded-2xl border bg-white px-6 py-5"
        style={{
          borderColor: "#DAE1FF",
          boxShadow: "0 14px 40px rgba(15,23,42,0.18)",
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DAE1FF] text-[#6D87ED]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 3h7l3 3v15H7V3Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path d="M14 3v4h4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[16px] font-semibold text-[#6D87ED]">설스터디</span>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"
            aria-label="닫기"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-4 text-[15px] font-medium text-slate-700">{message}</div>

        <button
          onClick={onClickButton}
          className="mt-5 h-12 w-full rounded-xl text-[15px] font-semibold text-white"
          style={{ backgroundColor: "#6D87ED" }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
