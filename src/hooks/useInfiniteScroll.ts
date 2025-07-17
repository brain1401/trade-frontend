import { useEffect, useRef, useCallback } from "react";

/**
 * 무한 스크롤을 위한 커스텀 훅
 * Intersection Observer API를 사용하여 스크롤 끝 감지
 */
export function useInfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = "100px",
}: {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
}) {
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore],
  );

  useEffect(() => {
    const currentObserverRef = observerRef.current;

    if (!currentObserverRef) return;

    // 기존 observer 정리
    if (observerInstanceRef.current) {
      observerInstanceRef.current.disconnect();
    }

    // 새 observer 생성
    observerInstanceRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerInstanceRef.current.observe(currentObserverRef);

    return () => {
      if (observerInstanceRef.current) {
        observerInstanceRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  return observerRef;
}
