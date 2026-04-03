import { useState, useCallback, useRef } from "react";
import { parseJson } from "../utils/jsonParser";

export function useJsonParser() {
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const parse = useCallback((text) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const { data, error: err } = parseJson(text);
      setParsedData(data);
      setError(err);
    }, 150);
  }, []);

  return { parsedData, error, parse };
}
