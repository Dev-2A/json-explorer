/**
 * JSON 파싱 + 상세 에러 분석 유틸리티
 */

/**
 * position(문자 인덱스)으로부터 줄 번호, 열 번호를 계산
 */
function getLineCol(text, position) {
  if (position === undefined || position === null) return null;

  const lines = text.slice(0, position).split("\n");
  return {
    line: lines.length,
    col: lines[lines.length - 1].length + 1,
  };
}

/**
 * 네이티브 에러 메시지를 한국어로 변환
 */
function translateError(message) {
  const patterns = [
    [
      /Unterminated string/i,
      () => "문자열이 닫히지 않았습니다 (닫는 따옴표 확인)",
    ],
    [
      /Unexpected string/i,
      () => "예상하지 못한 위치에 문자열이 있습니다 (쉼표 누락?)",
    ],
    [/Unexpected token (.+?) in JSON/i, (m) => `예상하지 못한 토큰: ${m[1]}`],
    [
      /Unexpected end of JSON input/i,
      () => "입력이 불완전합니다 (닫는 괄호/따옴표 확인)",
    ],
    [
      /Unexpected non-whitespace .* after JSON/i,
      () => "JSON 끝 이후에 불필요한 문자가 있습니다",
    ],
    [
      /Expected property name or '\}'/i,
      () => "속성 이름 또는 '}'가 필요합니다",
    ],
    [/Expected ',' or '\}'/i, () => "쉼표(,) 또는 닫는 중괄호(})가 필요합니다"],
    [/Expected ',' or '\]'/i, () => "쉼표(,) 또는 닫는 대괄호(])가 필요합니다"],
    [
      /Expected double-quoted property name/i,
      () => '속성 이름은 큰따옴표("")로 감싸야 합니다',
    ],
    [
      /Bad control character/i,
      () => "허용되지 않는 제어 문자가 포함되어 있습니다",
    ],
    [/Bad escaped character/i, () => "잘못된 이스케이프 문자가 있습니다"],
  ];

  for (const [regex, replacer] of patterns) {
    const match = message.match(regex);
    if (match) return replacer(match);
  }

  return message;
}

/**
 * 에러 위치 주변의 코드 스니펫을 추출
 */
function getErrorSnippet(text, position) {
  if (position === undefined || position === null) return null;

  const start = Math.max(0, position - 20);
  const end = Math.min(text.length, position + 20);

  const before = text.slice(start, position);
  const char = text[position] || "";
  const after = text.slice(position + 1, end);

  return { before, char, after };
}

/**
 * JSON 파싱 시도 - 성공 시 data, 실패 시 상세 error 반환
 */
export function parseJson(text) {
  if (!text || !text.trim()) {
    return { data: null, error: null };
  }

  try {
    const data = JSON.parse(text);
    return { data, error: null };
  } catch (e) {
    // position 추출 (브라우저마다 포맷 다름)
    const posMatch =
      e.message.match(/position\s+(\d+)/i) ||
      e.message.match(/at line (\d+) column (\d+)/i);

    let position = null;
    let lineCol = null;

    if (posMatch && posMatch[2]) {
      // "at line X column Y" 형태
      lineCol = {
        line: parseInt(posMatch[1], 10),
        col: parseInt(posMatch[2], 10),
      };
      // position 역산
      const lines = text.split("\n");
      let pos = 0;
      for (let i = 0; i < lineCol.line - 1 && i < lines.length; i++) {
        pos += lines[i].length + 1;
      }
      pos += lineCol.col - 1;
      position = pos;
    } else if (posMatch) {
      position = parseInt(posMatch[1], 10);
      lineCol = getLineCol(text, position);
    }

    return {
      data: null,
      error: {
        raw: e.message,
        message: translateError(e.message),
        position,
        lineCol,
        snippet: getErrorSnippet(text, position),
      },
    };
  }
}
