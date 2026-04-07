import { useMemo } from "react";
import { analyzeJson, formatBytes } from "../utils/stats";

export default function StatsPanel({ data, rawText }) {
  const stats = useMemo(() => analyzeJson(data), [data]);

  if (!stats) return null;

  const byteSize = rawText ? new Blob([rawText]).size : 0;

  // 타입별 색상 매핑
  const typeColors = {
    object: "text-purple-400",
    array: "text-blue-400",
    string: "text-green-400",
    number: "text-sky-400",
    boolean: "text-amber-400",
    null: "text-slate-500",
  };

  // 타입 분포 바 계산
  const totalPrimitive =
    stats.types.string +
    stats.types.number +
    stats.types.boolean +
    stats.types.null;
  const typeEntries = Object.entries(stats.types)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs font-mono">
      {/* 제목 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-slate-400">📊 통계</span>
      </div>

      {/* 요약 그리드 */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <StatItem label="전체 노드" value={stats.totalNodes} />
        <StatItem label="최대 깊이" value={stats.maxDepth} />
        <StatItem label="크기" value={formatBytes(byteSize)} />
        <StatItem
          label="오브젝트"
          value={stats.types.object}
          color="text-purple-400"
        />
        <StatItem
          label="배열"
          value={stats.types.array}
          color="text-blue-400"
        />
        <StatItem label="키 수" value={stats.totalKeys} />
      </div>

      {/* 타입 분포 바 */}
      <div className="mb-3">
        <p className="text-slate-500 text-[10px] mb-1.5">타입 분포</p>
        <div className="flex h-2 rounded-full overflow-hidden bg-slate-800 gap-px">
          {typeEntries.map(([type, count]) => {
            const barColors = {
              object: "bg-purple-500",
              array: "bg-blue-500",
              string: "bg-green-500",
              number: "bg-sky-500",
              boolean: "bg-amber-500",
              null: "bg-slate-600",
            };
            return (
              <div
                key={type}
                className={`${barColors[type]} transition-all duration-300`}
                style={{ flex: count }}
                title={`${type}: ${count}`}
              />
            );
          })}
        </div>
        {/* 범례 */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
          {typeEntries.map(([type, count]) => (
            <span key={type} className="flex items-center gap-1">
              <span className={`${typeColors[type]} text-[10px]`}>●</span>
              <span className="text-slate-500 text-[10px]">
                {type} <span className="text-slate-400">{count}</span>
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="space-y-1 border-t border-slate-800 pt-2">
        {stats.totalArrayItems > 0 && (
          <DetailRow label="배열 항목 합계" value={stats.totalArrayItems} />
        )}
        {stats.emptyArrays > 0 && (
          <DetailRow label="빈 배열" value={stats.emptyArrays} />
        )}
        {stats.emptyObjects > 0 && (
          <DetailRow label="빈 오브젝트" value={stats.emptyObjects} />
        )}
        {stats.longestString && (
          <DetailRow
            label="가장 긴 문자열"
            value={`${stats.longestString.value.length}자`}
            sub={stats.longestString.path}
          />
        )}
        {stats.largestNumber && (
          <DetailRow
            label="가장 큰 숫자"
            value={stats.largestNumber.value.toLocaleString()}
            sub={stats.largestNumber.path}
          />
        )}
      </div>
    </div>
  );
}

function StatItem({ label, value, color = "text-slate-200" }) {
  return (
    <div className="bg-slate-800/50 rounded px-2 py-1.5 text-center">
      <p className="text-[10px] text-slate-500 mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function DetailRow({ label, value, sub }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-slate-500 text-[10px]">{label}</span>
      <div className="text-right">
        <span className="text-slate-300 text-[10px]">{value}</span>
        {sub && (
          <span
            className="text-slate-600 text-[10px] ml-1 truncate max-w-24 inline-block align-bottom"
            title={sub}
          >
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}
