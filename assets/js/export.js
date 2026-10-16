import {downloadFile,toast} from "./utils.js";
export function exportResume(resume){const name=(resume.personal.fullName||resume.name||"resume").trim().replace(/[^a-z0-9-_]+/gi,"-").replace(/^-|-$/g,"").toLowerCase()||"resume";downloadFile(`${name}.json`,JSON.stringify(resume,null,2));toast("Resume JSON exported.")}
export async function importResumeFile(file,onImport){if(!file)return;try{if(file.size>5*1024*1024)throw new Error("File is larger than 5 MB.");const raw=await file.text();const value=JSON.parse(raw);onImport(value)}catch(e){toast(`Import failed: ${e.message||"invalid JSON file"}`,"error")}}
export function printResume(){window.print()}
