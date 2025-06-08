//  @ts-check
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

import { tanstackConfig } from "@tanstack/eslint-config";

const recommendedConfigs = tseslint.configs.recommended;

// error를 warn으로 변환할 룰들만 추출
const warnOverrideRules = {};

recommendedConfigs.forEach((config) => {
  if (!config.rules) {
    return;
  }

  for (const ruleName in config.rules) {
    const ruleValue = config.rules[ruleName];

    if (Array.isArray(ruleValue) && ruleValue[0] === "error") {
      warnOverrideRules[ruleName] = ["warn", ...ruleValue.slice(1)];
    } else if (ruleValue === "error") {
      warnOverrideRules[ruleName] = "warn";
    }
  }
});

export default tseslint.config({
  extends: [...tanstackConfig],
  plugins: {
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
  },
  rules: {
    "@typescript-eslint/array-type": "off",
    "sort-imports": "off",
    "import/order": "off",
    "import/consistent-type-specifier-style": "off",
    "import/no-cycle": "off",
    ...warnOverrideRules, // warn으로 변환된 룰들을 덮어씌움
  },
});
