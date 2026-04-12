const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

export function resolveImageUrl(imagePath) {
  if (!imagePath) return "";

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }

  const cleanedPath = imagePath.replace(/\\/g, "/").replace(/^\/+/, "");

  if (!BACKEND_URL) return "";

  if (cleanedPath.startsWith("media/")) {
    return `${BACKEND_URL}/${cleanedPath}`;
  }

  if (
    cleanedPath.endsWith(".png") ||
    cleanedPath.endsWith(".jpg") ||
    cleanedPath.endsWith(".jpeg") ||
    cleanedPath.endsWith(".webp") ||
    cleanedPath.endsWith(".avif")
  ) {
    return `${BACKEND_URL}/media/${cleanedPath}`;
  }

  return `${BACKEND_URL}/${cleanedPath}`;
}