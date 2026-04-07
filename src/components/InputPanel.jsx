import { useState, useRef, useCallback } from "react";
import DropZone from "./DropZone";
import UrlFetcher from "./UrlFetcher";

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

export default function InputPanel({ onParse, onToast }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState(null); // 파일명 또는 URL
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    setSource(null);
    onParse(value);
  };

  const handleClear = () => {
    setText("");
    setSource(null);
    onParse("");
  };

  const handleSample = () => {
    setText(SAMPLE_JSON);
    setSource(null);
    onParse(SAMPLE_JSON);
  };

  const handlePrettify = () => {
    try {
      const parsed = JSON.parse(text);
      const pretty = JSON.stringify(parsed, null, 2);
      setText(pretty);
    } catch {
      // 파싱 실패 시 무시
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(text);
      const minified = JSON.stringify(parsed);
      setText(minified);
    } catch {
      // 파싱 실패 시 무시
    }
  };

  // 파일/URL로 로드된 데이터 처리
  const handleExternalLoad = useCallback(
    (content, error, sourceName) => {
      if (error) {
        onToast?.(`❌ ${error}`);
        return;
      }
      if (content) {
        setText(content);
        setSource(sourceName || null);
        onParse(content);
        onToast?.(`✅ 로드 완료${sourceName ? `: ${sourceName}` : ""}`);
      }
    },
    [onParse, onToast],
  );

  // 파일 선택 다이얼로그
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      onToast?.("❌ 파일 크기가 10MB를 초과합니다");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      handleExternalLoad(evt.target.result, null, file.name);
    };
    reader.onerror = () => {
      handleExternalLoad(null, "파일을 읽을 수 없습니다");
    };
    reader.readAsText(file);

    // 같은 파일 다시 선택 가능하도록 초기화
    e.target.value = "";
  };

  return (
    <DropZone onLoad={handleExternalLoad}>
      <div className="flex flex-col h-full">
        {/* 툴바 1행: 기본 버튼 */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
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
            onClick={handleFileSelect}
            className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300
                       hover:bg-slate-700 transition-colors cursor-pointer"
          >
            📂 파일 열기
          </button>
          <UrlFetcher onLoad={handleExternalLoad} />
        </div>

        {/* 툴바 2행: 편집 버튼 + 소스 정보 */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {source && (
            <span
              className="text-[10px] text-slate-500 truncate max-w-48 mr-auto"
              title={source}
            >
              📎 {source}
            </span>
          )}
          {!source && <span className="mr-auto" />}

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

        {/* 숨겨진 파일 input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.txt,.geojson,.jsonl,.ndjson"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* 텍스트 입력 영역 */}
        <div className="relative flex-1 min-h-0">
          <textarea
            value={text}
            onChange={handleChange}
            placeholder={
              'JSON을 붙여넣거나, 파일을 드래그하세요...\n\n예: { "key": "value" }'
            }
            spellCheck={false}
            className="w-full h-full resize-none rounded-lg border border-slate-700
                       bg-slate-900 p-4 text-sm text-slate-200 font-mono
                       placeholder:text-slate-600
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                       custom-scrollbar"
          />

          {text && (
            <span className="absolute bottom-2 right-3 text-[10px] text-slate-600 pointer-events-none">
              {new Blob([text]).size.toLocaleString()} bytes
            </span>
          )}
        </div>
      </div>
    </DropZone>
  );
}
