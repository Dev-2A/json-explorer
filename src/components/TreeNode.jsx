import { getValueType, isExpandable, getPreview } from "../utils/typeUtils";
import ValueRenderer from "./ValueRenderer";
import HighlightText from "./HighlightText";

export default function TreeNode({
  name,
  value,
  depth = 0,
  isLast = true,
  path = "$",
  isExpanded,
  onToggle,
  onSelectPath,
  selectedPath,
  searchQuery = "",
  matchPaths = new Set(),
}) {
  const type = getValueType(value);
  const expandable = isExpandable(value);
  const expanded = isExpanded(path);
  const isSelected = selectedPath === path;
  const isMatch = matchPaths.has(path);

  const indent = depth * 20;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (expandable) onToggle(path);
  };

  const handleSelect = () => {
    onSelectPath?.(path);
  };

  const getEntries = () => {
    if (type === "array") {
      return value.map((item, index) => ({
        key: index,
        name: index,
        value: item,
        path: `${path}[${index}]`,
      }));
    }
    if (type === "object") {
      return Object.entries(value).map(([k, v]) => ({
        key: k,
        name: k,
        value: v,
        path: `${path}.${k}`,
      }));
    }
    return [];
  };

  const entries = expandable ? getEntries() : [];
  const openBracket = type === "array" ? "[" : "{";
  const closeBracket = type === "array" ? "]" : "}";
  const comma = isLast ? "" : ",";

  const typeBadge = (
    <span
      className={`ml-2 text-[10px] px-1.5 py-0 rounded-full opacity-0 
                      group-hover:opacity-100 transition-opacity
                      ${type === "array" ? "bg-blue-900/50 text-blue-400" : ""}
                      ${type === "object" ? "bg-purple-900/50 text-purple-400" : ""}
                      ${type === "string" ? "bg-green-900/50 text-green-400" : ""}
                      ${type === "number" ? "bg-sky-900/50 text-sky-400" : ""}
                      ${type === "boolean" ? "bg-amber-900/50 text-amber-400" : ""}
                      ${type === "null" ? "bg-slate-800 text-slate-500" : ""}`}
    >
      {type}
    </span>
  );

  // 매칭 행 좌측 표시
  const matchIndicator = isMatch ? (
    <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-yellow-400 rounded-full" />
  ) : null;

  return (
    <div className="font-mono text-sm leading-6 select-none">
      {/* 현재 노드 행 */}
      <div
        onClick={handleSelect}
        className={`relative flex items-center rounded px-1 group cursor-pointer
                   ${
                     isSelected
                       ? "bg-blue-900/30 border-l-2 border-blue-400"
                       : isMatch
                         ? "bg-yellow-900/15"
                         : "hover:bg-slate-800/50"
                   }`}
        style={{ paddingLeft: `${indent}px` }}
      >
        {matchIndicator}

        {/* 펼침/접기 화살표 */}
        <span
          onClick={handleToggle}
          className={`w-4 h-4 flex items-center justify-center text-[10px] shrink-0
                     transition-transform duration-150
                     ${expandable ? "cursor-pointer text-slate-500 hover:text-slate-300" : "text-transparent"}`}
          style={{
            transform:
              expandable && expanded ? "rotate(0deg)" : "rotate(-90deg)",
          }}
        >
          {expandable ? "▼" : ""}
        </span>

        {/* 키 이름 */}
        {name !== undefined && name !== null && (
          <>
            <span className="text-json-key">
              {typeof name === "string" ? (
                <>
                  "
                  <HighlightText text={name} query={searchQuery} />"
                </>
              ) : (
                name
              )}
            </span>
            <span className="text-slate-500 mx-1">:</span>
          </>
        )}

        {/* 값 or 여는 괄호 */}
        {expandable ? (
          <>
            <span className="text-json-bracket">{openBracket}</span>
            {!expanded && (
              <>
                <span
                  className="text-slate-500 text-xs mx-1 cursor-pointer hover:text-slate-300"
                  onClick={handleToggle}
                >
                  {getPreview(value)}
                </span>
                <span className="text-json-bracket">{closeBracket}</span>
                <span className="text-slate-500">{comma}</span>
              </>
            )}
            {typeBadge}
          </>
        ) : (
          <>
            <ValueRenderer value={value} searchQuery={searchQuery} />
            <span className="text-slate-500">{comma}</span>
            {typeBadge}
          </>
        )}
      </div>

      {/* 자식 노드 (재귀) */}
      {expandable && expanded && (
        <>
          {entries.map((entry, index) => (
            <TreeNode
              key={entry.key}
              name={entry.name}
              value={entry.value}
              depth={depth + 1}
              isLast={index === entries.length - 1}
              path={entry.path}
              isExpanded={isExpanded}
              onToggle={onToggle}
              onSelectPath={onSelectPath}
              selectedPath={selectedPath}
              searchQuery={searchQuery}
              matchPaths={matchPaths}
            />
          ))}

          <div
            className="flex items-center px-1"
            style={{ paddingLeft: `${indent}px` }}
          >
            <span className="w-4 h-4 shrink-0" />
            <span className="text-json-bracket">{closeBracket}</span>
            <span className="text-slate-500">{comma}</span>
          </div>
        </>
      )}
    </div>
  );
}
