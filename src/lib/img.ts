// Resolve image paths stored in the DB as "/src/assets/foo.jpg" to the
// actual bundled URL produced by Vite.
const assetMap = import.meta.glob("/src/assets/*", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

export function resolveImg(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return assetMap[path] ?? path;
}
