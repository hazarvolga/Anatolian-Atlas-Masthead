import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    // Stage 1: the UI/hooks were copied 1:1 from the Vite app, which uses
    // `any` and legacy effect patterns heavily. Reported as warnings so the
    // Next.js specific rules stay as errors.
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default eslintConfig;
