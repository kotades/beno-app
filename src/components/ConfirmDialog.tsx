'use client';

import { useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm overflow-y-auto pt-24 pb-8 px-4 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative space-y-5 my-auto max-h-[calc(100vh-7rem)] overflow-y-auto">
        <div className="flex items-start space-x-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${
              danger ? 'bg-red-50 text-red-600' : 'bg-cyan-50 text-[#008B9B]'
            }`}
          >
            {danger ? '🗑️' : 'ℹ️'}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-bold text-xs transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`w-1/2 py-3 rounded-2xl font-bold text-xs transition-all shadow-md active:scale-95 ${
              danger
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-[#008B9B] hover:bg-[#007684] text-white'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}