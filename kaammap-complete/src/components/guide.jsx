import {useState} from "react"
import {motion,AnimatePresence} from "framer-motion"
import {Check,RotateCcw,ExternalLink,ChevronDown,AlertTriangle,Printer} from "lucide-react"
import {useApp} from "../context/AppContext"
import {fmtRs,fmtDate} from "../utils/format"
export function DocumentChecklist({g}){ const {progress,toggleCheck,resetProgress,t}=useApp(); const done=progress[g.slug]?.docs||[]; const total=g.documents.length
 return <section aria-label={t("docs_title")} className="print-block">
  <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display font-extrabold text-2xl">{t("docs_title")}</h2><span className="text-sm font-bold" aria-live="polite">{t("docs_prepared",{done:done.length,total})}</span></div>
  <div className="h-2.5 bg-stone2/70 dark:bg-white/10 rounded-full mt-3 overflow-hidden" role="progressbar" aria-valuenow={done.length} aria-valuemin="0" aria-valuemax={total}><motion.div animate={{width:(total?done.length/total*100:0)+"%"}} transition={{duration:.5}} className="h-full bg-forest rounded-full"/></div>
  <ul className="mt-5 space-y-3">{g.documents.map((d,i)=>{ const on=done.includes(i); return <li key={i}><label className={`flex gap-3.5 p-4 rounded-2xl border cursor-pointer transition print:border-stone2 ${on?"bg-[#EAF3EC] dark:bg-forest/20 border-forest/40":"bg-white dark:bg-[#20362A] border-stone2 dark:border-white/10 hover:border-forest/50"}`}>
   <input type="checkbox" checked={on} onChange={()=>toggleCheck(g.slug,"docs",i)} className="peer sr-only"/>
   <span aria-hidden="true" className={`w-6 h-6 rounded-lg grid place-items-center shrink-0 border-2 transition ${on?"bg-forest border-forest text-white":"border-stone2 text-transparent"}`}><Check size={15} strokeWidth={3.5}/></span>
   <span className="min-w-0"><span className="flex flex-wrap items-center gap-2"><span className={`font-bold text-[15px] ${on?"line-through opacity-70":""}`}>{d.name}</span><span className={`text-[10.5px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide ${d.status==="required"?"bg-forest text-white":"bg-[#FFF4E5] text-[#8A5A00] border border-[#F2C94C]/70"}`}>{d.status==="required"?t("doc_required"):t("doc_if")}</span></span>
   <span className="block text-sm text-muted mt-1 leading-relaxed">{d.desc}</span>{d.note&&<span className="block text-xs font-semibold text-forest mt-1">{d.note}</span>}</span></label></li> })}</ul>
  <button onClick={()=>{ if(confirm(t("doc_reset_confirm"))) resetProgress(g.slug) }} className="no-print mt-4 inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-[#B3371F]"><RotateCcw size={15}/> {t("doc_reset")}</button>
  <p className="text-xs text-muted mt-2">{t("doc_note")}</p></section>
}
export function FeeBreakdown({g}){ const {t}=useApp(); return <section aria-label={t("fees_title")} className="print-block">
 <h2 className="font-display font-extrabold text-2xl">{t("fees_title")}</h2>
 {g.fees?.length?<><div className="bg-white dark:bg-[#20362A] border border-stone2 dark:border-white/10 rounded-3xl overflow-hidden mt-4"><div className="overflow-x-auto"><table className="w-full text-sm min-w-[520px]"><thead><tr className="text-left bg-ivory dark:bg-white/5 text-muted"><th className="px-5 py-3 font-semibold">{t("fees_fee")}</th><th className="px-3 py-3 font-semibold">{t("fees_applies")}</th><th className="px-5 py-3 font-semibold text-right">{t("fees_amount")}</th></tr></thead><tbody>{g.fees.map((f,i)=><tr key={i} className="border-t border-stone2/70 dark:border-white/5"><td className="px-5 py-3.5 font-semibold">{f.name}<span className="block text-xs text-muted font-normal mt-0.5">{t("fees_source",{source:f.source,date:fmtDate(f.checked)})}</span></td><td className="px-3 py-3.5">{f.applies}</td><td className="px-5 py-3.5 text-right font-display font-extrabold text-[16px] tabular whitespace-nowrap">{f.amount===null?<span className="text-[13px] font-body font-bold text-[#8A5A00]">{t("fees_psid")}</span>:fmtRs(f.amount)}</td></tr>)}</tbody></table></div></div>
 <p className="text-[13px] text-muted mt-3 flex gap-2"><AlertTriangle size={15} className="text-coral shrink-0 mt-0.5"/> {t("fees_note")}</p></>:
 <div className="bg-[#FFF7ED] dark:bg-[#3A2A1C] border border-coral/40 rounded-3xl p-5 mt-4 text-sm leading-relaxed"><strong>{t("fees_none_t")}</strong> {g.feesUnavailable||t("fees_none_d")}</div>}
</section> }
export function StepTimeline({g}){ const {progress,toggleCheck,t}=useApp(); const done=progress[g.slug]?.steps||[]
 return <section aria-label={t("steps_title")} className="print-block"><h2 className="font-display font-extrabold text-2xl">{t("steps_title")}</h2>
 <p className="text-sm text-muted mt-1.5" aria-live="polite">{t("steps_prog",{done:done.length,total:g.steps.length})}</p>
 <ol className="mt-6 relative border-l-2 border-dashed border-forest/30 ml-5 space-y-7">{g.steps.map((s,i)=>{ const on=done.includes(i); return <li key={i} className="relative pl-9">
  <button onClick={()=>toggleCheck(g.slug,"steps",i)} aria-pressed={on} aria-label={t(on?"step_aria_undone":"step_aria_done",{n:i+1})} className={`no-print absolute -left-[21px] top-0 w-10 h-10 rounded-full grid place-items-center font-display font-extrabold text-[15px] shadow-soft transition active:scale-90 ${on?"bg-forest text-white":"bg-white dark:bg-[#20362A] border-2 border-forest/40 text-forest"}`}>{on?<Check size={18} strokeWidth={3}/>:i+1}</button>
  <span className="hidden print:block absolute -left-[21px] top-0 w-10 h-10 rounded-full border-2 border-forest text-forest grid place-items-center font-display font-extrabold bg-white">{i+1}</span>
  <h3 className={`font-display font-bold text-[17px] ${on?"line-through opacity-70":""}`}>{s.title}</h3><p className="text-sm text-muted mt-1 leading-relaxed max-w-2xl">{s.desc}</p>
  {s.link&&<a href={s.link.url} target="_blank" rel="noopener noreferrer" className="no-print inline-flex items-center gap-1.5 text-sm font-bold text-forest mt-2 hover:underline">{s.link.label} <ExternalLink size={13}/></a>}</li> })}</ol></section>
}
export function SourceList({g}){ const {t}=useApp(); return <section aria-label={t("sources_title")} className="print-block"><h2 className="font-display font-extrabold text-2xl">{t("sources_title")}</h2>
 <ul className="mt-4 space-y-3">{g.sources.map((s,i)=><li key={i} className="bg-white dark:bg-[#20362A] border border-stone2 dark:border-white/10 rounded-2xl p-4.5 p-5"><p className="font-bold text-[15px]">{s.name}</p><p className="text-sm text-muted mt-1">{s.desc}</p>{s.url&&<a href={s.url} target="_blank" rel="noopener noreferrer" className="no-print inline-flex items-center gap-1.5 text-sm font-bold text-forest mt-2 hover:underline">{t("sources_visit")} <ExternalLink size={13}/></a>}</li>)}</ul>
 <p className="text-xs text-muted mt-3">{t("sources_note")}</p></section>
}
export function FAQAccordion({g}){ const {t}=useApp(); const [open,setOpen]=useState(0); return <section aria-label={t("faq_title")}><h2 className="font-display font-extrabold text-2xl">{t("faq_title")}</h2>
 <div className="mt-4 divide-y divide-stone2 dark:divide-white/10 border-y border-stone2 dark:border-white/10">{g.faqs.map((f,i)=>{ const is=open===i; return <div key={i}>
  <button onClick={()=>setOpen(is?-1:i)} aria-expanded={is} className="w-full flex items-center justify-between gap-4 py-4.5 py-5 text-left font-display font-bold text-[15.5px]">{f.q}<motion.span animate={{rotate:is?180:0}} transition={{duration:.25}} className="shrink-0 w-8 h-8 grid place-items-center rounded-full bg-[#EAF3EC] text-forest"><ChevronDown size={17}/></motion.span></button>
  <AnimatePresence initial={false}>{is&&<motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.28}} className="overflow-hidden"><p className="pb-5 text-sm text-muted leading-relaxed max-w-3xl">{f.a}</p></motion.div>}</AnimatePresence></div> })}</div></section>
}
export function PrintButton(){ const {t}=useApp(); return <button onClick={()=>window.print()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-ink/15 font-bold text-sm hover:border-forest hover:text-forest no-print"><Printer size={16}/> {t("print_btn")}</button> }
