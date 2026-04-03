import InputPanel from "./components/InputPanel";
import ErrorBanner from "./components/ErrorBanner";
import { useJsonParser } from "./hooks/useJsonParser";

function App() {
  const { parsedData, error, parse } = useJsonParser();

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
          <InputPanel onParse={parse} />
        </div>

        {/* 우측: 트리 뷰 (Step 5) */}
        <div className="w-1/2 p-4 flex flex-col">
          {parsedData ? (
            <div className="text-sm text-slate-400">
              <p className="mb-2 font-semibold text-slate-300">🌳 Tree View</p>
              <pre className="text-xs text-slate-500 overflow-auto custom-scrollbar">
                {JSON.stringify(parsedData, null, 2).slice(0, 500)}
                {JSON.stringify(parsedData, null, 2).length > 500 && "\n..."}
              </pre>
              <p className="mt-3 text-slate-600 text-xs">
                (Step 5에서 트리 컴포넌트로 교체 예정)
              </p>
            </div>
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
    </div>
  );
}

export default App;
