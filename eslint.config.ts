import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

const recommendedConfigs = tseslint.configs.recommended;

const configsWithWarn = recommendedConfigs.map((config) => {
  if (!config.rules) {
    return config;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newRules: Record<string, any> = {};

  for (const ruleName in config.rules) {
    const ruleValue = config.rules[ruleName];

    if (Array.isArray(ruleValue) && ruleValue[0] === "error") {
      newRules[ruleName] = ["warn", ...ruleValue.slice(1)];
    } else if (ruleValue === "error") {
      newRules[ruleName] = "warn";
    } else {
      newRules[ruleName] = ruleValue;
    }
  }

  return {
    ...config,
    rules: newRules,
  };
});

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...configsWithWarn],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
);
