import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface Member {
  name: string;
  title: string;
  image: string;
  description?: string;
}

interface MemberModalProps {
  open: boolean;
  onClose: () => void;
  member: Member;
}

const MemberModal: React.FC<MemberModalProps> = ({ open, onClose, member }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="member-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] opacity-100 transition-opacity" />

      <div
        ref={dialogRef}
        className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transform transition-all scale-100 opacity-100"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-3 top-3 rounded-full px-2 text-xl leading-none text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          ✕
        </button>

        <div className="flex flex-col items-center text-center">
          <img
            src={member.image}
            alt={member.name}
            className="w-24 h-24 rounded-full border-4 border-green-600 shadow-md"
          />
          <h2 id="member-modal-title" className="mt-4 text-xl font-bold text-gray-900">
            {member.name}
          </h2>
          <p className="text-green-700 font-medium">{member.title}</p>

          <p className="mt-3 text-gray-600 text-sm leading-relaxed">
            {member.description || "Thông tin chi tiết về thành viên này sẽ được hiển thị ở đây."}
          </p>

          {/* Ví dụ thêm các dòng info (nếu muốn) */}
          <ul className="mt-4 space-y-1 text-sm text-gray-600">
            <li>• Kinh nghiệm: ...</li>
            <li>• Thế mạnh:...</li>
          </ul>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MemberModal;
