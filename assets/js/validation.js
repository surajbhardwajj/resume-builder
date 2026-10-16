import { $, escapeHTML } from "./utils.js";
export function renderQualityChecks(r) {
    const checks = [];
    const add = (ok, title, detail) => checks.push({ ok, title, detail });
    add(
        !!r.personal.fullName.trim(),
        "Full name",
        r.personal.fullName.trim()
            ? "Name is present."
            : "Add your full name near the top of the resume.",
    );
    add(
        !!(r.personal.email.trim() || r.personal.phone.trim()),
        "Contact details",
        r.personal.email.trim() || r.personal.phone.trim()
            ? "At least one direct contact method is present."
            : "Add an email address or phone number.",
    );
    add(
        !!r.summary.trim(),
        "Professional summary",
        r.summary.trim()
            ? "Summary is present."
            : "A concise summary can help establish your fit.",
    );
    add(
        r.experience.length > 0 || r.education.length > 0,
        "Experience or education",
        "Include relevant work experience, education, or both.",
    );
    add(
        r.experience.length === 0 ||
        r.experience.some((x) => x.description?.trim()),
        "Work descriptions",
        r.experience.length === 0
            ? "No work experience entries to review."
            : r.experience.some((x) => x.description?.trim())
                ? "At least one role has a description."
                : "Add impact, responsibilities, and outcomes to your roles.",
    );
    add(
        r.experience.length === 0 ||
        r.experience.some((x) =>
            /\b\d+%|\b\d+\+|\$\s?\d+|\b\d+\s?(users|clients|customers|projects|hours|days)\b/i.test(
                x.description || "",
            ),
        ),
        "Measurable achievements",
        "Where accurate, quantify impact with percentages, scale, time saved, or revenue.",
    );
    const long =
        r.summary.length > 600 ||
        r.experience.reduce((n, e) => n + (e.description || "").length, 0) > 2400;
    add(
        !long,
        "Content length",
        long
            ? "Some content may be overly long. Keep bullets concise and relevant."
            : "No unusually long summary or combined work descriptions detected.",
    );
    const urls = [
        r.personal.linkedin,
        r.personal.github,
        r.personal.portfolio,
        ...r.projects.flatMap((p) => [p.url, p.github]),
    ].filter(Boolean);
    const invalid = urls.some((u) => {
        try {
            return !["http:", "https:"].includes(new URL(u).protocol);
        } catch {
            return true;
        }
    });
    add(
        !invalid,
        "Links and URLs",
        invalid
            ? "Review invalid links. Use full https:// URLs."
            : "Provided links use valid URL formats.",
    );
    const missingDates = r.experience.some((e) => e.title && !e.start);
    add(
        !missingDates,
        "Employment dates",
        missingDates
            ? "Add a start date for each role where available."
            : "No missing work start dates detected.",
    );
    add(
        r.design.template !== "creative" && r.design.template !== "sidebar",
        "ATS-oriented formatting",
        ["minimal", "classic", "academic", "executive"].includes(r.design.template)
            ? "Current layout is relatively text-focused."
            : "Consider a simple, single-column template for ATS submissions.",
    );
    $("#qualityChecks").innerHTML = checks
        .map(
            (c) =>
                `<div class="quality-item ${c.ok ? "" : "warn"}"><span class="quality-icon">${c.ok ? "✓" : "!"}</span><div><strong>${escapeHTML(c.title)}</strong><p>${escapeHTML(c.detail)}</p></div></div>`,
        )
        .join("");
}
