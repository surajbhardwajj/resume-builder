# Forma Resume Builder

A responsive, browser-only resume editor built with HTML5, CSS3, and Vanilla JavaScript ES modules. No backend, build process, package manager, or framework is required.

## Features

- Live resume preview with eight structurally different templates.
- Personal information, summary, work experience, education, skills, projects, certifications, languages, achievements, and custom sections.
- Design controls for palette, custom colors, typography, spacing, and page margins.
- Section visibility and ordering controls.
- Local browser library for multiple resumes, with rename, duplicate, load, and confirmed delete actions.
- Debounced LocalStorage persistence and JSON backup/import.
- Browser print-to-PDF with A4 print CSS.
- Practical resume quality checklist.
- Responsive editor and preview.

## Run locally

ES modules generally need an HTTP origin; use VS Code Live Server rather than opening `index.html` directly.

1. Extract the project folder.
2. Open `resume-builder/` in VS Code.
3. Install the **Live Server** extension if needed.
4. Right-click `index.html` and select **Open with Live Server**.
5. Edit any field and watch the document preview update.

Google Fonts are optional and require an internet connection. System font fallbacks are included.

## Persistence and privacy

Resume content is stored in `localStorage` in the current browser profile. It is not cloud synced. Clearing browser site data, using private browsing, or switching browsers/devices may remove or hide saved resumes. Export JSON backups periodically. Photos are stored as data URLs in the local resume record and are limited to 1 MB.

## Export PDF

Choose **Export PDF** or **Print preview**, then select **Save as PDF** in the browser print dialog. Choose A4 paper. Enable **Background graphics** if you want accent colors and the sidebar background to print. Browser pagination and font rendering can vary; inspect the print preview before sending the resume.

## How the app works

`state.js` defines the normalized resume data model. `form-editor.js` renders repeatable fields and writes edits into the active resume object. `templates.js` has a template registry; each renderer consumes the same resume model. `preview.js` updates the document and applies CSS custom properties for theme settings. `storage.js` maintains a local library of resume objects. The app debounces storage writes to avoid writing on every keystroke.

Template switching only changes `resume.design.template` and re-renders the preview. It does not replace or transform the underlying content.

## Add a template

1. Add a new renderer function to `assets/js/templates.js`.
2. Use the existing helpers (`section`, `entry`, `orderedSections`, `header`) where appropriate.
3. Add a registry record to `templateRegistry` with a unique `id`, name, category, description, and `render` function.
4. Add a `.template-YOURID` selector in `assets/css/templates.css` for its distinct layout.
5. Optionally customize its miniature card in `template-manager.js`.
6. Verify it in the gallery and print preview.

## Test checklist

- Edit the full name and verify the preview updates.
- Add two experience entries, edit both, duplicate/reorder/delete them.
- Switch Classic Professional → Modern Sidebar → Minimal ATS; verify fields remain in the editor.
- Change accent colors and typography.
- Hide Skills in **Sections** and verify the preview no longer renders it.
- Move sections up/down and verify order changes.
- Reload the page and confirm the active resume returns.
- Export JSON, then import it in the editor.
- Create a second resume from **My resumes**, rename and duplicate it.
- Delete a saved resume and verify confirmation is required.
- Add long content and use Print preview to inspect multipage A4 output.
- Test at desktop, tablet, and mobile widths.
- Test malformed JSON and browser storage-disabled/private modes for useful errors.

## Known browser limitations

- PDF output uses the browser's print engine; the application does not promise identical pagination in every browser.
- The page count shown in the editor is an estimate; use print preview for the authoritative page count.
- There is no cloud account, cross-device sync, or server-side recovery.
- ATS parsing differs by employer and software; no universal compatibility guarantee is possible.
