import React, { useEffect } from 'react';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title = 'Reset Editor Workspace?',
  message = 'Are you sure you want to discard your current solution and reset the editor back to the problem starter template? This action cannot be undone.',
  confirmText = 'Reset Template',
  cancelText = 'Keep Editing',
  confirmVariant = 'danger',
  icon: Icon = RotateCcw,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        className="glass-card max-w-md w-full p-6 space-y-5 bg-slate-900 border border-white/15 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl shrink-0 ${
              confirmVariant === 'danger'
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                : 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-400'
            }`}
          >
            <Icon size={22} />
          </div>

          <div className="space-y-1.5 pr-4">
            <h3 className="text-base font-bold font-heading text-white">
              {title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
          <button
            type="button"
            className="btn-secondary-tw text-xs py-2 px-4"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={`btn-base text-xs py-2 px-4 shadow-lg ${
              confirmVariant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
