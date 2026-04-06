import { useState, useCallback, useMemo } from "react";
import { isExpandable } from "../utils/typeUtils";

/**
 * 트리 전체의 펼침/접기 상태를 관리하는 훅
 */
export function useExpandState(data) {
  const [expandMap, setExpandMap] = useState({});
  const [lastData, setLastData] = useState(null);

  // 데이터가 바뀌면 기본 상태 생성 (깊이 2까지 자동 펼침)
  useMemo(() => {
    if (data === lastData) return;
    setLastData(data);

    if (!data) {
      setExpandMap({});
      return;
    }

    const map = {};
    const walk = (value, path, depth) => {
      if (!isExpandable(value)) return;
      map[path] = depth < 2;

      if (Array.isArray(value)) {
        value.forEach((item, i) => walk(item, `${path}[${i}]`, depth + 1));
      } else if (typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([k, v]) =>
          walk(v, `${path}.${k}`, depth + 1),
        );
      }
    };

    walk(data, "$", 0);
    setExpandMap(map);
  }, [data]);

  const toggle = useCallback((path) => {
    setExpandMap((prev) => ({ ...prev, [path]: !prev[path] }));
  }, []);

  const expandAll = useCallback(() => {
    setExpandMap((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        next[key] = true;
      });
      return next;
    });
  }, []);

  const collapseAll = useCallback(() => {
    setExpandMap((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        next[key] = false;
      });
      return next;
    });
  }, []);

  const expandToDepth = useCallback(
    (targetDepth) => {
      if (!data) return;

      const next = {};
      const walk = (value, path, depth) => {
        if (!isExpandable(value)) return;
        next[path] = depth < targetDepth;

        if (Array.isArray(value)) {
          value.forEach((item, i) => walk(item, `${path}[${i}]`, depth + 1));
        } else if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([k, v]) =>
            walk(v, `${path}.${k}`, depth + 1),
          );
        }
      };

      walk(data, "$", 0);
      setExpandMap(next);
    },
    [data],
  );

  const isExpanded = useCallback(
    (path) => {
      return expandMap[path] ?? false;
    },
    [expandMap],
  );

  return { isExpanded, toggle, expandAll, collapseAll, expandToDepth };
}
