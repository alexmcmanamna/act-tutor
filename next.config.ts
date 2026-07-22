import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the parent OneDrive home directory was
  // making Next.js infer the workspace root one level too high, which put
  // Turbopack's filesystem watcher/cache in scope of the whole home
  // directory and caused flaky, corrupted dev chunks. Pin the root
  // explicitly to this project.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
