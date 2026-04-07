import { useState, useCallback } from "react";

export default function DropZone({ onLoad, children }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length === 0) return;

      const file = files[0];

      // 파일 크기 제한 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        onLoad(null, "파일 크기가 10MB를 초과합니다");
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        onLoad(evt.target.result, null, file.name);
      };
      reader.onerror = () => {
        onLoad(null, "파일을 읽을 수 없습니다");
      };
      reader.readAsText(file);
    },
    [onLoad],
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative h-full transition-colors duration-150
                  ${isDragging ? "ring-2 ring-blue-400 ring-inset rounded-lg" : ""}`}
    >
      {children}

      {/* 드래그 오버레이 */}
      {isDragging && (
        <div
          className="absolute inset-0 bg-blue-900/30 backdrop-blur-sm rounded-lg
                        flex items-center justify-center z-10 pointer-events-none"
        >
          <div className="text-center">
            <p className="text-blue-300 text-2xl mb-2">📂</p>
            <p className="text-blue-300 text-sm font-semibold">
              JSON 파일을 놓으세요
            </p>
            <p className="text-blue-400/60 text-xs mt-1">
              .json, .txt (최대 10MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
