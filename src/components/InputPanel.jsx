import { useState } from "react";

const SAMPLE_JSON = `{
  "name": "JSON Explorer",
  "version": "0.1.0",
  "features": [
    "트리 뷰",
    "검색",
    "JSONPath 복사"
  ],
  "author": {
    "name": "Dev-2A",
    "github": "https://github.com/Dev-2A"
  },
  "settings": {
    "theme": "dark",
    "fontSize": 14,
    "wordWrap": true,
    "nullable": null
  },
  "tags": ["react", "vite", "tailwind"],
  "isPublic": true,
  "downloads": 1024
}`;

export default function InputPanel({ onParse }) {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    onParse(value);
  };

  const handleClear = () => {
    setText("");
    onParse("");
  };

  const handleSample = () => {
    setText(SAMPLE_JSON);
    onParse(SAMPLE_JSON);
  };

  const handlePrettify = () => {
    try {
      const parsed = JSON.parse(text);
      const pretty = JSON.stringify(parsed, null, 2);
      setText(pretty);
    } catch {
      // 파싱 실패 시 아무 것도 하지 않음
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(text);
      const minified = JSON.stringify(parsed);
      setText(minified);
    } catch {
      // 파싱 실패 시 아무 것도 하지 않음
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 툴바 */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-sm font-semibold text-slate-400 mr-auto">
          📝 Input
        </span>
        <button
          onClick={handleSample}
          className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300
                     hover:bg-slate-700 transition-colors cursor-pointer"
        >
          샘플 데이터
        </button>
        <button
          onClick={handlePrettify}
          className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300
                     hover:bg-slate-700 transition-colors cursor-pointer"
        >
          정렬
        </button>
        <button
          onClick={handleMinify}
          className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300
                     hover:bg-slate-700 transition-colors cursor-pointer"
        >
          압축
        </button>
        <button
          onClick={handleClear}
          className="px-2.5 py-1 text-xs rounded bg-red-900/50 text-red-300
                     hover:bg-red-900/80 transition-colors cursor-pointer"
        >
          지우기
        </button>
      </div>

      {/* 텍스트 입력 영역 */}
      <div className="relative flex-1 min-h-0">
        <textarea
          value={text}
          onChange={handleChange}
          placeholder={'JSON을 붙여 넣으세요...\n\n예: { "key": "value" }'}
          spellCheck={false}
          className="w-full h-full resize-none rounded-lg border border-slate-700
                     bg-slate-900 p-4 text-sm text-slate-200 font-mono
                     placeholder:text-slate-600
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                     custom-scrollbar"
        />

        {/* 우하단 바이트 카운터 */}
        {text && (
          <span className="absolute bottom-2 right-3 text-[10px] text-slate-600 pointer-events-none">
            {new Blob([text]).size.toLocaleString()} bytes
          </span>
        )}
      </div>
    </div>
  );
}
