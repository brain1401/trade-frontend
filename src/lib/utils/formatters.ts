/**
 * 다양한 데이터 포매팅을 위한 유틸리티 함수들
 *
 * @example 차트 값 포매팅
 * ```typescript
 * const formatted = formatChartValue(1500000);
 * // "1.5M"
 * ```
 *
 * @example 통화 포매팅
 * ```typescript
 * const formatted = formatCurrency(1234.56, "USD");
 * // "$1,234.56"
 * ```
 *
 * @example 숫자 포매팅
 * ```typescript
 * const formatted = formatNumber(1234567);
 * // "1,234,567"
 * ```
 */

/**
 * 차트에서 사용할 값을 포매팅하는 함수
 * 큰 숫자를 K, M, B 단위로 축약하여 표시
 *
 * @param value - 포매팅할 숫자 값
 * @returns 포매팅된 문자열 (예: "1.5M", "2.3B", "500K")
 *
 * @example
 * ```typescript
 * formatChartValue(1500000);     // "1.5M"
 * formatChartValue(2300000000);  // "2.3B"
 * formatChartValue(500000);      // "500K"
 * formatChartValue(1234);        // "1K"
 * ```
 */
export const formatChartValue = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`;
  }
  return value.toString();
};

/**
 * 통화를 포매팅하는 함수
 *
 * @param value - 포매팅할 숫자 값
 * @param currency - 통화 코드 (기본값: "USD")
 * @param locale - 로케일 (기본값: "en-US")
 * @returns 포매팅된 통화 문자열
 *
 * @example
 * ```typescript
 * formatCurrency(1234.56);           // "$1,234.56"
 * formatCurrency(1234.56, "EUR");    // "€1,234.56"
 * formatCurrency(1234.56, "KRW", "ko-KR"); // "₩1,235"
 * ```
 */
export const formatCurrency = (
  value: number,
  currency: string = "USD",
  locale: string = "en-US",
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

/**
 * 숫자를 천 단위 구분기호와 함께 포매팅하는 함수
 *
 * @param value - 포매팅할 숫자 값
 * @param locale - 로케일 (기본값: "en-US")
 * @returns 포매팅된 숫자 문자열
 *
 * @example
 * ```typescript
 * formatNumber(1234567);        // "1,234,567"
 * formatNumber(1234567, "de-DE"); // "1.234.567"
 * ```
 */
export const formatNumber = (
  value: number,
  locale: string = "en-US",
): string => {
  return new Intl.NumberFormat(locale).format(value);
};

/**
 * 숫자를 억 단위(Billions)의 미국 달러 형식으로 포매팅하는 함수
 *
 * @param value - 포매팅할 숫자 값
 * @returns 포매팅된 문자열 (예: "1.2B", "-0.5B")
 *
 * @example
 * ```typescript
 * formatUsdInBillions(1234567890);   // "1.2B"
 * formatUsdInBillions(-500000000);  // "-0.5B"
 * ```
 */
export const formatUsdInBillions = (value: number): string => {
  return `${(value / 1_000_000_000).toFixed(1)}B`;
};

/**
 * 백분율을 포매팅하는 함수
 *
 * @param value - 포매팅할 숫자 값 (0-1 사이의 소수 또는 0-100 사이의 정수)
 * @param decimals - 소수점 자릿수 (기본값: 1)
 * @param isDecimal - 입력값이 소수인지 여부 (기본값: false, 즉 백분율 값)
 * @returns 포매팅된 백분율 문자열
 *
 * @example
 * ```typescript
 * formatPercentage(25);          // "25.0%"
 * formatPercentage(0.25, 1, true); // "25.0%"
 * formatPercentage(33.333, 2);   // "33.33%"
 * ```
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1,
  isDecimal: boolean = false,
): string => {
  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * 파일 크기를 포매팅하는 함수
 *
 * @param bytes - 바이트 단위의 크기
 * @param decimals - 소수점 자릿수 (기본값: 2)
 * @returns 포매팅된 파일 크기 문자열
 *
 * @example
 * ```typescript
 * formatFileSize(1024);        // "1.00 KB"
 * formatFileSize(1536, 1);     // "1.5 KB"
 * formatFileSize(1048576);     // "1.00 MB"
 * ```
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * 날짜를 상대적 시간으로 포매팅하는 함수
 *
 * @param date - 포매팅할 날짜
 * @param locale - 로케일 (기본값: "en-US")
 * @returns 상대적 시간 문자열
 *
 * @example
 * ```typescript
 * const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
 * formatRelativeTime(yesterday); // "1 day ago"
 * ```
 */
export const formatRelativeTime = (
  date: Date,
  locale: string = "en-US",
): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second");
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
  }
};

/**
 * 시간을 HH:MM 형식으로 포매팅하는 함수
 *
 * @param date - 포매팅할 날짜
 * @param use24Hour - 24시간 형식 사용 여부 (기본값: true)
 * @returns 포매팅된 시간 문자열
 *
 * @example
 * ```typescript
 * const date = new Date('2023-01-01T14:30:00');
 * formatTime(date); // "14:30"
 * formatTime(date, false); // "2:30 PM"
 * ```
 */
export const formatTime = (date: Date, use24Hour: boolean = true): string => {
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !use24Hour,
  });
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 포매팅하는 함수
 *
 * @param date - 포매팅할 날짜
 * @returns 포매팅된 날짜 문자열
 *
 * @example
 * ```typescript
 * const date = new Date('2023-01-01');
 * formatDate(date); // "2023-01-01"
 * ```
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * 날짜와 시간을 함께 포매팅하는 함수
 *
 * @param date - 포매팅할 날짜
 * @param options - 포매팅 옵션
 * @returns 포매팅된 날짜시간 문자열
 *
 * @example
 * ```typescript
 * const date = new Date('2023-01-01T14:30:00');
 * formatDateTime(date); // "2023년 1월 1일 오후 2:30"
 * ```
 */
export const formatDateTime = (
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  },
): string => {
  return date.toLocaleDateString("ko-KR", options);
};
