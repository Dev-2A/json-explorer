import { useState, useCallback } from "react";
import InputPanel from "./components/InputPanel";
import ErrorBanner from "./components/ErrorBanner";
import TreeView from "./components/TreeView";
import CopyToast from "./components/CopyToast";
import { useJsonParser } from "./hooks/useJsonParser";

function App() {
  const { parsedData, error, parse } = useJsonParser();
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [rawText, setRawText] = useState("");

  const handleParse = useCallback(
    (text) => {
      setRawText(text);
      parse(text);
    },
    [parse],
  );

  const handleToast = useCallback((message) => {
    setToast({ visible: true, message });
  }, []);

  const handleHideToast = useCallback(() => {
    setToast({ visible: false, message: "" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      {/* 헤더 */}
      <header className="border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-blue-400">🔍</span> JSON Explorer
        </h1>
        <a
          href="https://github.com/Dev-2A/json-explorer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          GitHub ↗
        </a>
      </header>

      {/* 에러 배너 */}
      <ErrorBanner error={error} />

      {/* 메인 영역 */}
      <main className="flex flex-1 min-h-0">
        {/* 좌측: 입력 패널 */}
        <div className="w-1/2 border-r border-slate-800 p-4 flex flex-col">
          <InputPanel onParse={handleParse} onToast={handleToast} />
        </div>

        {/* 우측: 트리 뷰 */}
        <div className="w-1/2 p-4 flex flex-col">
          {parsedData ? (
            <TreeView
              data={parsedData}
              rawText={rawText}
              onToast={handleToast}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-slate-600 text-sm text-center leading-relaxed">
                좌측에 JSON을 입력하면
                <br />
                이곳에 트리가 표시됩니다
              </p>
            </div>
          )}
        </div>
      </main>

      {/* 토스트 */}
      <CopyToast
        message={toast.message}
        visible={toast.visible}
        onHide={handleHideToast}
      />
    </div>
  );
}

export default App;
