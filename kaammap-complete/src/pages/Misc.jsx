import {useState} from "react"
import {Link,useSearchParams} from "react-router-dom"
import {PageTitle} from "../components/ui"
import {useApp} from "../context/AppContext"
import {ShieldCheck,BookOpenCheck,Users} from "lucide-react"
const inp="w-full mt-1.5 bg-white dark:bg-[#20362A] border border-stone2 rounded-xl px-3.5 py-3 text-sm font-medium"
export function About(){ const {t}=useApp(); return <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12"><PageTitle title={t("about_t")}/>
 <div className="space-y-5 mt-6 text-[15px] leading-relaxed">
 <p className="font-serif italic text-2xl text-forest">"Har Kaam Ka Aasan Raasta."</p>
 <p>{t("about_p1")}</p>
 <p>{t("about_p2a")} <strong>{t("about_p2b")}</strong></p>
 <div className="grid sm:grid-cols-3 gap-4 not-prose">{t("about_cards").map(([ct,cd],i)=>{ const I=[Users,BookOpenCheck,ShieldCheck][i]; return <div key={t} className="bg-white dark:bg-[#20362A] border border-stone2 rounded-3xl p-5"><I className="text-forest" size={22}/><h2 className="font-display font-bold mt-3">{ct}</h2><p className="text-sm text-muted mt-1.5 leading-relaxed">{cd}</p></div> })}</div>
 <p className="text-sm bg-white dark:bg-[#20362A] border border-stone2 rounded-2xl p-4"><strong>{t("about_note_a")}</strong> {t("about_note_b")}</p>
 <div className="flex flex-wrap gap-3 pt-2"><Link to="/explore" className="bg-forest text-white px-5 py-3 rounded-full font-bold text-sm">{t("about_explore")}</Link><Link to="/how-it-works" className="px-5 py-3 rounded-full font-bold text-sm border-2 border-ink/15">{t("about_how")}</Link></div></div></main> }
export function HowItWorks(){ const {t}=useApp(); const steps=t("how_page_steps").map((s2,i)=>[String(i+1),s2[0],s2[1]]); return <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-12"><PageTitle title={t("how_t")} desc={t("how_desc")}/>
 <div className="grid md:grid-cols-3 gap-5 mt-9">{steps.map(([n,t,d])=><div key={n} className="bg-white dark:bg-[#20362A] border border-stone2 dark:border-white/10 rounded-3xl p-6"><span className="font-display font-extrabold text-4xl text-forest">{n}</span><h2 className="font-display font-bold text-lg mt-3">{t}</h2><p className="text-muted text-sm mt-1.5 leading-relaxed">{d}</p></div>)}</div>
 <div className="bg-deep text-white rounded-3xl p-7 mt-8"><h2 className="font-display font-extrabold text-xl">{t("how_info_t")}</h2><p className="text-white/75 text-sm mt-2 leading-relaxed">{t("how_info_b")}</p></div>
 <div className="flex flex-wrap gap-3 mt-8"><Link to="/finder" className="bg-forest text-white px-5 py-3 rounded-full font-bold text-sm">{t("how_find")}</Link><Link to="/explore" className="px-5 py-3 rounded-full font-bold text-sm border-2 border-ink/15">{t("how_explore")}</Link></div></main> }
export function Contact(){ const {toast,submitContact,t}=useApp(); const [f,setF]=useState({name:"",email:"",msg:""}); const [err,setErr]=useState(""); const [sentLocal,setSentLocal]=useState(false)
 const submit=async e=>{ e.preventDefault(); if(f.name.trim().length<2) return setErr(t("err_name")); if(!/^\S+@\S+\.\S+$/.test(f.email)) return setErr(t("err_email")); if(f.msg.trim().length<10) return setErr(t("err_msg_short")); setErr("");
  try{ await submitContact({name:f.name,email:f.email,subject:"Website contact form",message:f.msg}); setSentLocal(true); toast(t("toast_contact_sent")) }catch(err){ setErr(err.message||t("err_contact")) } }
 return <main className="max-w-2xl mx-auto px-4 pt-12"><PageTitle title={t("contact_t")} desc={t("contact_desc")}/>
 <div className="bg-[#EAF3EC] dark:bg-white/5 border border-forest/30 rounded-2xl p-4 text-sm mt-6"><strong>{t("contact_connected_a")}</strong> {t("contact_connected_b")}</div>
 {sentLocal?<div className="bg-white dark:bg-[#20362A] border border-stone2 rounded-3xl p-7 mt-6 text-center"><p className="font-display font-bold text-xl">{t("contact_sent_t")}</p><p className="text-muted text-sm mt-2">{t("contact_sent_b")}</p><button onClick={()=>{setSentLocal(false); setF({name:"",email:"",msg:""})}} className="mt-5 font-bold text-forest text-sm">{t("write_another")}</button></div>:
 <form onSubmit={submit} className="bg-white dark:bg-[#20362A] border border-stone2 rounded-3xl p-6 sm:p-7 mt-6 space-y-4">
  <label className="block"><span className="text-sm font-bold">{t("your_name")}</span><input value={f.name} onChange={e=>setF({...f,name:e.target.value})} className={inp}/></label>
  <label className="block"><span className="text-sm font-bold">{t("email")}</span><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} className={inp}/></label>
  <label className="block"><span className="text-sm font-bold">{t("message")}</span><textarea rows="5" value={f.msg} onChange={e=>setF({...f,msg:e.target.value})} className={inp}/></label>
  {err&&<p role="alert" className="text-[13px] font-semibold text-[#B3371F]">{err}</p>}
  <button className="bg-forest text-white px-6 py-3.5 rounded-full font-bold text-sm">{t("send_msg")}</button></form>}</main> }
export function ReportIssue(){ const {toast,guides,submitReport,t}=useApp(); const [params]=useSearchParams(); const [f,setF]=useState({guide:params.get("guide")||"",detail:""}); const [err,setErr]=useState(""); const [done,setDone]=useState(false)
 const submit=async e=>{ e.preventDefault(); if(!f.guide) return setErr(t("err_report_guide")); if(f.detail.trim().length<10) return setErr(t("err_report_detail")); setErr(""); try{ await submitReport(f.guide,{issueType:"wrong-information",description:f.detail,relevantSection:""}); setDone(true); toast(t("toast_report_sent")) }catch(err){ setErr(err.message||t("err_report")) } }
 return <main className="max-w-2xl mx-auto px-4 pt-12"><PageTitle title={t("report_t")} desc={t("report_desc")}/>
 <div className="bg-[#EAF3EC] dark:bg-white/5 border border-forest/30 rounded-2xl p-4 text-sm mt-6"><strong>{t("contact_connected_a")}</strong> {t("report_connected_b")}</div>
 {done?<div className="bg-white dark:bg-[#20362A] border border-stone2 rounded-3xl p-7 mt-6 text-center"><p className="font-display font-bold text-xl">{t("report_done_t")}</p><p className="text-muted text-sm mt-2">{t("report_done_b")}</p><Link to="/explore" className="inline-block mt-5 bg-forest text-white px-5 py-3 rounded-full font-bold text-sm">{t("back_guides_btn")}</Link></div>:
 <form onSubmit={submit} className="bg-white dark:bg-[#20362A] border border-stone2 rounded-3xl p-6 sm:p-7 mt-6 space-y-4">
  <label className="block"><span className="text-sm font-bold">{t("which_guide")}</span><select value={f.guide} onChange={e=>setF({...f,guide:e.target.value})} className={inp}><option value="">{t("select_guide")}</option>{guides.map(g=><option key={g.slug} value={g.slug}>{g.title}</option>)}</select></label>
  <label className="block"><span className="text-sm font-bold">{t("what_wrong")}</span><textarea rows="5" value={f.detail} onChange={e=>setF({...f,detail:e.target.value})} placeholder={t("report_ph")} className={inp}/></label>
  {err&&<p role="alert" className="text-[13px] font-semibold text-[#B3371F]">{err}</p>}
  <button className="bg-forest text-white px-6 py-3.5 rounded-full font-bold text-sm">{t("send_report")}</button></form>}</main> }
export function Privacy(){ const {t}=useApp(); return <main className="max-w-3xl mx-auto px-4 pt-12"><PageTitle title={t("privacy_t")} desc={t("privacy_desc")}/><div className="space-y-4 mt-6 text-sm leading-relaxed text-muted">{t("privacy_ps").map(([h,b],i)=><p key={i}><strong className="text-ink">{h}</strong> {b}</p>)}</div></main> }
export function Terms(){ const {t}=useApp(); return <main className="max-w-3xl mx-auto px-4 pt-12"><PageTitle title={t("terms_t")} desc={t("terms_desc")}/><div className="space-y-4 mt-6 text-sm leading-relaxed text-muted">{t("terms_ps").map(([h,b],i)=><p key={i}><strong className="text-ink">{h}</strong> {b}</p>)}</div></main> }
export function NotFound(){ const {t}=useApp(); return <main className="max-w-3xl mx-auto px-4 pt-20 text-center"><p className="font-display font-extrabold text-7xl text-forest">404</p><h1 className="font-display font-extrabold text-2xl mt-4">{t("nf_t")}</h1><p className="text-muted mt-2">{t("nf_b")}</p><div className="flex flex-wrap justify-center gap-3 mt-7"><Link to="/" className="bg-forest text-white px-6 py-3.5 rounded-full font-bold">{t("nf_home")}</Link><Link to="/finder" className="px-6 py-3.5 rounded-full font-bold border-2 border-ink/15">{t("nf_find")}</Link></div></main> }
