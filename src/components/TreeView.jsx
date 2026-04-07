import { useState, useCallback } from "react";
import TreeNode from "./TreeNode";
import PathBar from "./PathBar";
import { useExpandState } from "../hooks/useExpandState";

export default function TreeView({ data, onToast }) {
  const { isExpanded, toggle, expandAll, collapseAll, expandToDepth } =
    useExpandState(data);
  const [selectedPath, setSelectedPath] = useState(null);

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
          className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300
                     hover:bg-slate-700 transition-colors cursor-pointer"
        >
          전체 펼치기
        </button>
        <button
          onClick={collapseAll}
          className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300
                     hover:bg-slate-700 transition-colors cursor-pointer"
        >
          전체 접기
        </button>
      </div>

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
        />
      </div>
    </div>
  );
}
