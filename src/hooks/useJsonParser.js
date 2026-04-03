import { useState, useCallback } from "react";

/**
 * JSON 파싱 + 에러 처리 훅
 */
export function useJsonParser() {
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);

  const parse = useCallback((text) => {
    //TODO - Step 4에서 구현
    setParsedData(null);
    setError(null);
  }, []);

  return { parsedData, error, parse };
}
