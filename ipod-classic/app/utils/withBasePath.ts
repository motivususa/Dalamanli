const prefix = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefix root-relative URLs for static assets when Next.js `basePath` is set.
 * The browser resolves `/foo` from the origin root; Next serves `public/` under
 * `/basePath/foo`, so fetches must use `/basePath/foo`.
 */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  if (!prefix) return path;
  if (path === prefix || path.startsWith(`${prefix}/`)) return path;
  return `${prefix}${path}`;
}
