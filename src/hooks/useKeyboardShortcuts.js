import { useEffect } from "react";

/**
 * 전역 키보드 단축키
 * Ctrl+Shift+E: 전체 펼치기
 * Ctrl+Shift+C: 전체 접기
 * Ctrl+Shift+F: 검색 포커스
 * Escape: 검색 초기화
 */
export function useKeyboardShortcuts({ expandAll, collapseAll, focusSearch }) {
  useEffect(() => {
    const handler = (e) => {
      // textarea, input 안에서는 단축키 무시 (Escape 제외)
      const tag = e.target.tagName;
      const isInput = tag === "TEXTAREA" || tag === "INPUT";

      // Ctrl+Shift+E: 전체 펼치기
      if (e.ctrlKey && e.shiftKey && e.key === "E") {
        e.preventDefault();
        expandAll?.();
        return;
      }

      // Ctrl+Shift+W: 전체 접기 (C는 복사와 충돌)
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        collapseAll?.();
        return;
      }

      // Ctrl+Shift+F: 검색 포커스
      if (e.ctrlKey && e.shiftKey && e.key === "F") {
        e.preventDefault();
        focusSearch?.();
        return;
      }

      // Escape: 검색 입력에서 나오기
      if (e.key === "Escape" && isInput) {
        e.target.blur();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [expandAll, collapseAll, focusSearch]);
}
