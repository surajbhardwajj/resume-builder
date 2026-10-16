import { $, $$, toast } from "./utils.js";
export const palettes = [
    {
        name: "Professional blue",
        accent: "#3867e8",
        heading: "#1c2638",
        body: "#465166",
    },
    { name: "Charcoal", accent: "#343a46", heading: "#20232a", body: "#454b55" },
    { name: "Emerald", accent: "#167a62", heading: "#173a32", body: "#40584f" },
    { name: "Burgundy", accent: "#8d2945", heading: "#39202b", body: "#594650" },
    { name: "Teal", accent: "#087e8b", heading: "#183a42", body: "#435a60" },
    {
        name: "Black & white",
        accent: "#292d33",
        heading: "#17191d",
        body: "#4a4d52",
    },
];
export function renderPalettes(selected, onSelect) {
    $("#paletteChoices").innerHTML = palettes
        .map(
            (p) =>
                `<button class="palette-choice ${p.accent === selected ? "active" : ""}" type="button" data-palette="${p.name}"><span class="palette-swatches"><i style="background:${p.accent}"></i><i style="background:${p.heading}"></i><i style="background:${p.body}"></i></span>${p.name}</button>`,
        )
        .join("");
    $("#paletteChoices").onclick = (e) => {
        const b = e.target.closest("[data-palette]");
        if (b) {
            const p = palettes.find((x) => x.name === b.dataset.palette);
            onSelect(p);
        }
    };
}
export function bindThemeControls(resume, update) {
    const d = resume.design;
    const map = {
        accentColor: ["accent", "color"],
        headingColor: ["heading", "color"],
        bodyColor: ["body", "color"],
        fontFamily: ["font", "value"],
        fontSize: ["fontSize", "number"],
        headingSize: ["headingSize", "number"],
        lineHeight: ["lineHeight", "number"],
        pageMargin: ["margin", "number"],
        sectionSpacing: ["spacing", "number"],
    };
    for (const [id, [key, type]] of Object.entries(map)) {
        const el = $("#" + id);
        if (!el) continue;
        el.value = d[key];
        const apply = () => {
            let value = type === "number" ? Number(el.value) : el.value;
            if (key === "accent" && !/^#[0-9a-f]{6}$/i.test(value)) return;
            resume.design[key] = value;
            if (key === "accent") $("#accentHex").value = value;
            if (key === "fontSize") $("#fontSizeLabel").textContent = `${value} pt`;
            if (key === "headingSize")
                $("#headingSizeLabel").textContent = `${value} pt`;
            if (key === "lineHeight")
                $("#lineHeightLabel").textContent = value.toFixed(1);
            if (key === "spacing") $("#spacingLabel").textContent = `${value} px`;
            update();
        };
        el.oninput = apply;
        el.onchange = apply;
    }
    $("#accentHex").value = d.accent;
    $("#accentHex").onchange = () => {
        const v = $("#accentHex").value.trim();
        if (/^#[0-9a-f]{6}$/i.test(v)) {
            resume.design.accent = v;
            $("#accentColor").value = v;
            update();
        } else toast("Enter a valid hex color, for example #3867e8.", "error");
    };
}
export function resetDesign(resume) {
    resume.design = {
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
    };
}
