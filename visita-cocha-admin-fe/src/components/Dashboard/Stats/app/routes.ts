import type { RouteConfig } from "@react-router/dev/routes";

export default [
  { index: true, file: "./routes/home.tsx" },
  { path: "dashboard", file: "./routes/dashboard.tsx" },
] satisfies RouteConfig;
