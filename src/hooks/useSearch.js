import { useState, useCallback, useRef } from "react";
import { isExpandable } from "../utils/typeUtils";

/**
 * JSON 트리 내 실시간 검색 훅
 * 키와 값 모두 검색하며, 매칭 경로 + 자동 펼침 경로를 반환
 */
export function useSearch(data) {
  const [query, setQuery] = useState("");
  const [matchPaths, setMatchPaths] = useState(new Set());
  const [autoExpandPaths, setAutoExpandPaths] = useState(new Set());
  const [matchCount, setMatchCount] = useState(0);
  const debounceRef = useRef(null);

  const performSearch = useCallback((searchQuery, searchData) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (!searchQuery || !searchQuery.trim() || !searchData) {
        setMatchPaths(new Set());
        setAutoExpandPaths(new Set());
        setMatchCount(0);
        return;
      }

      const q = searchQuery.toLowerCase().trim();
      const matches = new Set();
      const expands = new Set();

      const walk = (value, path, parentPaths) => {
        // 현재 키 이름 검사 (path에서 마지막 세그먼트 추출)
        const lastSegment = extractLastSegment(path);
        if (
          lastSegment !== null &&
          String(lastSegment).toLowerCase().includes(q)
        ) {
          matches.add(path);
          parentPaths.forEach((p) => expands.add(p));
        }

        // 값이 기본 타입이면 값 검사
        if (!isExpandable(value)) {
          const strValue = String(value).toLowerCase();
          if (strValue.includes(q)) {
            matches.add(path);
            parentPaths.forEach((p) => expands.add(p));
          }
          return;
        }

        // 재귀 탐색
        const nextParents = [...parentPaths, path];
        if (Array.isArray(value)) {
          value.forEach((item, i) => {
            walk(item, `${path}[${i}]`, nextParents);
          });
        } else if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([k, v]) => {
            walk(v, `${path}.${k}`, nextParents);
          });
        }
      };

      walk(searchData, "$", []);
      setMatchPaths(matches);
      setAutoExpandPaths(expands);
      setMatchCount(matches.size);
    }, 200);
  }, []);

  const updateQuery = useCallback(
    (newQuery, searchData) => {
      setQuery(newQuery);
      performSearch(newQuery, searchData);
    },
    [performSearch],
  );

  return { query, updateQuery, matchPaths, autoExpandPaths, matchCount };
}

/**
 * path 문자열에서 마지막 키/인덱스를 추출
 * $.foo.bar → "bar"
 * $.tags[0] → "0"
 */
function extractLastSegment(path) {
  if (!path || path === "$") return null;

  const bracketMatch = path.match(/\[(\d+)\]$/);
  if (bracketMatch) return bracketMatch[1];

  const doMatch = path.match(/\.([^.[]+)$/);
  if (doMatch) return doMatch[1];

  return null;
}
