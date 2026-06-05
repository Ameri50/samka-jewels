export function resolveImg(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;

  // "/src/assets/p-anillo-luna.jpg" → "/assets/p-anillo-luna.jpg"
  return path.replace(/^\/src\/assets/, "/assets");
}
