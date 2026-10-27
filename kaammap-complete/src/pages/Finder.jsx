import {useState} from "react"
import {useApp} from "../context/AppContext"
import {Link} from "react-router-dom"
import {motion,AnimatePresence} from "framer-motion"
import {ArrowRight,ArrowLeft,RotateCcw,AlertTriangle} from "lucide-react"
import {PageTitle,GuideCard} from "../components/ui"
export default function Finder(){ const {guides,t}=useApp(); const SERVICES=t("svc");
 const [step,setStep]=useState(0); const [service,setService]=useState(""); const [kind,setKind]=useState(""); const [province,setProvince]=useState("")
 const reset=()=>{ setStep(0); setService(""); setKind(""); setProvince("") }
 const needsKind=["passport","cnic","licence"].includes(service)
 const resultSlug=()=>{ if(service==="passport") return kind==="renewal"?"passport-renewal":"new-passport"
  if(service==="cnic") return "cnic-services"
  if(service==="licence"){ if(province!=="Punjab") return null; return kind==="permanent"?"permanent-licence-punjab":"learner-licence-punjab" }
  if(service==="admission") return "university-admission"; if(service==="scholarship") return "scholarship-application"; if(service==="job") return "job-application-documents"; return null }
 // flow: 0 service -> 1 kind (if needed) -> 2 province (licence only) -> 3 result
 const nextFromService=(v)=>{ if(["passport","cnic","licence"].includes(v)) setStep(1); else setStep(3) }
 const nextFromKind=()=>{ if(service==="licence") setStep(2); else setStep(3) }
 const slug=resultSlug(); const guide=slug?guides.find(g=>g.slug===slug):null
 const Opts=({items,val,set,onPick})=> <div className="grid sm:grid-cols-2 gap-3 mt-6">{items.map(([v,l,sub])=><button key={v} onClick={()=>{ set(v); onPick&&onPick(v) }} aria-pressed={val===v} className={`text-left p-5 rounded-3xl border-2 transition active:scale-[.98] ${val===v?"border-forest bg-[#EAF3EC] dark:bg-forest/20":"border-stone2 bg-white dark:bg-[#20362A] hover:border-forest/60"}`}><span className="font-display font-bold text-[16px] block">{l}</span>{sub&&<span className="text-sm text-muted block mt-1">{sub}</span>}</button>)}</div>
 return <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
  <PageTitle title={t("finder_title")} desc={t("finder_desc")}/>
  <div className="flex items-center gap-2 mt-8" aria-label="Progress">{[0,1,2,3].map(i=><span key={i} className={`h-2 rounded-full transition-all duration-500 ${i<=step?"bg-forest":"bg-stone2"} ${i===step?"w-10":"w-5"}`}/>)}</div>
  <AnimatePresence mode="wait"><motion.div key={step} initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:.3}} className="mt-6">
  {step===0&&<div><h2 className="font-display font-extrabold text-2xl">{t("fq1")}</h2><Opts val={service} set={setService} onPick={(v)=>setTimeout(()=>nextFromService(v),120)} items={SERVICES.map(([v,l])=>[v,l,""])}/></div>}
  {step===1&&<div><h2 className="font-display font-extrabold text-2xl">{t("fq2")}</h2>
   {service==="passport"&&<Opts val={kind} set={setKind} onPick={()=>setTimeout(nextFromKind,120)} items={t("kind_passport")}/>}
   {service==="cnic"&&<Opts val={kind} set={setKind} onPick={()=>setTimeout(nextFromKind,120)} items={t("kind_cnic")}/>}
   {service==="licence"&&<Opts val={kind} set={setKind} onPick={()=>setTimeout(nextFromKind,120)} items={t("kind_licence")}/>}
   <button onClick={()=>setStep(0)} className="mt-6 inline-flex items-center gap-1.5 font-bold text-sm text-muted"><ArrowLeft size={15}/> {t("back")}</button></div>}
  {step===2&&<div><h2 className="font-display font-extrabold text-2xl">{t("fq3")}</h2><p className="text-muted text-sm mt-2">{t("fq3_sub")}</p>
   <Opts val={province} set={setProvince} onPick={()=>setTimeout(()=>setStep(3),120)} items={t("prov_opts")}/>
   <button onClick={()=>setStep(1)} className="mt-6 inline-flex items-center gap-1.5 font-bold text-sm text-muted"><ArrowLeft size={15}/> {t("back")}</button></div>}
  {step===3&&<div>{guide?<><h2 className="font-display font-extrabold text-2xl">{t("result_t")}</h2><p className="text-muted text-sm mt-2">{t("result_b")}</p><div className="mt-6 max-w-md"><GuideCard g={guide}/></div></>:
   <div className="bg-[#FFF7ED] dark:bg-[#3A2A1C] border border-coral/40 rounded-3xl p-6.5 p-7"><h2 className="font-display font-extrabold text-2xl flex items-center gap-2"><AlertTriangle className="text-coral"/> {t("noguide_t")}</h2><p className="text-sm leading-relaxed mt-3">{t("noguide_b1")}</p><p className="text-sm mt-2">{t("noguide_b2")}</p></div>}
   <div className="flex gap-3 mt-7"><button onClick={reset} className="inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 border-ink/15 font-bold text-sm"><RotateCcw size={15}/> {t("start_again")}</button><Link to="/explore" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-forest text-white font-bold text-sm">{t("browse_all")} <ArrowRight size={15}/></Link></div></div>}
  </motion.div></AnimatePresence>
  <p className="text-xs text-muted mt-8">{t("finder_note")}</p></main>
}
