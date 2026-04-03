/**
 * JSON 값의 타입을 판별하는 유틸리티
 */

export function getValueType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value; // 'string', 'number', 'boolean', 'object'
}

export function isExpandable(value) {
  return value !== null && typeof value === "object";
}

/**
 * 값의 간단한 미리보기 문자열 생성
 */
export function getPreview(value) {
  const type = getValueType(value);

  switch (type) {
    case "object": {
      const keys = Object.keys(value);
      if (keys.length === 0) return "{}";
      if (keys.length <= 3) return `{ ${keys.join(", ")} }`;
      return `{ ${keys.slice(0, 3).join(", ")}, ... ${keys.length - 3}개 더 }`;
    }
    case "array": {
      if (value.length === 0) return "[]";
      return `[ ${value.length}개 항목 ]`;
    }
    default:
      return null;
  }
}

/**
 * 타입에 맞는 Tailwind 텍스트 색상 클래스 반환
 */
export function getTypeColorClass(type) {
  const colors = {
    string: "text-json-string",
    number: "text-json-number",
    boolean: "text-json-boolean",
    null: "text-json-null",
    object: "text-json-bracket",
    array: "text-json-bracket",
  };
  return colors[type] || "text-slate-400";
}
