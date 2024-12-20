import { useEffect } from 'react';

function Notification({ message, type = 'error', onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const baseStyles = "fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md animate-slide-in";
  const typeStyles = {
    error: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-400",
    success: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-400"
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]}`}>
      <div className="flex items-center gap-2">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-auto text-sm hover:opacity-75"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default Notification; 