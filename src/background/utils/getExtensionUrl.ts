export function getExtensionUrl(path: string): string {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;

    if (
        typeof chrome !== "undefined" &&
        chrome.runtime &&
        chrome.runtime.getURL
    ) {
        return chrome.runtime.getURL(cleanPath);
    } else {
        return `/images/${cleanPath}`;
    }
}
