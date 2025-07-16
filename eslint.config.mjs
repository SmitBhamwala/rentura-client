import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  {
    ignorePatterns: ["prismaTypes.d.ts"]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      // "@typescript-eslint/no-unused-vars": "off",
      // "@typescript-eslint/no-empty-object-type": "off",
      // "@typescript-eslint/no-unnecessary-type-constraint": "off",
      // "@typescript-eslint/no-wrapper-object-types": "off",
      // "@typescript-eslint/no-unsafe-function-type": "off",
    }
  }
];

export default eslintConfig;
