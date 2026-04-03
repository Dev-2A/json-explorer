import { useState, useCallback, useRef } from "react";

export function useJsonParser() {
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const parse = useCallback((text) => {
    // 디바운스: 빠른 타이핑 시 마지막 입력만 파싱
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      // 빈 입력
      if (!text || !text.trim()) {
        setParsedData(null);
        setError(null);
        return;
      }

      try {
        const data = JSON.parse(text);
        setParsedData(data);
        setError(null);
      } catch (e) {
        setParsedData(null);

        // 에러 메시지에서 위치 추출
        const posMatch = e.message.match(/position\s+(\d+)/i);
        setError({
          message: e.message,
          position: posMatch ? parseInt(posMatch[1], 10) : undefined,
        });
      }
    }, 150);
  }, []);

  return { parsedData, error, parse };
}
