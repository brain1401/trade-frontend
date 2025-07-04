import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/api";

/**
 * 백엔드에 텍스트 번역을 요청하는 API 함수
 * @param text - 번역할 영어 텍스트
 * @returns 번역된 한국어 텍스트
 */
const fetchTranslation = async (text: string): Promise<string> => {
  if (!text || text.trim() === "") {
    return text;
  }
  try {
    const response = await httpClient.post<{ translatedText: string }>(
      "/translate",
      { text },
    );
    return response.translatedText;
  } catch (error) {
    console.error(`'${text}' 번역 요청 실패:`, error);
    return text;
  }
};

/**
 * 텍스트를 한국어로 번역하고 결과를 캐싱하는 커스텀 훅
 * @param text - 번역할 영어 텍스트
 * @returns 번역된 텍스트 (로딩 중이거나 실패 시 원본 텍스트)
 */
export function useTranslation(text: string) {
  const { data: translatedText, isLoading } = useQuery({
    queryKey: ["translation", text],
    queryFn: () => fetchTranslation(text),
    staleTime: Infinity,
    enabled: !!text,
  });

  return isLoading ? text : translatedText || text;
}
