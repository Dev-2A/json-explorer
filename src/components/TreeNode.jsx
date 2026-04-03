import { useState } from "react";
import { getValueType, isExpandable, getPreview } from "../utils/typeUtils";
import ValueRenderer from "./ValueRenderer";

export default function TreeNode({ name, value, depth = 0, isLast = true }) {
  const type = getValueType(value);
  const expandable = isExpandable(value);
  const [expanded, setExpanded] = useState(depth < 2); // 깊이 2까지 자동 펼침

  const indent = depth * 20;

  // 펼침/접기 토글
  const handleToggle = () => {
    if (expandable) {
      setExpanded((prev) => !prev);
    }
  };

  // 자식 엔트리 추출
  const getEntries = () => {
    if (type === "array") {
      return value.map((item, index) => ({
        key: index,
        name: index,
        value: item,
      }));
    }
    if (type === "object") {
      return Object.entries(value).map(([k, v]) => ({
        key: k,
        name: k,
        value: v,
      }));
    }
    return [];
  };

  const entries = expandable ? getEntries() : [];
  const openBracket = type === "array" ? "[" : "{";
  const closeBracket = type === "array" ? "]" : "}";
  const comma = isLast ? "" : ",";

  return (
    <div className="font-mono text-sm leading-6">
      {/* 현재 노드 행 */}
      <div
        className="flex items-center hover:bg-slate-800/50 rounded px-1 group"
        style={{ paddingLeft: `${indent}px` }}
      >
        {/* 펼침/접기 화살표 */}
        <span
          onClick={handleToggle}
          className={`w-4 h-4 flex items-center justify-center text-[10px] shrink-0
                     ${expandable ? "cursor-pointer text-slate-500 hover:text-slate-300" : "text-transparent"}`}
        >
          {expandable ? (expanded ? "▼" : "▶") : ""}
        </span>

        {/* 키 이름 */}
        {name !== undefined && name !== null && (
          <>
            <span className="text-json-key">
              {typeof name === "string" ? `"${name}"` : name}
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
          </>
        ) : (
          <>
            <ValueRenderer value={value} />
            <span className="text-slate-500">{comma}</span>
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
            />
          ))}

          {/* 닫는 괄호 */}
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
