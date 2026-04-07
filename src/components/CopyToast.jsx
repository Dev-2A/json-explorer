import { useEffect } from "react";

export default function CopyToast({ message, visible, onHide }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onHide, 1500);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                    px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-mono
                    shadow-lg shadow-blue-900/50
                    animate-fade-in"
    >
      {message}
    </div>
  );
}
