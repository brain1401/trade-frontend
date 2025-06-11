//  @ts-check
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

import { tanstackConfig } from "@tanstack/eslint-config";

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
  },
});
