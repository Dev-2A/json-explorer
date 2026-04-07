/**
 * 텍스트 내에서 query와 매칭되는 부분을 하이라이트 표시
 */
export default function HightlightText({ text, query, className = "" }) {
  if (!query || !query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const str = String(text);
  const q = query.toLowerCase();
  const parts = [];
  let lastIndex = 0;

  const lowerStr = str.toLowerCase();
  let searchFrom = 0;

  while (searchFrom < lowerStr.length) {
    const matchIndex = lowerStr.indexOf(q, searchFrom);
    if (matchIndex === -1) break;

    // 매칭 전 텍스트
    if (matchIndex > lastIndex) {
      parts.push({ text: str.slice(lastIndex, matchIndex), highlight: false });
    }

    // 매칭 텍스트
    parts.push({
      text: str.slice(matchIndex, matchIndex + q.length),
      highlight: true,
    });

    lastIndex = matchIndex + q.length;
    searchFrom = lastIndex;
  }

  // 나머지 텍스트
  if (lastIndex < str.length) {
    parts.push({ text: str.slice(lastIndex), highlight: false });
  }

  if (parts.length === 0) {
    return <span className={className}>{str}</span>;
  }

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.highlight ? (
          <mark
            key={i}
            className="bg-yellow-400/30 text-yellow-200 rounded-sm px-0.5"
          >
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </span>
  );
}
