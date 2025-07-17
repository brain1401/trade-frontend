/**
 * Accessibility testing utilities for automated a11y checks
 */

// Color contrast calculation utilities
export const colorUtils = {
  /**
   * Parse RGB color string to RGB values
   */
  parseRgb(color: string): { r: number; g: number; b: number } | null {
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3]),
      };
    }

    // Handle hex colors
    const hexMatch = color.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (hexMatch) {
      return {
        r: parseInt(hexMatch[1], 16),
        g: parseInt(hexMatch[2], 16),
        b: parseInt(hexMatch[3], 16),
      };
    }

    return null;
  },

  /**
   * Calculate relative luminance of a color
   */
  getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.parseRgb(color1);
    const rgb2 = this.parseRgb(color2);

    if (!rgb1 || !rgb2) return 1;

    const lum1 = this.getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = this.getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  },

  /**
   * Check if contrast ratio meets WCAG standards
   */
  meetsWCAGAA(contrastRatio: number, isLargeText = false): boolean {
    return contrastRatio >= (isLargeText ? 3 : 4.5);
  },

  /**
   * Check if contrast ratio meets WCAG AAA standards
   */
  meetsWCAGAAA(contrastRatio: number, isLargeText = false): boolean {
    return contrastRatio >= (isLargeText ? 4.5 : 7);
  },
};

// Touch target size validation
export const touchUtils = {
  /**
   * Check if element meets minimum touch target size (44px)
   */
  meetsMinimumTouchSize(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    const styles = window.getComputedStyle(element);

    const width = Math.max(rect.width, parseFloat(styles.minWidth) || 0);
    const height = Math.max(rect.height, parseFloat(styles.minHeight) || 0);

    return width >= 44 && height >= 44;
  },

  /**
   * Get all interactive elements that should meet touch target requirements
   */
  getInteractiveElements(container: Element = document.body): Element[] {
    const selectors = [
      "button",
      "a[href]",
      'input:not([type="hidden"])',
      "select",
      "textarea",
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]',
      '[role="link"]',
      '[role="menuitem"]',
      '[role="tab"]',
    ];

    return Array.from(container.querySelectorAll(selectors.join(", ")));
  },

  /**
   * Validate all touch targets in container
   */
  validateTouchTargets(container: Element = document.body): {
    passed: Element[];
    failed: Element[];
  } {
    const interactiveElements = this.getInteractiveElements(container);
    const passed: Element[] = [];
    const failed: Element[] = [];

    interactiveElements.forEach((element) => {
      if (this.meetsMinimumTouchSize(element)) {
        passed.push(element);
      } else {
        failed.push(element);
      }
    });

    return { passed, failed };
  },
};

// Keyboard navigation utilities
export const keyboardUtils = {
  /**
   * Get all focusable elements in container
   */
  getFocusableElements(container: Element = document.body): Element[] {
    const selectors = [
      "button:not([disabled])",
      "a[href]",
      'input:not([disabled]):not([type="hidden"])',
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      '[contenteditable="true"]',
    ];

    return Array.from(container.querySelectorAll(selectors.join(", "))).filter(
      (element) => {
        const styles = window.getComputedStyle(element);
        return styles.display !== "none" && styles.visibility !== "hidden";
      },
    );
  },

  /**
   * Check if element has proper keyboard event handlers
   */
  hasKeyboardSupport(element: Element): boolean {
    const events = ["keydown", "keyup", "keypress"];
    return events.some((event) => {
      const listeners = (element as any).getEventListeners?.(event);
      return listeners && listeners.length > 0;
    });
  },

  /**
   * Validate tab order is logical
   */
  validateTabOrder(container: Element = document.body): {
    elements: Element[];
    issues: string[];
  } {
    const focusableElements = this.getFocusableElements(container);
    const issues: string[] = [];

    // Check for elements with positive tabindex (anti-pattern)
    focusableElements.forEach((element, index) => {
      const tabIndex = element.getAttribute("tabindex");
      if (tabIndex && parseInt(tabIndex) > 0) {
        issues.push(
          `Element at index ${index} has positive tabindex (${tabIndex}), which can disrupt natural tab order`,
        );
      }
    });

    return { elements: focusableElements, issues };
  },
};

// ARIA validation utilities
export const ariaUtils = {
  /**
   * Check if element has proper ARIA labeling
   */
  hasProperLabeling(element: Element): boolean {
    const ariaLabel = element.getAttribute("aria-label");
    const ariaLabelledBy = element.getAttribute("aria-labelledby");
    const ariaDescribedBy = element.getAttribute("aria-describedby");
    const textContent = element.textContent?.trim();

    // For form elements, check for associated labels
    if (
      element.tagName.toLowerCase() === "input" ||
      element.tagName.toLowerCase() === "select" ||
      element.tagName.toLowerCase() === "textarea"
    ) {
      const id = element.getAttribute("id");
      const associatedLabel = id
        ? document.querySelector(`label[for="${id}"]`)
        : null;
      return !!(ariaLabel || ariaLabelledBy || associatedLabel || textContent);
    }

    // For other interactive elements
    return !!(ariaLabel || ariaLabelledBy || textContent);
  },

  /**
   * Validate ARIA roles are used correctly
   */
  validateAriaRoles(container: Element = document.body): {
    validRoles: Element[];
    invalidRoles: { element: Element; role: string; issue: string }[];
  } {
    const elementsWithRoles = Array.from(container.querySelectorAll("[role]"));
    const validRoles: Element[] = [];
    const invalidRoles: { element: Element; role: string; issue: string }[] =
      [];

    const validRolesList = [
      "alert",
      "alertdialog",
      "application",
      "article",
      "banner",
      "button",
      "cell",
      "checkbox",
      "columnheader",
      "combobox",
      "complementary",
      "contentinfo",
      "dialog",
      "directory",
      "document",
      "feed",
      "figure",
      "form",
      "grid",
      "gridcell",
      "group",
      "heading",
      "img",
      "link",
      "list",
      "listbox",
      "listitem",
      "log",
      "main",
      "marquee",
      "math",
      "menu",
      "menubar",
      "menuitem",
      "menuitemcheckbox",
      "menuitemradio",
      "navigation",
      "none",
      "note",
      "option",
      "presentation",
      "progressbar",
      "radio",
      "radiogroup",
      "region",
      "row",
      "rowgroup",
      "rowheader",
      "scrollbar",
      "search",
      "searchbox",
      "separator",
      "slider",
      "spinbutton",
      "status",
      "switch",
      "tab",
      "table",
      "tablist",
      "tabpanel",
      "term",
      "textbox",
      "timer",
      "toolbar",
      "tooltip",
      "tree",
      "treegrid",
      "treeitem",
    ];

    elementsWithRoles.forEach((element) => {
      const role = element.getAttribute("role");
      if (role) {
        if (validRolesList.includes(role)) {
          validRoles.push(element);
        } else {
          invalidRoles.push({
            element,
            role,
            issue: `Invalid ARIA role: ${role}`,
          });
        }
      }
    });

    return { validRoles, invalidRoles };
  },

  /**
   * Check for required ARIA properties
   */
  validateRequiredAriaProperties(element: Element): string[] {
    const role = element.getAttribute("role");
    const issues: string[] = [];

    // Define required properties for common roles
    const requiredProperties: Record<string, string[]> = {
      button: [],
      checkbox: ["aria-checked"],
      combobox: ["aria-expanded"],
      listbox: [],
      menuitem: [],
      option: ["aria-selected"],
      radio: ["aria-checked"],
      slider: ["aria-valuenow", "aria-valuemin", "aria-valuemax"],
      spinbutton: ["aria-valuenow"],
      switch: ["aria-checked"],
      tab: ["aria-selected"],
      tabpanel: ["aria-labelledby"],
      textbox: [],
    };

    if (role && requiredProperties[role]) {
      requiredProperties[role].forEach((property) => {
        if (!element.hasAttribute(property)) {
          issues.push(
            `Missing required ARIA property: ${property} for role ${role}`,
          );
        }
      });
    }

    return issues;
  },
};

// Semantic HTML validation
export const semanticUtils = {
  /**
   * Check for proper heading hierarchy
   */
  validateHeadingHierarchy(container: Element = document.body): {
    headings: { element: Element; level: number; text: string }[];
    issues: string[];
  } {
    const headings = Array.from(
      container.querySelectorAll("h1, h2, h3, h4, h5, h6"),
    ).map((element) => ({
      element,
      level: parseInt(element.tagName.charAt(1)),
      text: element.textContent?.trim() || "",
    }));

    const issues: string[] = [];

    // Check for h1 presence
    const h1Count = headings.filter((h) => h.level === 1).length;
    if (h1Count === 0) {
      issues.push("No h1 element found - page should have exactly one h1");
    } else if (h1Count > 1) {
      issues.push(
        `Multiple h1 elements found (${h1Count}) - page should have exactly one h1`,
      );
    }

    // Check for proper nesting
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i];
      const previous = headings[i - 1];

      if (current.level > previous.level + 1) {
        issues.push(
          `Heading level jumps from h${previous.level} to h${current.level} - should not skip levels`,
        );
      }
    }

    return { headings, issues };
  },

  /**
   * Check for proper landmark usage
   */
  validateLandmarks(container: Element = document.body): {
    landmarks: { element: Element; role: string; label?: string }[];
    issues: string[];
  } {
    const landmarkSelectors = [
      'header, [role="banner"]',
      'nav, [role="navigation"]',
      'main, [role="main"]',
      'aside, [role="complementary"]',
      'footer, [role="contentinfo"]',
      '[role="search"]',
      '[role="form"]',
      '[role="region"]',
    ];

    const landmarks = landmarkSelectors.flatMap((selector) =>
      Array.from(container.querySelectorAll(selector)).map((element) => ({
        element,
        role: element.getAttribute("role") || element.tagName.toLowerCase(),
        label:
          element.getAttribute("aria-label") ||
          element.getAttribute("aria-labelledby"),
      })),
    );

    const issues: string[] = [];

    // Check for main landmark
    const mainLandmarks = landmarks.filter((l) => l.role === "main");
    if (mainLandmarks.length === 0) {
      issues.push(
        "No main landmark found - page should have exactly one main element",
      );
    } else if (mainLandmarks.length > 1) {
      issues.push(
        `Multiple main landmarks found (${mainLandmarks.length}) - page should have exactly one main element`,
      );
    }

    return { landmarks, issues };
  },
};

// Performance testing utilities
export const performanceUtils = {
  /**
   * Measure component render time
   */
  measureRenderTime<T>(renderFn: () => T): { result: T; renderTime: number } {
    const startTime = performance.now();
    const result = renderFn();
    const endTime = performance.now();

    return {
      result,
      renderTime: endTime - startTime,
    };
  },

  /**
   * Create performance observer for specific metrics
   */
  createPerformanceObserver(
    entryTypes: string[],
    callback: (entries: PerformanceEntry[]) => void,
  ): PerformanceObserver | null {
    if (typeof PerformanceObserver === "undefined") {
      return null;
    }

    const observer = new PerformanceObserver((list) => {
      callback(list.getEntries());
    });

    try {
      observer.observe({ entryTypes });
      return observer;
    } catch (error) {
      console.warn("Performance observer not supported:", error);
      return null;
    }
  },

  /**
   * Simulate slow network conditions
   */
  simulateSlowNetwork(delay: number = 1000): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
  },

  /**
   * Monitor memory usage (if available)
   */
  getMemoryUsage(): {
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
    jsHeapSizeLimit?: number;
  } {
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
    return {};
  },
};

// Comprehensive accessibility audit
export const accessibilityAudit = {
  /**
   * Run complete accessibility audit on container
   */
  audit(container: Element = document.body): {
    colorContrast: { passed: number; failed: number; issues: string[] };
    touchTargets: { passed: number; failed: number; issues: string[] };
    keyboard: { passed: number; failed: number; issues: string[] };
    aria: { passed: number; failed: number; issues: string[] };
    semantic: { passed: number; failed: number; issues: string[] };
    overall: { score: number; grade: "A" | "B" | "C" | "D" | "F" };
  } {
    const results = {
      colorContrast: { passed: 0, failed: 0, issues: [] as string[] },
      touchTargets: { passed: 0, failed: 0, issues: [] as string[] },
      keyboard: { passed: 0, failed: 0, issues: [] as string[] },
      aria: { passed: 0, failed: 0, issues: [] as string[] },
      semantic: { passed: 0, failed: 0, issues: [] as string[] },
      overall: { score: 0, grade: "F" as const },
    };

    // Color contrast audit
    const textElements = Array.from(container.querySelectorAll("*")).filter(
      (el) => {
        const text = el.textContent?.trim();
        return text && text.length > 0 && el.children.length === 0;
      },
    );

    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      if (color && backgroundColor && color !== backgroundColor) {
        const contrastRatio = colorUtils.getContrastRatio(
          color,
          backgroundColor,
        );
        if (colorUtils.meetsWCAGAA(contrastRatio)) {
          results.colorContrast.passed++;
        } else {
          results.colorContrast.failed++;
          results.colorContrast.issues.push(
            `Low contrast ratio (${contrastRatio.toFixed(2)}:1) on element: ${element.tagName}`,
          );
        }
      }
    });

    // Touch targets audit
    const touchValidation = touchUtils.validateTouchTargets(container);
    results.touchTargets.passed = touchValidation.passed.length;
    results.touchTargets.failed = touchValidation.failed.length;
    touchValidation.failed.forEach((element) => {
      results.touchTargets.issues.push(
        `Touch target too small: ${element.tagName}`,
      );
    });

    // Keyboard navigation audit
    const keyboardValidation = keyboardUtils.validateTabOrder(container);
    results.keyboard.passed =
      keyboardValidation.elements.length - keyboardValidation.issues.length;
    results.keyboard.failed = keyboardValidation.issues.length;
    results.keyboard.issues = keyboardValidation.issues;

    // ARIA audit
    const ariaValidation = ariaUtils.validateAriaRoles(container);
    results.aria.passed = ariaValidation.validRoles.length;
    results.aria.failed = ariaValidation.invalidRoles.length;
    ariaValidation.invalidRoles.forEach(({ issue }) => {
      results.aria.issues.push(issue);
    });

    // Semantic HTML audit
    const headingValidation = semanticUtils.validateHeadingHierarchy(container);
    const landmarkValidation = semanticUtils.validateLandmarks(container);
    results.semantic.passed =
      headingValidation.headings.length +
      landmarkValidation.landmarks.length -
      headingValidation.issues.length -
      landmarkValidation.issues.length;
    results.semantic.failed =
      headingValidation.issues.length + landmarkValidation.issues.length;
    results.semantic.issues = [
      ...headingValidation.issues,
      ...landmarkValidation.issues,
    ];

    // Calculate overall score
    const totalTests = Object.values(results).reduce((sum, category) => {
      if ("passed" in category && "failed" in category) {
        return sum + category.passed + category.failed;
      }
      return sum;
    }, 0);

    const totalPassed = Object.values(results).reduce((sum, category) => {
      if ("passed" in category) {
        return sum + category.passed;
      }
      return sum;
    }, 0);

    results.overall.score =
      totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

    // Assign grade based on score
    if (results.overall.score >= 90) results.overall.grade = "A";
    else if (results.overall.score >= 80) results.overall.grade = "B";
    else if (results.overall.score >= 70) results.overall.grade = "C";
    else if (results.overall.score >= 60) results.overall.grade = "D";
    else results.overall.grade = "F";

    return results;
  },
};
