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
  experimental: {
    // Turbopack's persistent dev cache (.next/cache/turbopack) is a set of
    // RocksDB-style LSM files. Since this project lives inside a
    // OneDrive-synced folder, OneDrive's background sync can touch those
    // files mid-write and corrupt the cache ("Failed to open database" /
    // "invalid digit found in string" on next dev startup). Disabling it
    // trades away some rebuild-speed for reliability in this environment.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
