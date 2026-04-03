export default function ErrorBanner({ error }) {
  if (!error) return null;

  return (
    <div
      className="mx-4 mt-2 px-4 py-3 rounded-lg bg-red-950/60 border border-red-800/50
                    text-xs font-mono leading-relaxed"
    >
      {/* 메인 메시지 */}
      <div className="flex items-start gap-2">
        <span className="text-red-400 shrink-0">⚠️</span>
        <div className="min-w-0">
          <span className="text-red-300">{error.message}</span>

          {/* 줄:열 위치 */}
          {error.lineCol && (
            <span className="ml-2 text-red-500/80">
              (줄 {error.lineCol.line}, 열 {error.lineCol.col})
            </span>
          )}
        </div>
      </div>

      {/* 에러 위치 코드 스니펫 */}
      {error.snippet && (
        <div className="mt-2 px-3 py-1.5 rounded bg-red-950/80 text-red-400/80 overflow-x-auto whitespace-nowrap">
          <span className="text-red-400/50">{error.snippet.before}</span>
          <span className="text-red-300 bg-red-500/30 px-0.5 rounded-sm font-bold">
            {error.snippet.char || "⏎"}
          </span>
          <span className="text-red-400/50">{error.snippet.after}</span>
        </div>
      )}
    </div>
  );
}
