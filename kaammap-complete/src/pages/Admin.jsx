import {useEffect,useState,useCallback} from "react"
import {Link} from "react-router-dom"
import {ShieldCheck,RefreshCw,Plus,X} from "lucide-react"
import {useApp} from "../context/AppContext"
import {apiGet,apiPost,apiPatch,apiDelete} from "../lib/api"
const inp="w-full mt-1 border border-stone2 dark:border-white/15 rounded-xl px-3 py-2.5 text-sm bg-transparent"
const btn="px-3.5 py-1.5 rounded-full text-xs font-bold border border-stone2 dark:border-white/15 hover:border-forest hover:text-forest transition disabled:opacity-50"
const J=v=>JSON.stringify(v??[],null,1)
function parseJ(s,label){ try{ const v=JSON.parse(s); if(!Array.isArray(v)) throw new Error("must be a list"); return v }catch(e){ throw new Error(label+": "+e.message) } }

export default function Admin(){
 const {user,toast}=useApp()
 const [stats,setStats]=useState(null); const [guides,setGuides]=useState([]); const [reports,setReports]=useState([]); const [sources,setSources]=useState([]); const [cats,setCats]=useState([])
 const [err,setErr]=useState(""); const [busy,setBusy]=useState(false)
 const [edit,setEdit]=useState(null) // guide form state or null
 const [srcForm,setSrcForm]=useState({title:"",officialUrl:"",organization:"",sourceType:"government-website",checkedAt:"",notes:""})
 const load=useCallback(async()=>{
   try{
     const [d,g,r,s,c]=await Promise.all([apiGet("/admin/dashboard"),apiGet("/admin/guides?limit=50"),apiGet("/admin/reports"),apiGet("/admin/sources"),apiGet("/categories")])
     setStats(d.stats||d); setGuides(g.items||[]); setReports(r.items||[]); setSources(s.items||[]); setCats(c.items||[])
     setErr("")
   }catch(e){ setErr(e.message||"Could not load admin data.") }
 },[])
 useEffect(()=>{ load() },[load])
 if(!user) return null
 if(user.role!=="admin") return <main className="max-w-3xl mx-auto px-4 pt-16 text-center"><ShieldCheck size={40} className="mx-auto text-coral"/><h1 className="font-display font-extrabold text-2xl mt-4">Admins only</h1><p className="text-muted mt-2 text-sm">This area is for KAAMMAP administrators. Your account does not have admin access, and the server enforces this — not just this page.</p><Link to="/dashboard" className="inline-block mt-6 bg-forest text-white px-6 py-3 rounded-full font-bold text-sm">Back to My Preparation</Link></main>
 const act=async(fn,msg)=>{ setBusy(true); try{ await fn(); toast(msg); await load() }catch(e){ toast(e.message||"Action failed","error") } finally{ setBusy(false) } }
 const openNew=()=>setEdit({title:"",slug:"",short:"",categorySlug:cats[0]?.slug||"",scope:"Nationwide",applies:"Pakistan",authority:"",whoFor:"",level:"preparation",verifiedDate:"",verifyNote:"",keywords:"",documents:"[]",fees:"[]",steps:"[]",faqs:"[]",sources:"[]",applyAt:"[]",notes:"",related:""})
 const openEdit=g=>setEdit({id:g._id,title:g.title,slug:g.slug,short:g.short,categorySlug:g.categorySlug||g.category,scope:g.scope,applies:g.applies||"",authority:g.authority,whoFor:g.whoFor||"",level:g.level,verifiedDate:g.verifiedDate||"",verifyNote:g.verifyNote||"",keywords:(g.keywords||[]).join(", "),documents:J(g.documents),fees:J(g.fees),steps:J(g.steps),faqs:J(g.faqs),sources:J(g.sources),applyAt:J(g.applyAt),notes:(g.notes||[]).join("\n"),related:(g.related||[]).join(", ")})
 const saveGuide=async e=>{ e.preventDefault(); let payload; try{ payload={title:edit.title,slug:edit.slug,short:edit.short,categorySlug:edit.categorySlug,scope:edit.scope,applies:edit.applies,authority:edit.authority,whoFor:edit.whoFor,level:edit.level,verifiedDate:edit.verifiedDate,verifyNote:edit.verifyNote,keywords:edit.keywords.split(",").map(s=>s.trim()).filter(Boolean),documents:parseJ(edit.documents,"Documents"),fees:parseJ(edit.fees,"Fees"),steps:parseJ(edit.steps,"Steps"),faqs:parseJ(edit.faqs,"FAQs"),sources:parseJ(edit.sources,"Sources"),applyAt:parseJ(edit.applyAt,"Where to apply"),notes:edit.notes.split("\n").map(s=>s.trim()).filter(Boolean),related:edit.related.split(",").map(s=>s.trim()).filter(Boolean)} }catch(err){ toast(err.message,"error"); return }
   await act(async()=>{ if(edit.id) await apiPatch(`/admin/guides/${edit.id}`,payload); else await apiPost("/admin/guides",payload); setEdit(null) }, edit.id?"Guide updated":"Guide created as draft") }
 const statCards=stats?[["Published guides",stats.publishedGuides],["Drafts",stats.draftGuides],["Need review",stats.needsReviewGuides],["Pending reports",stats.pendingReports],["Active categories",stats.activeCategories],["Users",stats.totalUsers]]:[]
 return <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
  <div className="flex flex-wrap items-center gap-3"><h1 className="font-display font-extrabold text-3xl flex items-center gap-2.5"><ShieldCheck className="text-forest"/> Admin Panel</h1><span className="text-xs font-bold bg-deep text-lime px-3 py-1.5 rounded-full">REAL DATA — FROM THE DATABASE</span><button onClick={load} className={btn+" ml-auto inline-flex items-center gap-1.5"}><RefreshCw size={13}/> Refresh</button></div>
  {err&&<p role="alert" className="text-sm font-semibold text-[#B3371F] dark:text-[#FFA08C] bg-[#FFF7ED] dark:bg-[#3A2A1C] border border-coral/40 rounded-xl p-3.5 mt-4">{err}</p>}
  {stats&&<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-6">{statCards.map(([l,v])=><div key={l} className="bg-white dark:bg-[#20362A] border border-stone2 dark:border-white/10 rounded-3xl p-4.5 p-5"><p className="font-display font-extrabold text-[26px] leading-none">{v??"—"}</p><p className="text-xs font-bold text-muted mt-1.5">{l}</p></div>)}</div>}

  <section className="mt-10"><div className="flex items-center gap-3"><h2 className="font-display font-extrabold text-xl">Guides</h2><button disabled={busy} onClick={openNew} className="ml-auto inline-flex items-center gap-1.5 bg-forest text-white px-4 py-2 rounded-full text-sm font-bold"><Plus size={15}/> New Guide</button></div>
  <div className="bg-white dark:bg-[#20362A] border border-stone2 dark:border-white/10 rounded-3xl mt-4 overflow-x-auto"><table className="w-full text-sm min-w-[720px]"><thead><tr className="text-left text-xs text-muted border-b border-stone2 dark:border-white/10"><th className="p-4">Guide</th><th className="p-4">Status</th><th className="p-4">Level</th><th className="p-4">Actions</th></tr></thead><tbody>
   {guides.map(g=><tr key={g._id} className="border-b border-stone2/60 dark:border-white/5 last:border-0"><td className="p-4"><p className="font-bold">{g.title}</p><p className="text-xs text-muted">{g.slug} · {g.categorySlug}</p></td>
   <td className="p-4"><span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${g.publicationStatus==="published"?"bg-forest text-white":g.publicationStatus==="draft"?"bg-[#FFF4E5] text-[#8A5A00]":"bg-black/10 dark:bg-white/10"}`}>{g.publicationStatus}</span></td>
   <td className="p-4 text-muted">{g.level}</td>
   <td className="p-4"><div className="flex flex-wrap gap-1.5"><button disabled={busy} onClick={()=>openEdit(g)} className={btn}>Edit</button>
   {g.publicationStatus!=="published"&&<button disabled={busy} onClick={()=>act(()=>apiPost(`/admin/guides/${g._id}/publish`),"Guide published")} className={btn}>Publish</button>}
   {g.publicationStatus==="published"&&<button disabled={busy} onClick={()=>act(()=>apiPost(`/admin/guides/${g._id}/archive`),"Guide archived")} className={btn}>Archive</button>}
   <button disabled={busy} onClick={()=>act(()=>apiPost(`/admin/guides/${g._id}/request-review`),"Marked as needing review")} className={btn}>Request review</button>
   <Link to={`/guides/${g.slug}`} className={btn}>View</Link></div></td></tr>)}
   {!guides.length&&<tr><td colSpan="4" className="p-6 text-muted">No guides yet.</td></tr>}
  </tbody></table></div></section>

  {edit&&<div className="fixed inset-0 z-[90] bg-ink/60 backdrop-blur-sm overflow-y-auto p-4" role="dialog" aria-label="Guide editor"><form onSubmit={saveGuide} className="bg-white dark:bg-[#1A2E26] rounded-3xl max-w-3xl mx-auto my-6 p-6 sm:p-8">
   <div className="flex items-center gap-3"><h3 className="font-display font-extrabold text-xl">{edit.id?"Edit guide":"New guide (draft)"}</h3><button type="button" onClick={()=>setEdit(null)} className="ml-auto p-2 rounded-full hover:bg-black/5" aria-label="Close editor"><X size={18}/></button></div>
   <div className="grid sm:grid-cols-2 gap-4 mt-5">
    {[["Title","title"],["Slug","slug"],["Category (slug)","categorySlug"],["Scope","scope"],["Applies","applies"],["Authority","authority"],["Who it is for","whoFor"],["Verified date (YYYY-MM-DD)","verifiedDate"]].map(([l,k])=><label key={k} className="block"><span className="text-sm font-bold">{l}</span><input required={["title","slug","categorySlug","authority"].includes(k)} value={edit[k]} onChange={e=>setEdit({...edit,[k]:e.target.value})} className={inp}/></label>)}
    <label className="block"><span className="text-sm font-bold">Information level</span><select value={edit.level} onChange={e=>setEdit({...edit,level:e.target.value})} className={inp}><option value="checked">Fees & steps checked</option><option value="partial">Partly checked</option><option value="preparation">Preparation guide</option></select></label>
    <label className="block"><span className="text-sm font-bold">Keywords (comma separated)</span><input value={edit.keywords} onChange={e=>setEdit({...edit,keywords:e.target.value})} className={inp}/></label>
   </div>
   <label className="block mt-4"><span className="text-sm font-bold">Short summary</span><textarea rows="2" value={edit.short} onChange={e=>setEdit({...edit,short:e.target.value})} className={inp}/></label>
   <label className="block mt-4"><span className="text-sm font-bold">Verification note</span><input value={edit.verifyNote} onChange={e=>setEdit({...edit,verifyNote:e.target.value})} className={inp}/></label>
   {[["Documents (JSON list of {name, desc, status, note})","documents"],["Fees (JSON list of {name, amount, applies, source, checked})","fees"],["Steps (JSON list of {title, desc, link})","steps"],["FAQs (JSON list of {q, a})","faqs"],["Official sources (JSON list of {name, url})","sources"],["Where to apply (JSON list of {name, desc, link})","applyAt"]].map(([l,k])=><label key={k} className="block mt-4"><span className="text-sm font-bold">{l}</span><textarea rows="4" value={edit[k]} onChange={e=>setEdit({...edit,[k]:e.target.value})} className={inp+" font-mono text-xs"}/></label>)}
   <label className="block mt-4"><span className="text-sm font-bold">Important notes (one per line)</span><textarea rows="3" value={edit.notes} onChange={e=>setEdit({...edit,notes:e.target.value})} className={inp}/></label>
   <label className="block mt-4"><span className="text-sm font-bold">Related guide slugs (comma separated)</span><input value={edit.related} onChange={e=>setEdit({...edit,related:e.target.value})} className={inp}/></label>
   <p className="text-xs text-muted mt-4">Publishing rules are enforced by the server: a "checked" guide must have at least one official source, plus documents and steps. Slugs of published guides cannot change.</p>
   <div className="flex gap-3 mt-6"><button disabled={busy} className="bg-forest text-white px-6 py-3 rounded-full font-bold text-sm disabled:opacity-50">{edit.id?"Save changes":"Create draft"}</button><button type="button" onClick={()=>setEdit(null)} className="px-6 py-3 rounded-full font-bold text-sm border-2 border-ink/15">Cancel</button></div>
  </form></div>}

  <section className="mt-10 grid lg:grid-cols-2 gap-6 items-start">
   <div><h2 className="font-display font-extrabold text-xl">Issue Reports</h2><div className="space-y-3 mt-4">
    {reports.map(r=><div key={r._id} className="bg-white dark:bg-[#20362A] border border-stone2 dark:border-white/10 rounded-3xl p-5"><div className="flex flex-wrap items-center gap-2"><Link to={`/guides/${r.guideSlug}`} className="font-bold text-forest text-sm">{r.guideSlug}</Link><span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-[#FFF4E5] text-[#8A5A00]">{r.status}</span><span className="text-xs text-muted">{r.issueType}</span></div>
    <p className="text-sm mt-2 leading-relaxed">{r.description}</p>
    <div className="flex flex-wrap gap-2 mt-3.5">{["pending","reviewing","resolved","rejected"].map(s=><button key={s} disabled={busy||r.status===s} onClick={()=>act(()=>apiPatch(`/admin/reports/${r._id}`,{status:s}),"Report marked "+s)} className={btn}>{s}</button>)}</div></div>)}
    {!reports.length&&<p className="text-sm text-muted">No reports yet.</p>}
   </div></div>
   <div><h2 className="font-display font-extrabold text-xl">Official Sources</h2>
    <form onSubmit={e=>{e.preventDefault(); act(async()=>{ await apiPost("/admin/sources",{...srcForm,checkedAt:srcForm.checkedAt||undefined}); setSrcForm({title:"",officialUrl:"",organization:"",sourceType:"government-website",checkedAt:"",notes:""}) },"Source added")}} className="bg-white dark:bg-[#20362A] border border-stone2 dark:border-white/10 rounded-3xl p-5 mt-4 space-y-3">
     {[["Title","title"],["Official URL (https://…)","officialUrl"],["Organization","organization"],["Checked date (YYYY-MM-DD)","checkedAt"]].map(([l,k])=><label key={k} className="block"><span className="text-sm font-bold">{l}</span><input required={k!=="checkedAt"} value={srcForm[k]} onChange={e=>setSrcForm({...srcForm,[k]:e.target.value})} className={inp}/></label>)}
     <label className="block"><span className="text-sm font-bold">Type</span><select value={srcForm.sourceType} onChange={e=>setSrcForm({...srcForm,sourceType:e.target.value})} className={inp}><option value="government-website">Official government website</option><option value="application-portal">Official application portal</option><option value="fee-schedule">Official fee schedule</option><option value="official-notification">Official notification</option><option value="university-website">Official university website</option><option value="other-authoritative">Other authoritative source</option></select></label>
     <button disabled={busy} className="bg-forest text-white px-5 py-2.5 rounded-full font-bold text-sm disabled:opacity-50">Add Source</button></form>
    <div className="space-y-3 mt-4">{sources.map(s=><div key={s._id} className="bg-white dark:bg-[#20362A] border border-stone2 dark:border-white/10 rounded-3xl p-5"><p className="font-bold text-sm">{s.title}</p><p className="text-xs text-muted mt-0.5">{s.organization} · checked {s.checkedAt?String(s.checkedAt).slice(0,10):"—"}</p><a href={s.officialUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-forest break-all">{s.officialUrl}</a></div>)}{!sources.length&&<p className="text-sm text-muted">No source records yet.</p>}</div>
    <h2 className="font-display font-extrabold text-xl mt-8">Categories</h2><div className="space-y-2.5 mt-4">{cats.map(c=><div key={c.slug} className="bg-white dark:bg-[#20362A] border border-stone2 dark:border-white/10 rounded-2xl px-5 py-3.5 flex items-center gap-3"><span className="font-bold text-sm flex-1">{c.name}</span><span className="text-xs text-muted">{c.slug}</span></div>)}</div>
   </div>
  </section>
 </main>
}
