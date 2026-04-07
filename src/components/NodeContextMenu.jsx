import { useEffect, useRef } from "react";

export default function NodeContextMenu({ x, y, value, path, onCopy, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const handleCopyValue = () => {
    const text = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
    navigator.clipboard.writeText(text);
    onCopy(`값 복사됨`);
    onClose();
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText(path);
    onCopy(`경로 복사됨: ${path}`);
    onClose();
  };

  const handleCopyMinified = () => {
    const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
    navigator.clipboard.writeText(text);
    onCopy(`압축된 값 복사됨`);
    onClose();
  };

  return (
    <div
      ref={ref}
      className="fixed z-50 min-w-36 py-1 rounded-lg border border-slate-700
                 bg-slate-800 shadow-xl shadow-black/50"
      style={{ left: x, top: y }}
    >
      <MenuItem label="📋 값 복사" onClick={handleCopyValue} />
      {typeof value === 'object' && value !== null && (
        <MenuItem label="📦 압축 복사" onClick={handleCopyMinified} />
      )}
      <MenuItem label="📍 경로 복사" onClick={handleCopyPath} />
    </div>
  );
}

function MenuItem({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-1.5 text-xs text-slate-300
                 hover:bg-slate-700 transition-colors cursor-pointer"
    >
      {label}
    </button>
  );
}