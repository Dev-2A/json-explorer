/**
 * JSON 데이터의 구조적 통계를 분석
 */
export function analyzeJson(data) {
  if (data === null || data === undefined) {
    return null;
  }

  const stats = {
    totalNodes: 0,
    maxDepth: 0,
    types: {
      string: 0,
      number: 0,
      boolean: 0,
      null: 0,
      object: 0,
      array: 0,
    },
    totalKeys: 0,
    totalArrayItems: 0,
    longestString: { value: "", path: "" },
    largestNumber: { value: -Infinity, path: "" },
    emptyArrays: 0,
    emptyObjects: 0,
  };

  function walk(value, path, depth) {
    stats.totalNodes++;
    if (depth > stats.maxDepth) stats.maxDepth = depth;

    if (value === null) {
      stats.types.null++;
      return;
    }

    const type = typeof value;

    if (Array.isArray(value)) {
      stats.types.array++;
      stats.totalArrayItems += value.length;
      if (value.length === 0) stats.emptyArrays++;

      value.forEach((item, i) => {
        walk(item, `${path}[${i}]`, depth + 1);
      });
      return;
    }

    if (type === "object") {
      const keys = Object.keys(value);
      stats.types.object++;
      stats.totalKeys += keys.length;
      if (keys.length === 0) stats.emptyObjects++;

      keys.forEach((k) => {
        walk(value[k], `${path}.${k}`, depth + 1);
      });
      return;
    }

    if (type === "string") {
      stats.types.string++;
      if (value.length > stats.longestString.value.length) {
        stats.longestString = { value, path };
      }
      return;
    }

    if (type === "number") {
      stats.types.number++;
      if (value > stats.largestNumber.value) {
        stats.largestNumber = { value, path };
      }
      return;
    }

    if (type === "boolean") {
      stats.types.boolean++;
    }
  }

  walk(data, "$", 0);

  // Infinity가 남아있으면 숫자가 없는 것
  if (stats.largestNumber.value === -Infinity) {
    stats.largestNumber = null;
  }
  if (stats.longestString.value === "") {
    stats.longestString = null;
  }

  return stats;
}

/**
 * 바이트 크기를 읽기 좋은 포맷으로 변환
 */
export function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0);
  return `${size} ${units[i]}`;
}
