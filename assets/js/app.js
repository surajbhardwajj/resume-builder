import {$,$$,debounce,toast,confirmAction,uid} from "./utils.js";
import {loadResume,saveResume,makeNewResume,duplicateResume,deleteResume,loadLibrary,importResumeObject} from "./storage.js";
import {renderAllForms,bindFormEditor} from "./form-editor.js";
import {renderResumePreview,setZoom,fitZoom} from "./preview.js";
import {renderTemplateSelector} from "./template-manager.js";
import {renderPalettes,bindThemeControls,resetDesign} from "./theme-manager.js";
import {renderSectionManager} from "./section-manager.js";
import {renderQualityChecks} from "./validation.js";
import {exportResume,importResumeFile,printResume} from "./export.js";
let loaded=loadResume();let library=loaded.library;let resume=loaded.resume;let zoom=.8;let activeTab="content";
const setStatus=(status,error=false)=>{const el=$("#saveStatus");el.textContent=status;el.style.color=error?"#b0444c":""};
function persist(){try{library=saveResume(library,resume);setStatus("All changes saved locally");return true}catch(e){setStatus("Save failed",true);toast(e.message,"error");return false}}
const saveDebounced=debounce(persist,500);
function refreshPreview(){renderResumePreview(resume);setZoom(zoom);renderQualityChecks(resume)}
function update({save=true,toastMessage=""}={}){refreshPreview();renderSectionManager(resume,()=>update());if(save){setStatus("Saving…");saveDebounced()}if(toastMessage)toast(toastMessage)}
function renderDesign(){renderTemplateSelector(resume.design.template,id=>{resume.design.template=id;renderDesign();update({toastMessage:"Template changed. Your content is preserved."})});renderPalettes(resume.design.accent,p=>{resume.design.accent=p.accent;resume.design.heading=p.heading;resume.design.body=p.body;renderDesign();update()});bindThemeControls(resume,()=>update());}
function renderAll(){renderAllForms(resume);renderDesign();refreshPreview();renderSectionManager(resume,()=>update());setStatus(loaded.storageError?"Storage unavailable — changes may not persist":"All changes saved locally",!!loaded.storageError);if(loaded.storageError)toast(loaded.storageError,"error")}
function switchTab(tab){activeTab=tab;$$(".editor-tab").forEach(b=>{const active=b.dataset.tab===tab;b.classList.toggle("active",active);b.setAttribute("aria-selected",String(active))});$$(".tab-panel").forEach(p=>p.classList.toggle("active",p.dataset.panel===tab));if(innerWidth<=760&&tab!=="content")$("#editorContent").scrollIntoView({behavior:"smooth",block:"start"})}
function openResumeDialog(){try{library=loadLibrary()}catch(e){toast(e.message,"error")}const list=$("#savedResumeList");list.innerHTML=library.resumes.map(r=>`<div class="saved-resume" data-saved-id="${r.id}"><div class="saved-meta"><strong>${escapeText(r.name||r.personal.fullName||"Untitled resume")}</strong><small>Updated ${new Date(r.updatedAt||r.createdAt).toLocaleString()}</small></div><div class="saved-actions"><button class="btn btn-secondary" data-resume-action="load">Open</button><button class="icon-btn" data-resume-action="rename" title="Rename" aria-label="Rename resume">✎</button><button class="icon-btn" data-resume-action="duplicate" title="Duplicate" aria-label="Duplicate resume">⧉</button><button class="icon-btn" data-resume-action="delete" title="Delete" aria-label="Delete resume">×</button></div></div>`).join("")||`<p class="helper">No saved resumes yet. Save one to see it here.</p>`;$("#resumeDialog").showModal()}
function escapeText(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$$(".editor-tab").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));
bindFormEditor(()=>resume,()=>update());
$("#saveBtn").onclick=()=>{if(persist())toast("Resume saved in this browser.")};
$("#printBtn").onclick=$("#printPreviewBtn").onclick=()=>printResume();
$("#manageResumesBtn").onclick=openResumeDialog;
$("#newResumeBtn").onclick=()=>createNew();
$("#dialogNewResumeBtn").onclick=()=>{if(confirmAction("Create a new resume? Your current resume will remain saved in the library.")){createNew();$("#resumeDialog").close()}};
function createNew(){persist();try{resume=makeNewResume(library);renderAll();switchTab("content");toast("New blank resume created.")}catch(e){toast(e.message,"error")}}
$("#duplicateCurrentBtn").onclick=()=>{try{persist();resume=duplicateResume(library,resume);renderAll();$("#resumeDialog").close();toast("Resume duplicated.")}catch(e){toast(e.message,"error")}};
$("#savedResumeList").onclick=e=>{const action=e.target.closest("[data-resume-action]");if(!action)return;const row=action.closest("[data-saved-id]");const id=row.dataset.savedId;const target=library.resumes.find(r=>r.id===id);if(!target)return;switch(action.dataset.resumeAction){case"load":if(id!==resume.id&&!confirmAction("Open this resume? Unsaved edits will be saved first."))return;persist();resume=target;library.activeId=id;try{saveResume(library,resume)}catch(err){toast(err.message,"error")}renderAll();$("#resumeDialog").close();toast("Resume loaded.");break;case"rename":{const name=prompt("Enter a name for this resume:",target.name||target.personal.fullName||"Untitled resume");if(name===null)return;if(!name.trim()){toast("Resume name cannot be empty.","error");return}target.name=name.trim();if(target.id===resume.id)resume.name=target.name;try{library=saveResume(library,target);openResumeDialog();toast("Resume renamed.")}catch(err){toast(err.message,"error")}break}case"duplicate":try{resume=duplicateResume(library,target);renderAll();openResumeDialog();toast("Resume duplicated.")}catch(err){toast(err.message,"error")}break;case"delete":if(!confirmAction(`Permanently delete “${target.name||target.personal.fullName||"Untitled resume"}” from this browser?`))return;try{deleteResume(library,id);if(resume.id===id){if(library.resumes.length){resume=library.resumes[0];library.activeId=resume.id;saveResume(library,resume)}else{resume=makeNewResume(library)}}renderAll();openResumeDialog();toast("Resume deleted.")}catch(err){toast(err.message,"error")}break}};
function createNewBlank(){const r={...resume};return r}
$("#zoomIn").onclick=()=>{zoom=setZoom(zoom+.1);};$("#zoomOut").onclick=()=>{zoom=setZoom(zoom-.1)};$("#fitZoom").onclick=()=>{zoom=fitZoom()};
$("#resetDesignBtn").onclick=()=>{if(!confirmAction("Reset template and design settings to defaults? Your resume content will not change."))return;resetDesign(resume);renderDesign();update({toastMessage:"Design defaults restored."})};
$("#exportJsonBtn").onclick=()=>exportResume(resume);
$("#importJsonInput").onchange=async e=>{const file=e.target.files?.[0];await importResumeFile(file,raw=>{const incoming=importResumeObject(raw);if(!confirmAction("Replace the current editor with this imported resume? Your existing resume will remain in the local library if saved."))return;persist();incoming.id=uid();incoming.name=incoming.name||"Imported resume";resume=incoming;try{library=saveResume(library,resume);renderAll();toast("Resume imported successfully.")}catch(err){toast(err.message,"error")}});e.target.value=""};
$("#photoInput").title="Select an image smaller than 1 MB";
window.addEventListener("beforeunload",()=>{try{persist()}catch{}});
renderAll();
