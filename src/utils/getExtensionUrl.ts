export function getExtensionUrl(path: string = ""): string {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return chrome.runtime.getURL(cleanPath);
}
