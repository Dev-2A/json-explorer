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
  const [activeTab, setActiveTab] = useState("input"); // 모바일용 탭

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
      <header className="border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <h1 className="text-base sm:text-lg font-bold tracking-tight">
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

      {/* 모바일 탭 (md 이하에서만 표시) */}
      <div className="flex md:hidden border-b border-slate-800">
        <button
          onClick={() => setActiveTab("input")}
          className={`flex-1 py-2 text-xs font-semibold transition-colors cursor-pointer
                     ${
                       activeTab === "input"
                         ? "text-blue-400 border-b-2 border-blue-400"
                         : "text-slate-500"
                     }`}
        >
          📝 Input
        </button>
        <button
          onClick={() => setActiveTab("tree")}
          className={`flex-1 py-2 text-xs font-semibold transition-colors cursor-pointer
                     ${
                       activeTab === "tree"
                         ? "text-blue-400 border-b-2 border-blue-400"
                         : "text-slate-500"
                     }`}
        >
          🌳 Tree {parsedData ? "✓" : ""}
        </button>
      </div>

      {/* 메인 영역 */}
      <main className="flex flex-col md:flex-row flex-1 min-h-0">
        {/* 좌측: 입력 패널 */}
        <div
          className={`md:w-1/2 md:border-r border-slate-800 p-4 flex flex-col
                        ${activeTab === "input" ? "flex" : "hidden md:flex"}
                        min-h-[300px] md:min-h-0`}
        >
          <InputPanel onParse={handleParse} onToast={handleToast} />
        </div>

        {/* 우측: 트리 뷰 */}
        <div
          className={`md:w-1/2 p-4 flex flex-col
                        ${activeTab === "tree" ? "flex" : "hidden md:flex"}
                        min-h-[300px] md:min-h-0`}
        >
          {parsedData ? (
            <TreeView
              data={parsedData}
              rawText={rawText}
              onToast={handleToast}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-slate-600 text-sm text-center leading-relaxed">
                {activeTab === "tree" ? (
                  <>
                    📝 Input 탭에서
                    <br />
                    JSON을 입력해주세요
                  </>
                ) : (
                  <>
                    좌측에 JSON을 입력하면
                    <br />
                    이곳에 트리가 표시됩니다
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-slate-800 px-4 sm:px-6 py-2 text-center">
        <p className="text-[10px] text-slate-600">
          Made with 🥤 and ❤️ by{" "}
          <a
            href="https://github.com/Dev-2A"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            Dev-2A
          </a>
        </p>
      </footer>

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
