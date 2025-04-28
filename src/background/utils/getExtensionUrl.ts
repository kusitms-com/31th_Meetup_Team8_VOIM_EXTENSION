export function getExtensionUrl(path: string): string {
    if (
        typeof chrome !== "undefined" &&
        chrome.runtime &&
        chrome.runtime.getURL
    ) {
        return chrome.runtime.getURL(path);
    } else {
        return `/images/${path}`;
    }
}
