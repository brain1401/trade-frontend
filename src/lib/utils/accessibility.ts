/**
 * 접근성 유틸리티 함수들
 * 키보드 네비게이션, ARIA 지원, 스크린 리더 호환성을 위한 헬퍼 함수들
 */

/**
 * 키보드 이벤트 핸들러 타입
 */
export type KeyboardEventHandler = (event: React.KeyboardEvent) => void;

/**
 * 포커스 가능한 요소들의 셀렉터
 */
export const FOCUSABLE_ELEMENTS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(", ");

/**
 * Enter 또는 Space 키 이벤트를 처리하는 핸들러
 * @param callback - 키가 눌렸을 때 실행할 콜백 함수
 * @returns 키보드 이벤트 핸들러
 */
export function createKeyboardHandler(
  callback: () => void,
): KeyboardEventHandler {
  return (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      callback();
    }
  };
}

/**
 * 화살표 키를 사용한 리스트 네비게이션 핸들러
 * @param items - 네비게이션할 아이템들의 참조 배열
 * @param currentIndex - 현재 포커스된 아이템의 인덱스
 * @param onIndexChange - 인덱스 변경 시 호출할 콜백
 * @returns 키보드 이벤트 핸들러
 */
export function createArrowNavigationHandler(
  items: React.RefObject<HTMLElement>[],
  currentIndex: number,
  onIndexChange: (newIndex: number) => void,
): KeyboardEventHandler {
  return (event: React.KeyboardEvent) => {
    let newIndex = currentIndex;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        newIndex = (currentIndex + 1) % items.length;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        break;
      case "Home":
        event.preventDefault();
        newIndex = 0;
        break;
      case "End":
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    onIndexChange(newIndex);
    items[newIndex]?.current?.focus();
  };
}

/**
 * 포커스 트랩을 생성하는 훅
 * 모달이나 드롭다운에서 포커스가 벗어나지 않도록 함
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>) {
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(FOCUSABLE_ELEMENTS);
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    // 초기 포커스 설정
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [containerRef]);
}

/**
 * 스크린 리더를 위한 라이브 리전 알림
 * @param message - 알릴 메시지
 * @param priority - 알림 우선순위 ('polite' | 'assertive')
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite",
) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // 메시지를 읽은 후 요소 제거
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * ARIA 속성을 생성하는 헬퍼 함수들
 */
export const aria = {
  /**
   * 확장 가능한 요소의 ARIA 속성
   */
  expandable: (isExpanded: boolean, controlsId?: string) => ({
    "aria-expanded": isExpanded,
    ...(controlsId && { "aria-controls": controlsId }),
  }),

  /**
   * 선택 가능한 요소의 ARIA 속성
   */
  selectable: (isSelected: boolean) => ({
    "aria-selected": isSelected,
    role: "option",
  }),

  /**
   * 체크 가능한 요소의 ARIA 속성
   */
  checkable: (isChecked: boolean) => ({
    "aria-checked": isChecked,
    role: "checkbox",
  }),

  /**
   * 로딩 상태의 ARIA 속성
   */
  loading: (isLoading: boolean, label?: string) => ({
    "aria-busy": isLoading,
    ...(label && { "aria-label": label }),
  }),

  /**
   * 에러 상태의 ARIA 속성
   */
  error: (hasError: boolean, errorId?: string) => ({
    "aria-invalid": hasError,
    ...(hasError && errorId && { "aria-describedby": errorId }),
  }),

  /**
   * 필수 입력 필드의 ARIA 속성
   */
  required: (isRequired: boolean) => ({
    "aria-required": isRequired,
  }),

  /**
   * 숨겨진 요소의 ARIA 속성
   */
  hidden: (isHidden: boolean) => ({
    "aria-hidden": isHidden,
  }),

  /**
   * 라벨과 설명을 연결하는 ARIA 속성
   */
  labelledBy: (labelId: string, descriptionId?: string) => ({
    "aria-labelledby": labelId,
    ...(descriptionId && { "aria-describedby": descriptionId }),
  }),
};

/**
 * 시맨틱 HTML 역할 정의
 */
export const roles = {
  navigation: "navigation",
  main: "main",
  banner: "banner",
  contentinfo: "contentinfo",
  complementary: "complementary",
  region: "region",
  article: "article",
  section: "section",
  list: "list",
  listitem: "listitem",
  button: "button",
  link: "link",
  tab: "tab",
  tabpanel: "tabpanel",
  tablist: "tablist",
  dialog: "dialog",
  alertdialog: "alertdialog",
  alert: "alert",
  status: "status",
  progressbar: "progressbar",
  menu: "menu",
  menuitem: "menuitem",
  menubar: "menubar",
  toolbar: "toolbar",
  grid: "grid",
  gridcell: "gridcell",
  row: "row",
  columnheader: "columnheader",
  rowheader: "rowheader",
} as const;

/**
 * 키보드 단축키 정의
 */
export const shortcuts = {
  ESCAPE: "Escape",
  ENTER: "Enter",
  SPACE: " ",
  TAB: "Tab",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End",
  PAGE_UP: "PageUp",
  PAGE_DOWN: "PageDown",
} as const;

/**
 * 접근성 테스트를 위한 헬퍼 함수들
 */
export const a11yTest = {
  /**
   * 요소가 포커스 가능한지 확인
   */
  isFocusable: (element: HTMLElement): boolean => {
    return element.matches(FOCUSABLE_ELEMENTS);
  },

  /**
   * 요소가 적절한 ARIA 라벨을 가지고 있는지 확인
   */
  hasAccessibleName: (element: HTMLElement): boolean => {
    return !!(
      element.getAttribute("aria-label") ||
      element.getAttribute("aria-labelledby") ||
      element.textContent?.trim()
    );
  },

  /**
   * 색상 대비가 충분한지 확인 (간단한 휴리스틱)
   */
  hasGoodContrast: (element: HTMLElement): boolean => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;

    // 실제 구현에서는 더 정확한 색상 대비 계산이 필요
    // 여기서는 기본적인 체크만 수행
    return color !== backgroundColor;
  },
};

/**
 * React 컴포넌트에서 사용할 수 있는 접근성 훅들
 */
import React from "react";

/**
 * 키보드 네비게이션을 위한 훅
 */
export function useKeyboardNavigation<T extends HTMLElement>(
  items: T[],
  options: {
    loop?: boolean;
    orientation?: "horizontal" | "vertical";
    onActivate?: (item: T, index: number) => void;
  } = {},
) {
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const { loop = true, orientation = "vertical", onActivate } = options;

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      const isVertical = orientation === "vertical";
      const nextKey = isVertical ? shortcuts.ARROW_DOWN : shortcuts.ARROW_RIGHT;
      const prevKey = isVertical ? shortcuts.ARROW_UP : shortcuts.ARROW_LEFT;

      let newIndex = focusedIndex;

      switch (event.key) {
        case nextKey:
          event.preventDefault();
          newIndex = loop
            ? (focusedIndex + 1) % items.length
            : Math.min(focusedIndex + 1, items.length - 1);
          break;
        case prevKey:
          event.preventDefault();
          newIndex = loop
            ? focusedIndex === 0
              ? items.length - 1
              : focusedIndex - 1
            : Math.max(focusedIndex - 1, 0);
          break;
        case shortcuts.HOME:
          event.preventDefault();
          newIndex = 0;
          break;
        case shortcuts.END:
          event.preventDefault();
          newIndex = items.length - 1;
          break;
        case shortcuts.ENTER:
        case shortcuts.SPACE:
          event.preventDefault();
          onActivate?.(items[focusedIndex], focusedIndex);
          return;
        default:
          return;
      }

      setFocusedIndex(newIndex);
      items[newIndex]?.focus();
    },
    [focusedIndex, items, loop, orientation, onActivate],
  );

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
  };
}

/**
 * 스크린 리더 알림을 위한 훅
 */
export function useScreenReaderAnnouncement() {
  const announce = React.useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      announceToScreenReader(message, priority);
    },
    [],
  );

  return announce;
}
