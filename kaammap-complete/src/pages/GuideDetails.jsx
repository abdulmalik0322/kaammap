import {useEffect,useState} from "react"
import {useParams,Link} from "react-router-dom"
import {MapPin,Building2,Bookmark,BookmarkCheck,Share2,Flag,AlertTriangle,ExternalLink,Clock3} from "lucide-react"
import {useApp} from "../context/AppContext"
import {GuideCard,Photo,VerifyBadge,EmptyState} from "../components/ui"
import {DocumentChecklist,FeeBreakdown,StepTimeline,SourceList,FAQAccordion,PrintButton} from "../components/guide"
import {imageForGuide} from "../data/images"
import {fmtDate} from "../utils/format"
export default function GuideDetails(){
 const {slug}=useParams(); const {guides,savedGuides,toggleSaveGuide,toast,markViewed,guideProgress,loadProgress,t}=useApp(); const [reported,setReported]=useState(false)
 const g=guides.find(x=>x.slug===slug)
 useEffect(()=>{ if(g) markViewed(g.slug) },[slug])
 useEffect(()=>{ loadProgress(slug) },[slug])
 if(!g) return <main className="max-w-4xl mx-auto px-4 pt-12"><EmptyState title={t("guide_notfound_t")} body={t("guide_notfound_b")} cta={t("guide_notfound_cta")}/></main>
 const isSaved=savedGuides.includes(g.slug); const prog=guideProgress(g); const related=(g.related||[]).map(s=>guides.find(x=>x.slug===s)).filter(Boolean)
 const share=async()=>{ try{ await navigator.clipboard.writeText(location.href); toast(t("share_ok")) }catch{ toast(t("share_fail"),"error") } }
 return <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
  <Link to="/explore" className="text-sm font-bold text-forest no-print">{t("back_guides")}</Link>
  <div className="relative rounded-[32px] overflow-hidden mt-4 shadow-soft print:hidden"><Photo eager id={imageForGuide(g)} alt={g.title} className="h-56 sm:h-72 lg:h-80 w-full"/><div className="absolute inset-0 bg-gradient-to-t from-[#0E241B]/60 to-transparent pointer-events-none"/>
   <div className="absolute bottom-4 left-5 flex flex-wrap gap-2"><span className="text-xs font-bold bg-white/95 text-ink px-3 py-1.5 rounded-full flex items-center gap-1 shadow"><MapPin size={12}/> {g.scope}</span><span className="text-xs font-bold bg-ink/70 text-white backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1"><Building2 size={12}/> {g.authority}</span></div></div>
  <div className="grid lg:grid-cols-[1.55fr_1fr] gap-10 mt-8">
   <div className="space-y-12 min-w-0">
    <header>
     <div className="flex flex-wrap gap-2 items-center"><VerifyBadge g={g}/>{g.verifiedDate&&<span className="text-xs font-semibold text-muted flex items-center gap-1"><Clock3 size={13}/> {t("last_checked",{date:fmtDate(g.verifiedDate)})}</span>}</div>
     <h1 className="font-display font-extrabold text-3xl sm:text-[42px] leading-[1.12] mt-4">{g.title}</h1>
     <p className="text-muted mt-3.5 text-[16px] leading-relaxed">{g.short}</p>
     <div className="bg-white dark:bg-[#20362A] border border-stone2 dark:border-white/10 rounded-3xl p-5.5 p-6 mt-6">
      <h2 className="font-display font-bold text-lg">{t("quick_overview")}</h2>
      <dl className="mt-3 space-y-2.5 text-sm"><div className="flex gap-2"><dt className="font-bold shrink-0 w-28">{t("ov_who")}</dt><dd className="text-muted">{g.whoFor}</dd></div>
      <div className="flex gap-2"><dt className="font-bold shrink-0 w-28">{t("ov_authority")}</dt><dd className="text-muted">{g.authority}</dd></div>
      <div className="flex gap-2"><dt className="font-bold shrink-0 w-28">{t("ov_applies")}</dt><dd className="text-muted">{g.scope}</dd></div>
      <div className="flex gap-2"><dt className="font-bold shrink-0 w-28">{t("ov_docs")}</dt><dd className="text-muted">{t("ov_docs_val",{n:g.documents.filter(d=>d.status==="required").length})}{g.documents.some(d=>d.status==="conditional")?t("ov_docs_cond"):""}</dd></div></dl>
      {g.verifyNote&&<p className="text-[13px] mt-4 bg-[#EAF3EC] dark:bg-forest/15 border border-forest/20 rounded-2xl p-3.5 leading-relaxed"><strong>{t("how_checked")}</strong> {g.verifyNote}</p>}
     </div>
    </header>
    <DocumentChecklist g={g}/>
    <FeeBreakdown g={g}/>
    <StepTimeline g={g}/>
    <section aria-label={t("where_title")} className="print-block"><h2 className="font-display font-extrabold text-2xl">{t("where_title")}</h2>
     <div className="grid sm:grid-cols-2 gap-4 mt-4">{g.applyAt.map((a,i)=><div key={i} className="bg-deep text-white rounded-3xl p-5.5 p-6"><p className="font-display font-bold">{a.label}</p><p className="text-white/70 text-sm mt-1.5 leading-relaxed">{a.desc}</p>{a.url?<a href={a.url} target="_blank" rel="noopener noreferrer" className="no-print inline-flex items-center gap-1.5 bg-lime text-ink font-bold text-sm px-4 py-2 rounded-full mt-4">{t("open_official")} <ExternalLink size={13}/></a>:<p className="text-[12px] text-lime font-semibold mt-3">{t("where_inperson")}</p>}</div>)}</div></section>
    <section aria-label={t("notes_title")} className="print-block"><h2 className="font-display font-extrabold text-2xl">{t("notes_title")}</h2>
     <ul className="mt-4 space-y-3">{g.notes.map((n,i)=><li key={i} className="flex gap-3 bg-[#FFF7ED] dark:bg-[#3A2A1C] border border-coral/35 rounded-2xl p-4 text-sm leading-relaxed"><AlertTriangle size={17} className="text-coral shrink-0 mt-0.5"/>{n}</li>)}</ul>
     <p className="text-sm text-muted mt-4">{t("notes_disclaimer")}</p></section>
    <FAQAccordion g={g}/>
    <SourceList g={g}/>
   </div>
   <aside className="no-print">
    <div className="lg:sticky lg:top-32 space-y-5">
     <div className="bg-white dark:bg-[#20362A] border border-stone2 dark:border-white/10 rounded-3xl p-6 shadow-soft">
      <p className="text-xs font-bold text-muted uppercase tracking-wide">{t("your_prep")}</p>
      {prog.done===0?<p className="font-display font-extrabold text-[21px] mt-2.5">{t("not_started")}</p>:<p className="font-display font-extrabold text-4xl tabular mt-1.5">{prog.pct}%</p>}
      <div className="h-2.5 bg-ivory dark:bg-white/10 rounded-full mt-2 overflow-hidden"><div className="h-full bg-forest rounded-full transition-all duration-500" style={{width:prog.pct+"%"}}/></div>
      {prog.done===0?<p className="text-sm text-muted mt-2">{t("prep_zero")}</p>:<p className="text-sm text-muted mt-2">{t("prep_prog",{done:prog.done,total:prog.total})}</p>}
      <div className="grid grid-cols-2 gap-2 mt-5"><button onClick={()=>toggleSaveGuide(g.slug)} className={`py-3 rounded-full font-bold text-sm flex items-center justify-center gap-1.5 active:scale-95 transition ${isSaved?"bg-lime text-ink":"bg-forest text-white"}`}>{isSaved?<BookmarkCheck size={16}/>:<Bookmark size={16}/>}{isSaved?t("saved"):t("save_guide")}</button>
      <button onClick={share} className="py-3 rounded-full font-bold text-sm border-2 border-ink/15 flex items-center justify-center gap-1.5 active:scale-95 transition"><Share2 size={16}/> {t("share")}</button></div>
      <div className="mt-2.5"><PrintButton/></div>
      <Link to="/finder" className="block text-center mt-2.5 py-3 rounded-full font-bold text-sm bg-ink text-white dark:bg-white/10">{t("not_your_kaam")}</Link>
     </div>
     <div className="bg-[#FFF7ED] dark:bg-[#3A2A1C] border border-coral/35 rounded-3xl p-5 text-sm leading-relaxed"><strong>{t("outdated_t")}</strong><p className="text-muted mt-1">{t("outdated_b")}</p><Link to={`/report-issue?guide=${g.slug}`} className="inline-flex items-center gap-1.5 font-bold text-forest mt-2.5"><Flag size={14}/> {t("report_link")}</Link></div>
    </div>
   </aside>
  </div>
  {related.length>0&&<section className="mt-16 no-print"><h2 className="font-display font-extrabold text-2xl">{t("related_title")}</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">{related.map(x=><GuideCard key={x.slug} g={x}/>)}</div></section>}
 </main>
}
