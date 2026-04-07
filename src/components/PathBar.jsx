import { toBracketNotation } from "../utils/jsonPath";

export default function PathBar({ path, onCopy }) {
  if (!path) return null;

  const displayPath = path;
  const bracketPath = toBracketNotation(path);

  const handleCopyDot = () => {
    navigator.clipboard.writeText(displayPath);
    onCopy(`복사됨: ${displayPath}`);
  };

  const handleCopyBracket = () => {
    navigator.clipboard.writeText(bracketPath);
    onCopy(`복사됨: ${bracketPath}`);
  };

  return (
    <div
      className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg
                    bg-slate-800/60 border border-slate-700/50
                    text-xs font-mono overflow-x-auto whitespace-nowrap custom-scrollbar"
    >
      {/* 경로 아이콘 */}
      <span className="text-slate-500 shrink-0">📍</span>

      {/* 경로 텍스트 */}
      <span className="text-slate-300 flex-1 min-w-0 truncate">
        {displayPath}
      </span>

      {/* 복사 버튼 — dot notation */}
      <button
        onClick={handleCopyDot}
        title="Dot notation 복사"
        className="shrink-0 px-2 py-0.5 rounded text-[10px] bg-slate-700
                   text-slate-400 hover:bg-slate-600 hover:text-slate-200
                   transition-colors cursor-pointer"
      >
        dot
      </button>

      {/* 복사 버튼 — bracket notation */}
      <button
        onClick={handleCopyBracket}
        title="Bracket notation 복사"
        className="shrink-0 px-2 py-0.5 rounded text-[10px] bg-slate-700
                   text-slate-400 hover:bg-slate-600 hover:text-slate-200
                   transition-colors cursor-pointer"
      >
        [ ]
      </button>
    </div>
  );
}
