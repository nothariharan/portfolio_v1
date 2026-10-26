import type { NextConfig } from "next";
import path from "path";

// Pin the project root HERE. A leftover package-lock.json in the user home
// folder made Turbopack treat all of C:\Users\HARIHARAN as the workspace,
// so every request recompiled against a huge filesystem and took minutes.
const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  // Dev server binds as localhost. Opening 127.0.0.1 is a different origin,
  // so Next blocks HMR and the page never finishes loading.
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
  reactCompiler: true,
  devIndicators: false,
};

export default nextConfig;
