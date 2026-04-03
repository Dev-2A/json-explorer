import { useState } from "react";

/**
 * 트리 내 실시간 검색 훅
 */
export function useSearch() {
  const [query, setQuery] = useState("");
  const [matchPaths, setMatchPaths] = useState(new Set());

  //TODO - Step 8에서 구현

  return { query, setQuery, matchPaths };
}
