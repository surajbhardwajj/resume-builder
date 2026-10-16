import {createBlankResume,createExampleResume,normalizeResume} from "./state.js";
const KEY="forma-resume-builder-v1";
function readStore(){try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw):null}catch(e){throw new Error("Browser storage is unavailable or contains invalid data.")}}
function writeStore(data){try{localStorage.setItem(KEY,JSON.stringify(data));return true}catch(e){throw new Error("Could not save. Browser storage may be full or disabled. Export your JSON backup and remove large photos.")}}
export function loadLibrary(){const store=readStore();if(!store)return {activeId:null,resumes:[]};if(!Array.isArray(store.resumes))throw new Error("Saved resume library is invalid.");return {activeId:store.activeId||null,resumes:store.resumes.map(normalizeResume)}}
export function saveLibrary(library){writeStore({version:1,activeId:library.activeId,resumes:library.resumes})}
export function loadResume(){try{let library=loadLibrary();if(!library.resumes.length){const sample=createExampleResume();library={activeId:sample.id,resumes:[sample]};saveLibrary(library)}let active=library.resumes.find(r=>r.id===library.activeId)||library.resumes[0];library.activeId=active.id;return {library,resume:active}}catch(e){return {library:{activeId:null,resumes:[]},resume:createExampleResume(),storageError:e.message}}}
export function saveResume(library,resume){resume.updatedAt=new Date().toISOString();const idx=library.resumes.findIndex(r=>r.id===resume.id);if(idx<0)library.resumes.push(resume);else library.resumes[idx]=resume;library.activeId=resume.id;saveLibrary(library);return library}
export function makeNewResume(library){const r=createBlankResume("Untitled resume");library.resumes.push(r);library.activeId=r.id;saveLibrary(library);return r}
export function duplicateResume(library,resume){const copy=normalizeResume(JSON.parse(JSON.stringify(resume)));copy.id=crypto?.randomUUID?.()||`id-${Date.now()}`;copy.name=`${resume.name} copy`;copy.createdAt=new Date().toISOString();copy.updatedAt=copy.createdAt;library.resumes.push(copy);library.activeId=copy.id;saveLibrary(library);return copy}
export function deleteResume(library,id){library.resumes=library.resumes.filter(r=>r.id!==id);if(library.activeId===id)library.activeId=library.resumes[0]?.id||null;saveLibrary(library)}
export function importResumeObject(value){return normalizeResume(value)}
