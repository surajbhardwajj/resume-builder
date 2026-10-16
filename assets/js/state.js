import { uid } from "./utils.js";
export const SECTION_META = [
    { id: "summary", label: "Professional summary", key: "summary" },
    { id: "experience", label: "Work experience", key: "experience" },
    { id: "education", label: "Education", key: "education" },
    { id: "skills", label: "Skills", key: "skills" },
    { id: "projects", label: "Projects", key: "projects" },
    { id: "certifications", label: "Certifications", key: "certifications" },
    { id: "languages", label: "Languages", key: "languages" },
    { id: "achievements", label: "Achievements", key: "achievements" },
];
export function createBlankResume(name = "Untitled resume") {
    return {
        id: uid(),
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        personal: {
            fullName: "",
            title: "",
            email: "",
            phone: "",
            location: "",
            linkedin: "",
            github: "",
            portfolio: "",
            photo: "",
        },
        summary: "",
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        achievements: [],
        customSections: [],
        sectionOrder: [
            "summary",
            "experience",
            "education",
            "skills",
            "projects",
            "certifications",
            "languages",
            "achievements",
        ],
        visibility: {
            summary: true,
            experience: true,
            education: true,
            skills: true,
            projects: true,
            certifications: true,
            languages: true,
            achievements: true,
        },
        design: {
            template: "classic",
            accent: "#3867e8",
            heading: "#1c2638",
            body: "#465166",
            font: "DM Sans, Arial, sans-serif",
            fontSize: 10.5,
            headingSize: 12,
            lineHeight: 1.4,
            margin: 19,
            spacing: 12,
        },
    };
}
export function createExampleResume() {
    const r = createBlankResume("Alex Morgan — Product Designer");
    r.personal = {
        fullName: "Alex Morgan",
        title: "Product Designer",
        email: "alex.morgan@example.com",
        phone: "+1 (555) 014-2870",
        location: "Austin, TX",
        linkedin: "https://linkedin.com/in/alexmorgan",
        github: "https://github.com/alexmorgan",
        portfolio: "https://alexmorgan.design",
        photo: "",
    };
    r.summary =
        "Product designer with 6+ years of experience translating complex problems into intuitive digital products. Combines user research, interaction design, and product strategy to ship accessible experiences that improve customer outcomes.";
    r.experience = [
        {
            id: uid(),
            title: "Senior Product Designer",
            company: "Northstar Labs",
            location: "Austin, TX",
            start: "2022-03",
            end: "",
            current: true,
            description:
                "Led end-to-end design for a B2B analytics platform used by 18,000+ customers.\nImproved activation by 24% through onboarding research and iterative experimentation.\nPartnered with engineering and product to ship a shared design system.",
        },
        {
            id: uid(),
            title: "Product Designer",
            company: "Brightside Digital",
            location: "Remote",
            start: "2019-06",
            end: "2022-02",
            current: false,
            description:
                "Designed responsive web and mobile experiences across three product lines.\nReduced support requests by 17% after simplifying account setup and billing.",
        },
    ];
    r.education = [
        {
            id: uid(),
            degree: "B.S. Human-Computer Interaction",
            institution: "University of Texas at Austin",
            location: "Austin, TX",
            start: "2015-08",
            end: "2019-05",
            grade: "Magna Cum Laude",
            description: "Focus on interaction design and cognitive psychology.",
        },
    ];
    r.skills = [
        {
            id: uid(),
            name: "Product strategy",
            level: "Advanced",
            category: "Design",
        },
        { id: uid(), name: "Figma", level: "Advanced", category: "Tools" },
        { id: uid(), name: "User research", level: "Advanced", category: "Design" },
        { id: uid(), name: "Prototyping", level: "Advanced", category: "Design" },
        {
            id: uid(),
            name: "HTML & CSS",
            level: "Intermediate",
            category: "Technical",
        },
        { id: uid(), name: "Accessibility", level: "Advanced", category: "Design" },
    ];
    r.projects = [
        {
            id: uid(),
            title: "Atlas Analytics",
            description:
                "Redesigned core reporting workflows, reducing time-to-insight by 31%.",
            technologies: "Figma, Research, Prototyping",
            url: "https://example.com/atlas",
            github: "",
        },
    ];
    r.certifications = [
        {
            id: uid(),
            name: "Google UX Design Professional Certificate",
            issuer: "Google",
            date: "2021",
        },
    ];
    r.languages = [
        { id: uid(), name: "English", level: "Native" },
        { id: uid(), name: "Spanish", level: "Conversational" },
    ];
    r.achievements = [
        {
            id: uid(),
            title: "Design Excellence Award",
            description:
                "Recognized for improving onboarding accessibility and completion.",
        },
    ];
    return r;
}
export function normalizeResume(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
        throw new Error("The file must contain a resume object.");
    const base = createBlankResume(
        typeof raw.name === "string" ? raw.name : "Imported resume",
    );
    const allowedArrays = [
        "experience",
        "education",
        "skills",
        "projects",
        "certifications",
        "languages",
        "achievements",
        "customSections",
    ];
    const out = {
        ...base,
        ...raw,
        id: typeof raw.id === "string" ? raw.id : base.id,
        personal: {
            ...base.personal,
            ...(raw.personal && typeof raw.personal === "object" ? raw.personal : {}),
        },
        design: {
            ...base.design,
            ...(raw.design && typeof raw.design === "object" ? raw.design : {}),
        },
        visibility: {
            ...base.visibility,
            ...(raw.visibility && typeof raw.visibility === "object"
                ? raw.visibility
                : {}),
        },
    };
    for (const key of allowedArrays) {
        if (!Array.isArray(raw[key])) out[key] = [];
        else
            out[key] = raw[key]
                .slice(0, 200)
                .map((item) => ({
                    ...item,
                    id: typeof item?.id === "string" ? item.id : uid(),
                }));
    }
    if (typeof out.summary !== "string") out.summary = "";
    const validKeys = [
        "summary",
        "experience",
        "education",
        "skills",
        "projects",
        "certifications",
        "languages",
        "achievements",
        ...out.customSections.map((s) => s.id),
    ];
    out.sectionOrder = Array.isArray(raw.sectionOrder)
        ? raw.sectionOrder.filter(
            (x, i, a) => validKeys.includes(x) && a.indexOf(x) === i,
        )
        : base.sectionOrder;
    for (const key of base.sectionOrder)
        if (!out.sectionOrder.includes(key)) out.sectionOrder.push(key);
    for (const k of [
        "fullName",
        "title",
        "email",
        "phone",
        "location",
        "linkedin",
        "github",
        "portfolio",
        "photo",
    ])
        if (typeof out.personal[k] !== "string") out.personal[k] = "";
    if (!/^#[0-9a-f]{6}$/i.test(out.design.accent))
        out.design.accent = base.design.accent;
    return out;
}
