import { useState, useCallback, useEffect, useRef } from "react";
import TreeNode from "./TreeNode";
import PathBar from "./PathBar";
import SearchBar from "./SearchBar";
import StatsPanel from "./StatsPanel";
import { useExpandState } from "../hooks/useExpandState";
import { useSearch } from "../hooks/useSearch";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

export default function TreeView({ data, rawText, onToast }) {
  const {
    isExpanded,
    toggle,
    expandAll,
    collapseAll,
    expandToDepth,
    applyAutoExpand,
  } = useExpandState(data);
  const { query, updateQuery, matchPaths, autoExpandPaths, matchCount } =
    useSearch(data);
  const [selectedPath, setSelectedPath] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const searchRef = useRef(null);

  // 키보드 단축키
  useKeyboardShortcuts({
    expandAll,
    collapseAll,
    focusSearch: () => searchRef.current?.focus(),
  });

  useEffect(() => {
    if (autoExpandPaths.size > 0) {
      applyAutoExpand(autoExpandPaths);
    }
  }, [autoExpandPaths, applyAutoExpand]);

  const handleSearchChange = useCallback(
    (newQuery) => {
      updateQuery(newQuery, data);
    },
    [updateQuery, data],
  );

  const handleSelectPath = useCallback((path) => {
    setSelectedPath(path);
  }, []);

  const handleCopy = useCallback(
    (message) => {
      onToast?.(message);
    },
    [onToast],
  );

  if (data === null || data === undefined) return null;

  return (
    <div className="flex flex-col h-full">
      {/* 검색 바 */}
      <SearchBar
        ref={searchRef}
        query={query}
        onChange={handleSearchChange}
        matchCount={matchCount}
      />

      {/* 툴바 */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-sm font-semibold text-slate-400 mr-auto">
          🌳 Tree View
        </span>

        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-600 mr-1">깊이:</span>
          {[1, 2, 3, 4].map((d) => (
            <button
              key={d}
              onClick={() => expandToDepth(d)}
              className="w-5 h-5 text-[10px] rounded bg-slate-800 text-slate-400
                         hover:bg-slate-700 hover:text-slate-200 transition-colors cursor-pointer"
            >
              {d}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-slate-700" />

        <button
          onClick={expandAll}
          title="전체 펼치기 (Ctrl+Shift+E)"
          className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300
                     hover:bg-slate-700 transition-colors cursor-pointer"
        >
          전체 펼치기
        </button>
        <button
          onClick={collapseAll}
          title="전체 접기 (Ctrl+Shift+W)"
          className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300
                     hover:bg-slate-700 transition-colors cursor-pointer"
        >
          전체 접기
        </button>

        <div className="w-px h-4 bg-slate-700" />

        <button
          onClick={() => setShowStats((prev) => !prev)}
          title="통계 패널 토글"
          className={`px-2 py-1 text-xs rounded transition-colors cursor-pointer
                     ${
                       showStats
                         ? "bg-blue-600 text-white"
                         : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                     }`}
        >
          📊
        </button>
      </div>

      {/* 통계 패널 */}
      {showStats && (
        <div className="mb-3">
          <StatsPanel data={data} rawText={rawText} />
        </div>
      )}

      {/* JSONPath 바 */}
      <PathBar path={selectedPath} onCopy={handleCopy} />

      {/* 트리 렌더링 영역 */}
      <div
        className="flex-1 min-h-0 overflow-auto custom-scrollbar rounded-lg
                      border border-slate-700 bg-slate-900 p-3"
      >
        <TreeNode
          value={data}
          depth={0}
          isLast={true}
          path="$"
          isExpanded={isExpanded}
          onToggle={toggle}
          onSelectPath={handleSelectPath}
          selectedPath={selectedPath}
          searchQuery={query}
          matchPaths={matchPaths}
          onToast={onToast}
        />
      </div>

      {/* 하단 단축키 힌트 */}
      <div className="mt-2 flex items-center gap-4 text-[10px] text-slate-600">
        <span>
          <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-500">
            Ctrl+Shift+F
          </kbd>{" "}
          검색
        </span>
        <span>
          <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-500">
            Ctrl+Shift+E
          </kbd>{" "}
          전체 펼침
        </span>
        <span>
          <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-500">
            Ctrl+Shift+D
          </kbd>{" "}
          전체 접기
        </span>
        <span>
          <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-500">
            우클릭
          </kbd>{" "}
          값 복사
        </span>
      </div>
    </div>
  );
}
