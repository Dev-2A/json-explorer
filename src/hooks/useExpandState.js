import { useState, useCallback, useMemo } from "react";
import { isExpandable } from "../utils/typeUtils";

export function useExpandState(data) {
  const [expandMap, setExpandMap] = useState({});
  const [lastData, setLastData] = useState(null);

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

  // 검색 시 자동 펼침 경로 적용
  const applyAutoExpand = useCallback((autoExpandPaths) => {
    if (!autoExpandPaths || autoExpandPaths.size === 0) return;

    setExpandMap((prev) => {
      const next = { ...prev };
      autoExpandPaths.forEach((path) => {
        if (path in next) next[path] = true;
      });
      return next;
    });
  }, []);

  const isExpanded = useCallback(
    (path) => {
      return expandMap[path] ?? false;
    },
    [expandMap],
  );

  return {
    isExpanded,
    toggle,
    expandAll,
    collapseAll,
    expandToDepth,
    applyAutoExpand,
  };
}
