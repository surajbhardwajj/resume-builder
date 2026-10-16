import { templateRegistry } from "./templates.js";
import { $, escapeHTML } from "./utils.js";
export function renderTemplateSelector(selected, onSelect) {
    const gallery = $("#templateGallery");
    gallery.innerHTML = templateRegistry
        .map(
            (t) =>
                `<button type="button" class="template-card ${t.id === selected ? "selected" : ""}" data-template="${t.id}" aria-pressed="${t.id === selected}"><div class="template-thumb" style="--mini-accent:${t.id === "minimal" ? "#788294" : "#3867e8"}">${t.id === "sidebar" ? `<div class="mini-side"><div class="mini-line"></div><div class="mini-line"></div><div class="mini-line"></div><div class="mini-line"></div></div>` : ""}<div class="mini-page"><div class="mini-line dark"></div><div class="mini-line accent"></div><div class="mini-line"></div><div class="mini-line short"></div><div class="mini-line"></div><div class="mini-line accent"></div><div class="mini-line"></div><div class="mini-line"></div><div class="mini-line short"></div></div></div><strong>${escapeHTML(t.name)} ${t.id === selected ? '<span class="selected-mark">✓</span>' : ""}</strong><small>${escapeHTML(t.description)}</small><span class="card-category">${escapeHTML(t.category)}</span></button>`,
        )
        .join("");
    gallery.onclick = (e) => {
        const btn = e.target.closest("[data-template]");
        if (btn) onSelect(btn.dataset.template);
    };
}
