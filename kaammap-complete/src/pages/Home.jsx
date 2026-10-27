import {useState} from "react"
import {Link,useNavigate} from "react-router-dom"
import {motion} from "framer-motion"
import {Search,ArrowRight,ShieldCheck,FileCheck2,MousePointerClick,ListChecks,Printer,Compass,Sparkles} from "lucide-react"
import {useApp} from "../context/AppContext"
import {GuideCard,Photo,SectionHead,VerifyBadge} from "../components/ui"
import SearchBar from "../components/search"
import {heroImages,imageForCategory} from "../data/images"
const fade={initial:{opacity:0,y:22},whileInView:{opacity:1,y:0},viewport:{once:true,margin:"-60px"},transition:{duration:.5,ease:"easeOut"}}
const popular=["new-passport","cnic-services","learner-licence-punjab","university-admission","scholarship-application","job-application-documents"]
export default function Home(){
 const {guides,categories,t,lang}=useApp(); const nav=useNavigate()
 const popularGuides=popular.map(s=>guides.find(g=>g.slug===s)).filter(Boolean)
 const featured=guides.filter(g=>g.level==="checked")
 return <main className="overflow-x-clip">
  {/* HERO */}
  <section className="relative"><div className="absolute inset-0 dotgrid opacity-60 pointer-events-none" aria-hidden="true"/>
   <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-20 grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center">
   <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:"easeOut"}}>
    <span className="inline-flex items-center gap-2 bg-white dark:bg-white/10 border border-stone2 px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-[0.14em] text-forest shadow-soft"><Sparkles size={13}/> {t("hero_badge")}</span>
    <h1 className="font-display font-extrabold text-[38px] sm:text-[54px] xl:text-[60px] leading-[1.05] tracking-tight mt-5">{t("hero_h1a")} <span className="relative inline-block text-forest">{t("hero_h1b")}<svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 9 C30 2, 90 2, 118 8" stroke="#D9F36A" strokeWidth="5" strokeLinecap="round" fill="none"/></svg></span> {t("hero_h1c")}</h1>
    <p className="text-muted mt-5 text-[16px] leading-relaxed max-w-lg">{t("hero_sub")}</p>
    <div className="mt-7 max-w-xl"><SearchBar big/></div>
    <div className="flex flex-wrap items-center gap-2 mt-4"><span className="text-xs font-bold text-muted">{t("hero_try")}</span>{t("try_chips").map(s=><button key={s} onClick={()=>nav("/explore?q="+encodeURIComponent(s))} className="text-[13px] font-semibold bg-white/80 dark:bg-white/10 border border-stone2 px-3 py-1.5 rounded-full hover:border-forest hover:text-forest active:scale-95 transition">{s}</button>)}</div>
    <div className="flex flex-wrap gap-3 mt-8"><Link to="/finder" className="bg-ink dark:bg-lime dark:text-ink text-white px-6 py-3.5 rounded-full font-bold inline-flex items-center gap-2 hover:gap-3 transition-all shadow-soft"><Compass size={17}/> {t("hero_find")}</Link><Link to="/explore" className="px-6 py-3.5 rounded-full font-bold border-2 border-ink/15 hover:border-forest hover:text-forest bg-white/60 dark:bg-transparent">{t("hero_explore")}</Link></div>
    <p className="text-xs text-muted mt-6 flex items-center gap-2"><ShieldCheck size={15} className="text-forest shrink-0"/> {t("hero_indep")}</p>
   </motion.div>
   <motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:.6,delay:.12,ease:"easeOut"}} className="relative max-w-[560px] w-full mx-auto lg:mx-0">
    <Photo eager id={heroImages.main} alt={lang==="ur"?"طلبہ کلاس روم میں اپنی درخواستیں تیار کرتے ہوئے":"Students in a classroom preparing their applications"} className="rounded-[32px] h-[320px] sm:h-[420px] shadow-lift" imgClassName="hover:scale-105 transition duration-700"/>
    <motion.div animate={{y:[0,-7,0]}} transition={{duration:5,repeat:Infinity,ease:"easeInOut"}} className="absolute -bottom-9 left-3 sm:-left-5 bg-white dark:bg-[#20362A] rounded-[22px] shadow-lift border border-stone2 dark:border-white/10 p-5 w-[300px] max-w-[88vw]">
     <div className="flex items-center justify-between"><p className="font-display font-bold text-[13px] flex items-center gap-1.5"><FileCheck2 size={15} className="text-forest"/> {t("hero_card_t")}</p><span className="text-[10px] font-extrabold bg-forest text-white px-2 py-0.5 rounded-full">{t("hero_card_tag")}</span></div>
     <ul className="mt-3 space-y-2 text-[13px]">{t("hero_card_items").map((t,i)=><li key={t} className="flex items-center gap-2.5"><span className={`w-5 h-5 rounded-md grid place-items-center text-[11px] font-extrabold ${i<2?"bg-forest text-white":"border-2 border-stone2 text-transparent"}`}>✓</span><span className={i<2?"":"text-muted"}>{t}</span></li>)}</ul>
     <div className="mt-3.5 pt-3 border-t border-dashed border-stone2 flex items-center justify-between"><span className="text-xs font-semibold text-muted">{t("hero_card_fee")}</span><span className="font-display font-extrabold tabular">Rs. 9,000</span></div>
     <p className="text-[10.5px] text-muted mt-1.5">{t("hero_card_note")}</p>
    </motion.div>

   </motion.div></div>
  </section>
  {/* HOW IT WORKS timeline */}
  <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
   <motion.div {...fade}><SectionHead eyebrow={t("how_eyebrow")} title={t("how_title")} to="/how-it-works" cta={t("how_cta")}/></motion.div>
   <div className="relative mt-10"><div className="hidden md:block absolute top-7 left-[16%] right-[16%] border-t-2 border-dashed border-forest/30" aria-hidden="true"/>
   <div className="grid md:grid-cols-3 gap-9 md:gap-6">{t("how_steps").map(([ht,hd],i)=>{ const I=[MousePointerClick,FileCheck2,ListChecks][i]; return <motion.div key={ht} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.12,duration:.45}} className="relative text-center md:px-4">
     <span className="relative z-10 w-14 h-14 mx-auto rounded-full bg-forest text-lime grid place-items-center shadow-lift ring-8 ring-ivory dark:ring-[#12241C]"><I size={23}/></span>
     <h3 className="font-display font-extrabold text-xl mt-4">{i+1}. {ht}</h3><p className="text-muted text-sm mt-2 leading-relaxed max-w-xs mx-auto">{hd}</p></motion.div> }) }</div></div>
  </section>
  {/* POPULAR GUIDES */}
  <section className="mt-16 sm:mt-24 bg-white/70 dark:bg-white/[0.03] border-y border-stone2 dark:border-white/5 py-14 sm:py-16"><div className="max-w-7xl mx-auto px-4 sm:px-6">
   <motion.div {...fade}><SectionHead eyebrow={t("pop_eyebrow")} title={t("pop_title")} sub={t("pop_sub")} to="/explore" cta={t("pop_cta")}/></motion.div>
   <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-9">{popularGuides.map(g=><GuideCard key={g.slug} g={g}/>)}</div>
  </div></section>
  {/* CATEGORIES */}
  <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
   <motion.div {...fade}><SectionHead eyebrow={t("cat_eyebrow")} title={t("cat_title")} to="/categories" cta={t("cat_cta")}/></motion.div>
   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-8">{categories.map((c,i)=><motion.div key={c.slug} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:(i%4)*.07,duration:.4}}><Link to={`/categories/${c.slug}`} className="group relative block rounded-[26px] overflow-hidden shadow-soft hover:shadow-lift transition h-48 sm:h-56"><Photo id={imageForCategory(c.slug)} alt={c.name} className="absolute inset-0" imgClassName="group-hover:scale-[1.07] transition duration-700"/><div className="absolute inset-0 bg-gradient-to-t from-[#08170F]/95 via-[#08170F]/40 to-transparent"/><div className="absolute inset-x-0 bottom-0 p-5"><h3 className="font-display font-extrabold text-white text-[17px] leading-tight drop-shadow">{c.name}</h3><span className="inline-flex items-center gap-1 text-lime text-xs font-bold mt-2 group-hover:gap-2 transition-all">{t(guides.filter(g=>g.category===c.slug).length===1?"count_one":"count_many",{n:guides.filter(g=>g.category===c.slug).length})} <ArrowRight size={13}/></span></div></Link></motion.div>)}</div>
  </section>
  {/* FEATURED CHECKED GUIDES */}
  <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24">
   <motion.div {...fade}><SectionHead eyebrow={t("feat_eyebrow")} title={t("feat_title")} sub={t("feat_sub")}/></motion.div>
   <div className="mt-8 divide-y divide-stone2 dark:divide-white/10 border-y border-stone2 dark:border-white/10">{featured.map((g,i)=><motion.div key={g.slug} {...fade} transition={{duration:.4,delay:i*.05}}><Link to={`/guides/${g.slug}`} className="group flex flex-wrap items-center gap-4 py-5">
     <span className="font-display font-extrabold text-2xl text-forest/35 tabular w-10">0{i+1}</span>
     <span className="flex-1 min-w-[220px]"><span className="font-display font-bold text-lg group-hover:text-forest block leading-snug">{g.title}</span><span className="text-sm text-muted">{g.authority} · {g.scope}</span></span>
     <VerifyBadge g={g}/><ArrowRight className="text-forest group-hover:translate-x-1.5 transition" size={19}/></Link></motion.div>)}</div>
  </section>
  {/* TOOLS STRIP */}
  <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24">
   <div className="bg-deep text-white rounded-[32px] p-7 sm:p-10 grid md:grid-cols-3 gap-8 relative overflow-hidden"><div className="absolute inset-0 dotgrid-light opacity-40" aria-hidden="true"/>
    {t("tools").map(([tt,dd],i)=>{ const I=[FileCheck2,ListChecks,Printer][i]; return <div key={tt} className="relative"><span className="w-11 h-11 rounded-2xl bg-lime/15 grid place-items-center"><I size={21} className="text-lime"/></span><h3 className="font-display font-bold text-lg mt-3.5">{tt}</h3><p className="text-white/70 text-sm mt-1.5 leading-relaxed">{dd}</p></div> })}
   </div>
  </section>
  {/* FINDER CTA + FINAL */}
  <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24">
   <div className="grid lg:grid-cols-2 rounded-[32px] overflow-hidden shadow-soft border border-stone2 dark:border-white/10">
    <Photo id={heroImages.docs} alt={lang==="ur"?"ایک شخص میز پر دستاویزات اور نوٹس ترتیب دیتے ہوئے":"A person organising documents and notes at a desk"} className="h-60 lg:h-auto min-h-[260px]" imgClassName="hover:scale-105 transition duration-700"/>
    <div className="bg-lime text-ink p-7 sm:p-11 flex flex-col justify-center"><h2 className="font-display font-extrabold text-[26px] sm:text-[32px] leading-tight">{t("finder_h")}</h2><p className="mt-3 text-[15px] leading-relaxed text-ink/75 max-w-md">{t("finder_p")}</p><div><Link to="/finder" className="inline-flex items-center gap-2 bg-ink text-white px-6 py-3.5 rounded-full font-bold mt-6 hover:gap-3 transition-all">{t("finder_btn")} <ArrowRight size={16}/></Link></div></div>
   </div>
   <div className="text-center px-6 py-14"><h2 className="font-display font-extrabold text-3xl sm:text-4xl">{t("final_h")}</h2><p className="text-muted mt-3 font-serif italic text-lg">{t("final_sub")}</p><div className="flex flex-wrap justify-center gap-3 mt-7"><Link to="/explore" className="bg-forest text-white px-6 py-3.5 rounded-full font-bold">{t("final_explore")}</Link><Link to="/saved" className="px-6 py-3.5 rounded-full font-bold border-2 border-ink/15">{t("final_saved")}</Link></div></div>
  </section>
 </main>
}
