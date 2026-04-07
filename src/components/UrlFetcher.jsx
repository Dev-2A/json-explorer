import { useState, useCallback } from "react";

export default function UrlFetcher({ onLoad }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleFetch = useCallback(async () => {
    if (!url.trim()) return;

    let targetUrl = url.trim();
    // http:// 또는 https:// 없으면 자동 추가
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = "https://" + targetUrl;
    }

    setLoading(true);

    try {
      const response = await fetch(targetUrl);

      if (!response.ok) {
        onLoad(null, `HTTP ${response.status}: ${response.statusText}`);
        setLoading(false);
        return;
      }

      const contentType = response.headers.get("content-type") || "";
      const text = await response.text();

      // JSON인지 간단 검증
      try {
        JSON.parse(text);
      } catch {
        if (!contentType.includes("json")) {
          onLoad(null, "응답이 유효한 JSON이 아닙니다");
          setLoading(false);
          return;
        }
      }

      onLoad(text, null, targetUrl);
      setUrl("");
      setShowInput(false);
    } catch (err) {
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        onLoad(
          null,
          "CORS 정책으로 접근할 수 없습니다. 같은 도메인이거나 CORS를 허용하는 URL만 가능합니다.",
        );
      } else {
        onLoad(null, `가져오기 실패: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [url, onLoad]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleFetch();
    }
    if (e.key === "Escape") {
      setShowInput(false);
      setUrl("");
    }
  };

  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300
                   hover:bg-slate-700 transition-colors cursor-pointer"
      >
        URL 가져오기
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 flex-1 min-w-0">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="https://api.example.com/data.json"
        autoFocus
        spellCheck={false}
        className="flex-1 min-w-0 px-2.5 py-1 text-xs font-mono rounded
                   bg-slate-900 border border-slate-600 text-slate-200
                   placeholder:text-slate-600
                   focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={handleFetch}
        disabled={loading || !url.trim()}
        className="px-2.5 py-1 text-xs rounded bg-blue-600 text-white
                   hover:bg-blue-500 transition-colors cursor-pointer
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "⏳" : "가져오기"}
      </button>
      <button
        onClick={() => {
          setShowInput(false);
          setUrl("");
        }}
        className="px-1.5 py-1 text-xs rounded text-slate-500
                   hover:text-slate-300 transition-colors cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}
