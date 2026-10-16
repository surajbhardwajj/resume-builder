import { escapeHTML, safeURL, formatDateRange } from "./utils.js";
const text = (v) => escapeHTML(v || "");
const link = (label, url) => {
    const safe = safeURL(url);
    return safe
        ? `<a href="${safe}">${text(label || safe.replace(/^https?:\/\//, ""))}</a>`
        : "";
};
const contact = (p) =>
    [
        p.email,
        p.phone,
        p.location,
        p.linkedin && link("LinkedIn", p.linkedin),
        p.github && link("GitHub", p.github),
        p.portfolio && link("Portfolio", p.portfolio),
    ]
        .filter(Boolean)
        .map((v) => `<span>${v}</span>`)
        .join("");
function section(id, title, body) {
    return `<section class="resume-section" data-section="${text(id)}"><h2>${text(title)}</h2>${body || '<p class="resume-empty">Add content in the editor.</p>'}</section>`;
}
function entry(title, subtitle, meta, description, extra = "") {
    return `<article class="resume-entry"><div class="entry-top"><h3>${text(title)}</h3><span class="entry-meta">${text(meta)}</span></div>${subtitle ? `<div class="entry-sub">${text(subtitle)}</div>` : ""}${description ? `<p class="entry-description">${text(description)}</p>` : ""}${extra}</article>`;
}
function renderExperience(r) {
    return r.experience
        .map((e) =>
            entry(
                e.title,
                e.company + (e.location ? ` · ${e.location}` : ""),
                formatDateRange(e.start, e.end, e.current),
                e.description,
            ),
        )
        .join("");
}
function renderEducation(r) {
    return r.education
        .map((e) =>
            entry(
                e.degree,
                e.institution + (e.location ? ` · ${e.location}` : ""),
                formatDateRange(e.start, e.end, false),
                [e.grade, e.description].filter(Boolean).join(" · "),
            ),
        )
        .join("");
}
function renderSkills(r, technical = false) {
    return `<div class="skill-list">${r.skills.map((s) => `<span class="skill-chip">${text(s.name)}${s.level && s.level !== "Not specified" ? ` · ${text(s.level)}` : ""}</span>`).join("")}</div>`;
}
function renderProjects(r, technical = false) {
    return r.projects
        .map((p) =>
            entry(
                p.title,
                "",
                "",
                p.description,
                `${p.technologies ? `<div class="tech-list">${text(p.technologies)}</div>` : ""}${p.url || p.github ? `<p>${[link("Project", p.url), link("GitHub", p.github)].filter(Boolean).join(" · ")}</p>` : ""}`,
            ),
        )
        .join("");
}
function renderCerts(r) {
    return r.certifications
        .map((c) => entry(c.name, c.issuer, c.date, ""))
        .join("");
}
function renderLanguages(r) {
    return r.languages.map((l) => entry(l.name, "", l.level, "")).join("");
}
function renderAchievements(r) {
    return r.achievements
        .map((a) => entry(a.title, "", "", a.description))
        .join("");
}
function renderCustom(s) {
    return (s.entries || [])
        .map((e) =>
            entry(
                e.title || e.name || "",
                "",
                e.date || "",
                e.content || e.description || "",
            ),
        )
        .join("");
}
export const templateRegistry = [
    {
        id: "classic",
        name: "Classic Professional",
        category: "Professional",
        description: "Timeless single-column structure.",
        render: renderClassic,
    },
    {
        id: "sidebar",
        name: "Modern Sidebar",
        category: "Modern",
        description: "Color-blocked sidebar with clear hierarchy.",
        render: renderSidebar,
    },
    {
        id: "minimal",
        name: "Minimal ATS",
        category: "ATS-friendly",
        description: "Text-first and parser-conscious.",
        render: renderMinimal,
    },
    {
        id: "executive",
        name: "Executive",
        category: "Executive",
        description: "Refined typography and achievement focus.",
        render: renderExecutive,
    },
    {
        id: "creative",
        name: "Creative",
        category: "Creative",
        description: "Expressive accent details and section markers.",
        render: renderCreative,
    },
    {
        id: "developer",
        name: "Technical Developer",
        category: "Technical",
        description: "Compact projects and technology details.",
        render: renderDeveloper,
    },
    {
        id: "elegant",
        name: "Elegant Minimal",
        category: "Minimal",
        description: "Centered header and generous whitespace.",
        render: renderElegant,
    },
    {
        id: "academic",
        name: "Academic",
        category: "Academic",
        description: "Traditional structure for research and education.",
        render: renderAcademic,
    },
];
function orderedSections(r) {
    const map = {
        summary: () =>
            r.summary
                ? section(
                    "summary",
                    "Professional Summary",
                    `<p>${text(r.summary)}</p>`,
                )
                : "",
        experience: () => section("experience", "Experience", renderExperience(r)),
        education: () => section("education", "Education", renderEducation(r)),
        skills: () => section("skills", "Skills", renderSkills(r)),
        projects: () => section("projects", "Projects", renderProjects(r)),
        certifications: () =>
            section("certifications", "Certifications", renderCerts(r)),
        languages: () => section("languages", "Languages", renderLanguages(r)),
        achievements: () =>
            section("achievements", "Achievements", renderAchievements(r)),
    };
    for (const s of r.customSections)
        map[s.id] = () =>
            section(s.id, s.title || "Additional Information", renderCustom(s));
    return r.sectionOrder
        .map((id) => {
            if (r.visibility[id] === false) return "";
            return map[id]
                ? map[id]()
                : r.customSections.some((s) => s.id === id)
                    ? map[id]()
                    : "";
        })
        .join("");
}
function header(r, variant = "") {
    const p = r.personal;
    return `<header class="resume-header ${variant}"><div class="photo-wrap">${p.photo ? `<img class="resume-photo" src="${p.photo}" alt="Profile photo">` : ""}<h1>${text(p.fullName || "Your Name")}</h1><p class="resume-title">${text(p.title || "Professional Title")}</p><div class="contact-line">${contact(p)}</div></div></header>`;
}
function renderClassic(r) {
    return `<div class="resume-page">${header(r)}${orderedSections(r)}</div>`;
}
function renderMinimal(r) {
    return `<div class="resume-page">${header(r)}${orderedSections(r)}</div>`;
}
function renderExecutive(r) {
    return `<div class="resume-page">${header(r)}${orderedSections(r)}</div>`;
}
function renderCreative(r) {
    return `<div class="resume-page">${header(r)}${orderedSections(r)}</div>`;
}
function renderDeveloper(r) {
    return `<div class="resume-page">${header(r)}${orderedSections(r)}</div>`;
}
function renderElegant(r) {
    return `<div class="resume-page">${header(r)}${orderedSections(r)}</div>`;
}
function renderAcademic(r) {
    const ordered = [...r.sectionOrder].sort((a, b) => {
        const rank = (x) =>
            ({
                education: 0,
                experience: 1,
                projects: 2,
                certifications: 3,
                achievements: 4,
                skills: 5,
                summary: 6,
            })[x] ?? 7;
        return rank(a) - rank(b);
    });
    const clone = { ...r, sectionOrder: ordered };
    return `<div class="resume-page">${header(clone)}${orderedSections(clone)}</div>`;
}
function renderSidebar(r) {
    const p = r.personal;
    const sideIds = ["skills", "languages", "certifications"];
    const side = sideIds
        .map((id) =>
            r.visibility[id] !== false
                ? {
                    skills: () => section("skills", "Skills", renderSkills(r)),
                    languages: () =>
                        section("languages", "Languages", renderLanguages(r)),
                    certifications: () =>
                        section("certifications", "Certifications", renderCerts(r)),
                }[id]()
                : "",
        )
        .join("");
    const mainOrder = r.sectionOrder.filter((id) => !sideIds.includes(id));
    const clone = { ...r, sectionOrder: mainOrder };
    return `<div class="resume-page"><div class="resume-columns"><aside class="side-column"><div class="resume-sidebar-header">${p.photo ? `<img class="resume-photo" src="${p.photo}" alt="Profile photo">` : ""}<h1>${text(p.fullName || "Your Name")}</h1><p class="resume-title">${text(p.title || "Professional Title")}</p><div class="contact-line">${contact(p)}</div></div>${side}</aside><main class="main-column">${orderedSections(clone)}</main></div></div>`;
}
export function renderTemplate(templateId, resume) {
    const t =
        templateRegistry.find((x) => x.id === templateId) || templateRegistry[0];
    return t.render(resume);
}
