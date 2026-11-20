import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const typeClass = toast.type ? `toast-${toast.type}` : 'toast-info';

  return (
    <div className={`toast-container ${typeClass}`} role="status" aria-live="polite">
      <span className="toast-icon">{toast.icon || '✨'}</span>
      <span className="toast-message">{toast.message}</span>
      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}
