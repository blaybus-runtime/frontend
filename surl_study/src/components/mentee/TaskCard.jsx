import { useNavigate } from "react-router-dom";

export default function TaskCard({ task, hideWorksheets = false }) {
  const navigate = useNavigate();

  const feedbackDone = task.feedbackDone ?? false;
  const isSubmitted = task.isSubmitted ?? false;

  const feedbackText = feedbackDone ? "피드백 완료" : "피드백 대기";
  const submissionText = isSubmitted ? "과제 제출" : "과제 미완료";

  return (
    <div
      className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/mentee/task/${task.id}`, { state: { task } })}
    >
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

          {!hideWorksheets && task.worksheets && task.worksheets.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {task.worksheets.map((w) => (
                <a
                  key={w.worksheetId}
                  href={w.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  {w.title || "학습지"}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Right - 과제 제출 상태 + 피드백 상태 (좌우 배치) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* 과제 제출 상태 */}
          <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
            isSubmitted
                ? "!text-[#6D87ED]"
                : "!text-gray-400"
          }`}>
            <span aria-hidden>
              {isSubmitted ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <polyline points="9 15 12 18 16 12"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
              )}
            </span>
            <span>{submissionText}</span>
          </div>

          {/* 구분선 */}
          <div className="h-3.5 w-px bg-gray-300" />

          {/* 피드백 상태 */}
          <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
            feedbackDone
                ? "!text-[#8CA3FF]"
                : "!text-[#CACEDA]"
          }`}>
            <span aria-hidden>
              <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.583 0.5V0V0.5ZM16.6367 0.609375L16.8638 0.16389L16.8637 0.163872L16.6367 0.609375ZM17.0742 1.0459L17.5197 0.818951L17.5197 0.818903L17.0742 1.0459ZM17.1826 2.09961H17.6826H17.1826ZM17.0742 12.1885L17.5197 12.4156L17.5197 12.4155L17.0742 12.1885ZM16.6367 12.625L16.8637 13.0705L16.8637 13.0705L16.6367 12.625ZM15.583 12.7344V13.2344V12.7344ZM3.74512 12.7344V12.2344C3.5493 12.2344 3.3715 12.3487 3.29022 12.5268L3.74512 12.7344ZM3.54395 13.0273L3.89737 13.381L3.8975 13.3809L3.54395 13.0273ZM2.20703 14.3633L1.85361 14.0096L1.85348 14.0097L2.20703 14.3633ZM0.5 2.09961H0H0.5ZM0.609375 1.0459L0.163933 0.818782L0.163872 0.818903L0.609375 1.0459ZM1.0459 0.609375L0.818903 0.163872L0.818782 0.163934L1.0459 0.609375ZM2.09961 0.5V0V0.5ZM15.583 0.5V1C15.871 1 16.0571 1.00049 16.1986 1.01213C16.3343 1.0233 16.3848 1.04217 16.4097 1.05488L16.6367 0.609375L16.8637 0.163872C16.6748 0.0675948 16.4784 0.0317804 16.2806 0.0155044C16.0887 -0.000291586 15.8549 0 15.583 0V0.5ZM16.6367 0.609375L16.4097 1.05486C16.5048 1.10335 16.5813 1.17989 16.6287 1.27289L17.0742 1.0459L17.5197 0.818903C17.3754 0.535628 17.1449 0.307156 16.8638 0.16389L16.6367 0.609375ZM17.0742 1.0459L16.6287 1.27285C16.6411 1.29725 16.6599 1.34736 16.6709 1.48335C16.6824 1.62517 16.6826 1.81124 16.6826 2.09961H17.1826H17.6826C17.6826 1.82824 17.6831 1.59438 17.6676 1.40275C17.6517 1.20528 17.6163 1.0084 17.5197 0.818951L17.0742 1.0459ZM17.1826 2.09961H16.6826V11.1338H17.1826H17.6826V2.09961H17.1826ZM17.1826 11.1338H16.6826C16.6826 11.4223 16.6824 11.6086 16.6709 11.7507C16.6599 11.887 16.6411 11.9372 16.6287 11.9615L17.0742 12.1885L17.5197 12.4155C17.6163 12.2259 17.6517 12.0287 17.6677 11.8312C17.6832 11.6394 17.6826 11.4053 17.6826 11.1338H17.1826ZM17.0742 12.1885L16.6288 11.9614C16.5813 12.0545 16.5047 12.1311 16.4097 12.1795L16.6367 12.625L16.8637 13.0705C17.1449 12.9272 17.3754 12.6986 17.5197 12.4156L17.0742 12.1885ZM16.6367 12.625L16.4098 12.1795C16.3848 12.1922 16.3343 12.2111 16.1986 12.2222C16.0571 12.2339 15.871 12.2344 15.583 12.2344V12.7344V13.2344C15.8549 13.2344 16.0887 13.2347 16.2806 13.2189C16.4784 13.2026 16.6747 13.1668 16.8637 13.0705L16.6367 12.625ZM15.583 12.7344V12.2344H3.74512V12.7344V13.2344H15.583V12.7344ZM3.74512 12.7344L3.29022 12.5268C3.26351 12.5854 3.22956 12.6346 3.19039 12.6738L3.54395 13.0273L3.8975 13.3809C4.02889 13.2495 4.1285 13.0987 4.20001 12.9419L3.74512 12.7344ZM3.54395 13.0273L3.19052 12.6737L1.85361 14.0096L2.20703 14.3633L2.56046 14.717L3.89737 13.381L3.54395 13.0273ZM2.20703 14.3633L1.85348 14.0097C1.53846 14.3247 1 14.1017 1 13.6562H0.5H0C0 14.9927 1.61567 15.6617 2.56058 14.7168L2.20703 14.3633ZM0.5 13.6562H1V2.09961H0.5H0V13.6562H0.5ZM0.5 2.09961H1C1 1.81166 1.00049 1.62556 1.01214 1.48405C1.02331 1.34833 1.04219 1.29779 1.05488 1.27289L0.609375 1.0459L0.163872 0.818903C0.0675915 1.00786 0.0317845 1.20429 0.0155096 1.40201C-0.000287831 1.59394 0 1.82777 0 2.09961H0.5ZM0.609375 1.0459L1.05482 1.27301C1.10274 1.17903 1.17903 1.10274 1.27301 1.05482L1.0459 0.609375L0.818782 0.163934C0.536827 0.307694 0.307694 0.536827 0.163934 0.818782L0.609375 1.0459ZM1.0459 0.609375L1.27289 1.05488C1.29779 1.04219 1.34833 1.02331 1.48405 1.01214C1.62556 1.00049 1.81166 1 2.09961 1V0.5V0C1.82777 0 1.59394 -0.000287831 1.40201 0.0155096C1.20429 0.0317844 1.00786 0.0675914 0.818903 0.163872L1.0459 0.609375ZM2.09961 0.5V1H15.583V0.5V0H2.09961V0.5Z" fill="currentColor"/>
              <path d="M4.84131 4.5L12.8413 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.84131 8.5L10.8413 8.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>{feedbackText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
