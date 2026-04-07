/**
 * 내부 path 문자열을 사람이 읽기 좋은 JSONPath 표기로 변환
 *
 * 내부 형태: $.settings.theme  /  $.tags[0]
 * 출력 형태: $.settings.theme  /  $.tags[0]  (동일하지만 특수문자 키는 bracket 표기)
 */
export function toDisplayPath(internalPath) {
  return internalPath;
}

/**
 * 내부 path 문자열을 bracket notation으로 변환
 * 예: $.store.book[0].author → $['store']['book'][0]['author']
 */
export function toBracketNotation(internalPath) {
  if (!internalPath || internalPath === "$") return "$";

  const tokens = tokenize(internalPath);
  return (
    "$" +
    tokens
      .map((t) => {
        if (t.type === "index") return `[${t.value}]`;
        return `['${t.value}']`;
      })
      .join("")
  );
}

/**
 * path를 토큰으로 분리
 */
function tokenize(path) {
  const tokens = [];
  // $ 이후부터 파싱
  const rest = path.startsWith("$") ? path.slice(1) : path;

  const regex = /\.([^.[]+)|\[(\d+)\]/g;
  let match;
  while ((match = regex.exec(rest)) !== null) {
    if (match[1] !== undefined) {
      tokens.push({ type: "key", value: match[1] });
    } else if (match[2] !== undefined) {
      tokens.push({ type: "index", value: parseInt(match[2], 10) });
    }
  }
  return tokens;
}

/**
 * path로부터 값을 추출
 */
export function getValueByPath(data, path) {
  if (!data || !path || path === "$") return data;

  const tokens = tokenize(path);
  let current = data;

  for (const token of tokens) {
    if (current === null || current === undefined) return undefined;
    if (token.type === "index") {
      current = current[token.value];
    } else {
      current = current[token.value];
    }
  }
  return current;
}
