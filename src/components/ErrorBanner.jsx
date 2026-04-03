export default function ErrorBanner({ error }) {
  if (!error) return null;

  return (
    <div
      className="mx-4 mt-2 px-4 py-2.5 rounded-lg bg-red-950/60 border border-red-800/50
                    text-red-300 text-xs font-mono leading-relaxed"
    >
      <span className="font-semibold text-red-400">⚠️ JSON 구문 오류: </span>
      {error.message}
      {error.position !== undefined && (
        <span className="ml-2 text-red-500">(위치: {error.position})</span>
      )}
    </div>
  );
}
