function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* 헤더 */}
      <header className="border-b border-slate-800 px-6 py-3">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-blue-400">🔍</span> JSON Explorer
        </h1>
      </header>

      {/* 메인 영역 */}
      <main className="flex h-[calc(100vh-53px)]">
        {/* 좌측: 입력 패널 (Step 3) */}
        <div className="w-1/2 border-r border-slate-800 p-4">
          <p className="text-slate-500 text-sm">입력 패널 (Step 3에서 구현)</p>
        </div>

        {/* 우측: 트리 뷰 (Step 5) */}
        <div className="w-1/2 p-4">
          <p className="text-slate-500 text-sm">트리 뷰 (Step 5에서 구현)</p>
        </div>
      </main>
    </div>
  );
}

export default App;
