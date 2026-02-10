import { useState, useRef } from "react";

// 이미지 확장자 체크
function isImage(url) {
  if (!url) return false;
  return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url);
}

// 썸네일 표시 개수 (+ 버튼 제외)
const MAX_THUMBS = 4;

function ImageGallery({
  files,
  fileKey = "fileUrl",
  nameKey = "fileName",
  onAddClick,
  uploading,
  editMode = false,
  onRemoveFile,
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const imageFiles = files.filter((f) => isImage(f[fileKey]));
  const nonImageFiles = files.filter((f) => !isImage(f[fileKey]));

  const visibleThumbs = imageFiles.slice(0, MAX_THUMBS);
  const extraCount = imageFiles.length - MAX_THUMBS;

  const handlePrev = () => {
    setSelectedIdx((prev) => (prev > 0 ? prev - 1 : imageFiles.length - 1));
  };

  const handleNext = () => {
    setSelectedIdx((prev) => (prev < imageFiles.length - 1 ? prev + 1 : 0));
  };

  // 파일의 원래 인덱스 찾기 (전체 files 배열 기준)
  const getOriginalIndex = (file) => files.indexOf(file);

  return (
    <div>
      {/* 썸네일 그리드 */}
      <div className="mt-3 flex flex-wrap gap-2">
        {/* + 추가 버튼 (썸네일과 같은 크기) */}
        {onAddClick && (
          <button
            onClick={onAddClick}
            disabled={uploading}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
          >
            {uploading ? (
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            )}
          </button>
        )}

        {/* 이미지 썸네일 */}
        {visibleThumbs.map((file, idx) => (
          <div key={idx} className="relative">
            <button
              onClick={() => setSelectedIdx(idx)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                selectedIdx === idx
                  ? "border-[#6D87ED]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={file[fileKey]}
                alt={file[nameKey] || "파일"}
                className="h-full w-full object-cover"
              />
              {/* 마지막 썸네일에 +N 오버레이 */}
              {idx === MAX_THUMBS - 1 && extraCount > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#6D87ED]/60 text-sm font-bold text-white">
                  +{extraCount}
                </div>
              )}
            </button>
            {/* 편집 모드: X 삭제 버튼 */}
            {editMode && onRemoveFile && (
              <button
                onClick={() => onRemoveFile(getOriginalIndex(file))}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-700 shadow-sm hover:bg-gray-300 transition z-10"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        ))}

        {/* 이미지가 아닌 파일은 아이콘 썸네일 */}
        {nonImageFiles.map((file, idx) => (
          <div key={`non-img-${idx}`} className="relative">
            <a
              href={file[fileKey]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-2 border-gray-200 bg-gray-50 hover:border-gray-300 transition"
              title={file[nameKey] || "파일"}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </a>
            {/* 편집 모드: X 삭제 버튼 */}
            {editMode && onRemoveFile && (
              <button
                onClick={() => onRemoveFile(getOriginalIndex(file))}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-700 shadow-sm hover:bg-gray-300 transition z-10"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 이미지 프리뷰 */}
      {imageFiles.length > 0 && (
        <div className="relative mt-3 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          <img
            src={imageFiles[selectedIdx]?.[fileKey]}
            alt={imageFiles[selectedIdx]?.[nameKey] || "미리보기"}
            className="w-full object-contain"
            style={{ maxHeight: "480px" }}
          />
          {imageFiles.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function LearningContent({
  worksheets = [],
  submissions = [],
  onSubmitFiles,
  onUpdateFiles,
  uploading = false,
}) {
  const [activeTab, setActiveTab] = useState("학습 내용 공유");
  const tabs = ["학습 내용 공유", "학습지"];
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  // 편집 모드 상태
  const [editMode, setEditMode] = useState(false);
  const [editFiles, setEditFiles] = useState([]); // 편집 중인 파일 목록 (기존 + 신규)
  const [newFiles, setNewFiles] = useState([]); // 새로 추가할 File 객체들

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (onSubmitFiles) {
      await onSubmitFiles(files);
    }
    e.target.value = "";
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  // 편집 모드 진입
  const enterEditMode = () => {
    setEditFiles(
      submissions.map((file) => ({
        fileId: file.fileId,
        fileUrl: file.fileUrl,
        fileName: file.fileName || "제출 파일",
        isNew: false,
      }))
    );
    setNewFiles([]);
    setEditMode(true);
  };

  // 편집 모드 취소
  const cancelEditMode = () => {
    setEditMode(false);
    setEditFiles([]);
    setNewFiles([]);
  };

  // 편집 모드에서 파일 삭제
  const handleRemoveEditFile = (idx) => {
    const removed = editFiles[idx];
    setEditFiles((prev) => prev.filter((_, i) => i !== idx));
    // 새로 추가한 파일이면 newFiles에서도 제거
    if (removed.isNew) {
      setNewFiles((prev) => prev.filter((f) => f.name !== removed.fileName));
    }
  };

  // 편집 모드에서 새 파일 추가
  const handleEditFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newEntries = files.map((f) => ({
      fileId: null,
      fileUrl: URL.createObjectURL(f),
      fileName: f.name,
      isNew: true,
    }));

    setEditFiles((prev) => [...prev, ...newEntries]);
    setNewFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const triggerEditFileInput = () => editFileInputRef.current?.click();

  // 편집 저장
  const handleSaveEdit = async () => {
    if (!onUpdateFiles) return;

    const keepFileIds = editFiles
      .filter((f) => !f.isNew && f.fileId)
      .map((f) => f.fileId);

    await onUpdateFiles(keepFileIds, newFiles);
    setEditMode(false);
    setEditFiles([]);
    setNewFiles([]);
  };

  // submissions → gallery용 파일 배열 변환
  const submissionFiles = submissions.map((file) => ({
    fileUrl: file.fileUrl,
    fileName: file.fileName || "제출 파일",
  }));

  // worksheets → gallery용 파일 배열 변환
  const worksheetFiles = worksheets.map((file) => ({
    fileUrl: file.fileUrl,
    fileName: file.title || "학습지",
  }));

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900">학습 내용</h2>

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
        {/* 탭 */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg px-6 py-2.5 text-sm font-semibold transition ${
                activeTab === tab
                  ? "!bg-[#6D87ED] text-white"
                  : "!bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 학습 내용 공유 탭 */}
        {activeTab === "학습 내용 공유" && (
          <>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">첨부파일</span>
              {/* 제출물이 있을 때만 수정 버튼 표시 */}
              {onUpdateFiles && submissions.length > 0 && !editMode && (
                <button
                  onClick={enterEditMode}
                  disabled={uploading}
                  className="text-gray-400 hover:text-[#6D87ED] transition-colors disabled:opacity-50"
                  title="첨부파일 수정"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              )}
            </div>

            {/* 편집 모드 */}
            {editMode ? (
              <>
                <input
                  ref={editFileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleEditFileSelect}
                />

                <ImageGallery
                  files={editFiles}
                  fileKey="fileUrl"
                  nameKey="fileName"
                  onAddClick={triggerEditFileInput}
                  uploading={uploading}
                  editMode={true}
                  onRemoveFile={handleRemoveEditFile}
                />

                {editFiles.length === 0 && (
                  <div className="mt-3 flex h-20 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
                    파일을 추가해주세요
                  </div>
                )}

                {/* 저장 / 취소 버튼 */}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={cancelEditMode}
                    disabled={uploading}
                    className="rounded-lg !bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 transition disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={uploading}
                    className="rounded-lg !bg-[#6D87ED] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5a74d4] transition disabled:opacity-50"
                  >
                    {uploading ? "저장 중..." : "저장"}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* 일반 모드 */}
                {onSubmitFiles && (
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                )}

                <ImageGallery
                  files={submissionFiles}
                  fileKey="fileUrl"
                  nameKey="fileName"
                  onAddClick={onSubmitFiles ? triggerFileInput : undefined}
                  uploading={uploading}
                />

                {submissionFiles.length === 0 && !onSubmitFiles && (
                  <div className="mt-3 flex h-20 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
                    제출된 학습 내용이 없습니다
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* 학습지 탭 */}
        {activeTab === "학습지" && (
          <>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">첨부파일</span>
            </div>

            {worksheetFiles.length > 0 ? (
              <ImageGallery files={worksheetFiles} fileKey="fileUrl" nameKey="fileName" />
            ) : (
              <div className="mt-3 flex h-20 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
                등록된 학습지가 없습니다
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
