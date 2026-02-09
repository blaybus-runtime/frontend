import { useState } from "react";

const EXAM_TYPES = ["수시", "정시", "논술"];

export default function AddMenteeModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    school: "",
    grade: "",
    email: "",
    examTypes: [],
  });

  if (!isOpen) return null;

  const hasInput = form.name || form.phone || form.school || form.grade || form.email || form.examTypes.length > 0;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleExamType = (type) => {
    setForm((prev) => ({
      ...prev,
      examTypes: prev.examTypes.includes(type)
        ? prev.examTypes.filter((t) => t !== type)
        : [...prev.examTypes, type],
    }));
  };

  const handleSave = () => {
    onSave(form);
    setForm({ name: "", phone: "", school: "", grade: "", email: "", examTypes: [] });
  };

  const handleCancel = () => {
    setForm({ name: "", phone: "", school: "", grade: "", email: "", examTypes: [] });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/40" onClick={handleCancel} />

      {/* 모달 */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* 상단: 아바타 + 이름 */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src="/Avator_icon.png"
            alt="멘토 아바타"
            className="h-14 w-14 rounded-full"
          />
          <div className="w-32">
            <label className="text-xs text-gray-500">멘티 이름</label>
            <input
              type="text"
              placeholder="이름"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#6D87ED] focus:ring-1 focus:ring-[#6D87ED]"
            />
          </div>
        </div>

        {/* 전화번호 / 고등학교 / 학년 */}
        <div className="grid grid-cols-[1fr_1fr_auto] gap-3 mb-4">
          <div>
            <label className="text-xs text-gray-500">전화번호</label>
            <input
              type="text"
              placeholder="010-0000-0000"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#6D87ED] focus:ring-1 focus:ring-[#6D87ED]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">고등학교</label>
            <input
              type="text"
              placeholder="OO고등학교"
              value={form.school}
              onChange={(e) => handleChange("school", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#6D87ED] focus:ring-1 focus:ring-[#6D87ED]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">학년</label>
            <div className="mt-1 flex items-center gap-1">
              <input
                type="text"
                placeholder="1"
                value={form.grade}
                onChange={(e) => handleChange("grade", e.target.value)}
                className="w-10 rounded-lg border border-gray-200 px-2 py-2 text-sm text-center outline-none focus:border-[#6D87ED] focus:ring-1 focus:ring-[#6D87ED]"
              />
              <span className="text-sm text-gray-500">학년</span>
            </div>
          </div>
        </div>

        {/* 이메일 / 입시전형 */}
        <div className="grid grid-cols-[1fr_auto] gap-3 mb-6">
          <div>
            <label className="text-xs text-gray-500">이메일</label>
            <input
              type="email"
              placeholder="이메일을 입력해주세요"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#6D87ED] focus:ring-1 focus:ring-[#6D87ED]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">입시전형</label>
            <div className="mt-1 flex gap-1">
              {EXAM_TYPES.map((type) => {
                const isSelected = form.examTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleExamType(type)}
                    className="rounded-lg border px-3 py-2 text-sm transition-colors"
                    style={
                      isSelected
                        ? { backgroundColor: "#E8EDFC", color: "#4A63C8", borderColor: "#6D87ED" }
                        : { backgroundColor: "#F3F4F6", color: "#6B7280", borderColor: "#F3F4F6" }
                    }
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!hasInput}
            className={`flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-colors ${
              hasInput ? "opacity-100" : "opacity-50"
            }`}
            style={{ backgroundColor: "#6D87ED" }}
          >
            멘티 저장
          </button>
        </div>
      </div>
    </div>
  );
}
