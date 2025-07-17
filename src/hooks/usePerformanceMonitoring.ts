import { useEffect, useRef, useState } from "react";

/**
 * 성능 메트릭 타입 정의
 */
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  dataFetchTime: number;
  componentMountTime: number;
  lastUpdated: number;
}

/**
 * 성능 모니터링 훅
 *
 * 컴포넌트의 로딩 시간, 렌더링 시간 등을 측정하여
 * 성능 최적화에 필요한 데이터를 제공
 */
export function usePerformanceMonitoring(componentName: string) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    dataFetchTime: 0,
    componentMountTime: 0,
    lastUpdated: Date.now(),
  });

  const mountTimeRef = useRef<number>(0);
  const renderStartRef = useRef<number>(0);
  const dataFetchStartRef = useRef<number>(0);

  // 컴포넌트 마운트 시간 측정
  useEffect(() => {
    mountTimeRef.current = performance.now();

    return () => {
      const mountTime = performance.now() - mountTimeRef.current;
      setMetrics((prev) => ({
        ...prev,
        componentMountTime: mountTime,
        lastUpdated: Date.now(),
      }));
    };
  }, []);

  // 렌더링 시간 측정 시작
  const startRenderMeasurement = () => {
    renderStartRef.current = performance.now();
  };

  // 렌더링 시간 측정 완료
  const endRenderMeasurement = () => {
    if (renderStartRef.current > 0) {
      const renderTime = performance.now() - renderStartRef.current;
      setMetrics((prev) => ({
        ...prev,
        renderTime,
        lastUpdated: Date.now(),
      }));
    }
  };

  // 데이터 페치 시간 측정 시작
  const startDataFetchMeasurement = () => {
    dataFetchStartRef.current = performance.now();
  };

  // 데이터 페치 시간 측정 완료
  const endDataFetchMeasurement = () => {
    if (dataFetchStartRef.current > 0) {
      const dataFetchTime = performance.now() - dataFetchStartRef.current;
      setMetrics((prev) => ({
        ...prev,
        dataFetchTime,
        lastUpdated: Date.now(),
      }));
    }
  };

  // 전체 로드 시간 측정
  const measureLoadTime = (startTime: number) => {
    const loadTime = performance.now() - startTime;
    setMetrics((prev) => ({
      ...prev,
      loadTime,
      lastUpdated: Date.now(),
    }));
  };

  // 성능 로그 출력 (개발 환경에서만)
  const logPerformance = () => {
    if (process.env.NODE_ENV === "development") {
      console.group(`🚀 Performance Metrics - ${componentName}`);
      console.log(`Load Time: ${metrics.loadTime.toFixed(2)}ms`);
      console.log(`Render Time: ${metrics.renderTime.toFixed(2)}ms`);
      console.log(`Data Fetch Time: ${metrics.dataFetchTime.toFixed(2)}ms`);
      console.log(
        `Component Mount Time: ${metrics.componentMountTime.toFixed(2)}ms`,
      );
      console.groupEnd();
    }
  };

  return {
    metrics,
    startRenderMeasurement,
    endRenderMeasurement,
    startDataFetchMeasurement,
    endDataFetchMeasurement,
    measureLoadTime,
    logPerformance,
  };
}

/**
 * 메모리 사용량 모니터링 훅
 */
export function useMemoryMonitoring() {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // 5초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

/**
 * 네트워크 상태 모니터링 훅
 */
export function useNetworkMonitoring() {
  const [networkInfo, setNetworkInfo] = useState<{
    online: boolean;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  }>({
    online: navigator.onLine,
  });

  useEffect(() => {
    const updateNetworkInfo = () => {
      const connection =
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;

      setNetworkInfo({
        online: navigator.onLine,
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
      });
    };

    const handleOnline = () => updateNetworkInfo();
    const handleOffline = () => updateNetworkInfo();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 연결 정보 변경 감지
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;
    if (connection) {
      connection.addEventListener("change", updateNetworkInfo);
    }

    updateNetworkInfo();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (connection) {
        connection.removeEventListener("change", updateNetworkInfo);
      }
    };
  }, []);

  return networkInfo;
}
