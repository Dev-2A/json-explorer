import { forwardRef } from "react";

const SearchBar = forwardRef(function SearchBar(
  { query, onChange, matchCount },
  ref,
) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none">
          🔎
        </span>

        <input
          ref={ref}
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="키 또는 값 검색... (Ctrl+Shift+F)"
          spellCheck={false}
          className="w-full pl-8 pr-16 py-1.5 text-xs font-mono rounded-lg
                     bg-slate-800 border border-slate-700 text-slate-200
                     placeholder:text-slate-600
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        {query && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">
            {matchCount > 0 ? (
              <span className="text-blue-400">{matchCount}건</span>
            ) : (
              <span className="text-red-400">0건</span>
            )}
          </span>
        )}
      </div>

      {query && (
        <button
          onClick={() => onChange("")}
          className="px-2 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-400
                     hover:bg-slate-700 hover:text-slate-200 transition-colors cursor-pointer"
        >
          ✕
        </button>
      )}
    </div>
  );
});

export default SearchBar;
