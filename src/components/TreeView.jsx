import TreeNode from "./TreeNode";

export default function TreeView({ data }) {
  if (data === null || data === undefined) return null;

  return (
    <div className="flex flex-col h-full">
      {/* 툴바 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-slate-400">
          🌳 Tree View
        </span>
      </div>

      {/* 트리 렌더링 영역 */}
      <div
        className="flex-1 min-h-0 overflow-auto custom-scrollbar rounded-lg
                      border border-slate-700 bg-slate-900 p-3"
      >
        <TreeNode value={data} depth={0} isLast={true} />
      </div>
    </div>
  );
}
