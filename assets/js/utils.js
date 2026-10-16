export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
];
export const uid = () =>
    crypto?.randomUUID?.() ||
    `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
export const escapeHTML = (value) =>
    String(value ?? "").replace(
        /[&<>"']/g,
        (c) =>
            ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
            c
            ],
    );
export const safeURL = (value) => {
    try {
        const u = new URL(String(value));
        return ["http:", "https:"].includes(u.protocol) ? u.href : "";
    } catch {
        return "";
    }
};
export const debounce = (fn, wait = 350) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), wait);
    };
};
export function toast(message, type = "success") {
    const region = $("#toastRegion");
    if (!region) return;
    const el = document.createElement("div");
    el.className = `toast ${type === "error" ? "error" : ""}`;
    el.textContent = message;
    region.append(el);
    setTimeout(() => el.remove(), 3600);
}
export const confirmAction = (message) => window.confirm(message);
export const formatDateRange = (start, end, current) =>
    [start, end || (current ? "Present" : "")].filter(Boolean).join(" — ");
export function downloadFile(filename, content, type = "application/json") {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
