import { useState, useCallback } from "react";

interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  loading: boolean;
  error: string | null;
}

const useAPI = <T,>(initialData: T | null = null) => {
  const initialState: ApiResponse<T> = {
    data: initialData,
    success: false,
    loading: false,
    error: null
  };

  const [response, setResponse] = useState<ApiResponse<T>>(initialState);

  const callAPI = useCallback(async (URL: string, options: RequestInit = { method: "GET" }) => {
    setResponse((prev) => ({ ...prev, success: false, loading: true }));
    try {
      const res = await fetch(URL, options);
      if (res.status < 200 || res.status >= 300) throw new Error("Failed to fetch");

      const json = await res.json();
      setResponse({
        data: json,
        success: true,
        loading: false,
        error: null
      });
    } catch (e) {
      setResponse({
        data: initialData,
        success: false,
        loading: false,
        error: (e as Error).message
      });
    }
  }, [initialData]);

  return [response, callAPI] as const;
};

export default useAPI;
