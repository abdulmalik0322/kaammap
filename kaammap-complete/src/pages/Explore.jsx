import {useEffect,useMemo,useState} from "react"
import {useSearchParams} from "react-router-dom"
import {LayoutGrid,List,SlidersHorizontal,SearchX} from "lucide-react"
import {motion,AnimatePresence} from "framer-motion"
import {useApp} from "../context/AppContext"
import {GuideCard,SkeletonGrid,EmptyState,PageTitle,Photo} from "../components/ui"
import SearchBar,{searchGuides} from "../components/search"
import {imageForCategory} from "../data/images"
const PROVINCES=["all","Punjab","Nationwide"]
export default function Explore(){
 const {guides,categories,t}=useApp(); const [params,setParams]=useSearchParams()
 const [loading,setLoading]=useState(true); const [view,setView]=useState("grid"); const [showFilters,setShowFilters]=useState(false)
 const [q,setQ]=useState(params.get("q")||""); const [cat,setCat]=useState("all"); const [prov,setProv]=useState("all"); const [level,setLevel]=useState("all"); const [sort,setSort]=useState("relevant")
 useEffect(()=>{ setQ(params.get("q")||"") },[params])
 useEffect(()=>{ setLoading(true); const t=setTimeout(()=>setLoading(false),400); return ()=>clearTimeout(t) },[q,cat,prov,level,sort])
 const results=useMemo(()=>{ let base=guides
   if(q.trim()){ const matched=searchGuides(q,guides,categories); const ids=new Set(matched.map(g=>g.slug)); base=guides.filter(g=>ids.has(g.slug)); if(sort==="relevant") base=matched }
   let list=base.filter(g=>(cat==="all"||g.category===cat)&&(level==="all"||g.level===level)&&(prov==="all"||(prov==="Punjab"?g.scope.toLowerCase().includes("punjab"):g.scope.toLowerCase().includes("nationwide"))))
   if(sort==="az") list=[...list].sort((a,b)=>a.title.localeCompare(b.title)); if(sort==="za") list=[...list].sort((a,b)=>b.title.localeCompare(a.title)); return list },[guides,q,cat,prov,level,sort])
 const others=guides.filter(g=>!results.some(r=>r.slug===g.slug)).slice(0,3)
 const activeCount=[cat,prov,level].filter(v=>v!=="all").length+(q?1:0)
 const clear=()=>{ setQ(""); setCat("all"); setProv("all"); setLevel("all"); setSort("relevant"); setParams({}) }
 const Filters=<div className="space-y-5">
  {[[t("f_category"),cat,setCat,[["all",t("f_all_cats")],...categories.map(c=>[c.slug,c.name])]],[t("f_applies"),prov,setProv,[["all",t("f_all_pk")],["Nationwide",t("f_nationwide")],["Punjab",t("f_punjab")]]],[t("f_status"),level,setLevel,[["all",t("f_status_all")],["checked",t("f_checked")],["partial",t("f_partial")],["preparation",t("f_prep")]]]].map(([label,val,set,opts])=><label key={label} className="block"><span className="text-sm font-bold">{label}</span><select value={val} onChange={e=>set(e.target.value)} className="w-full mt-1.5 bg-white dark:bg-[#20362A] border border-stone2 rounded-xl px-3 py-2.5 text-sm font-medium">{opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>)}
  <button onClick={clear} className="w-full border-2 border-ink/15 dark:border-white/20 bg-black/[0.03] dark:bg-white/5 rounded-full py-2.5 font-bold text-sm hover:border-coral hover:text-[#9A3B26] dark:hover:text-coral transition">{t("clear_all")}</button></div>
 return <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
  <PageTitle title={t("exp_title")} desc={t("exp_desc")}/>
  <div className="mt-7 max-w-2xl">{params.get("focus")?<SearchBar big autoFocus/>:<SearchBar big/>}</div>
  {q&&<p className="mt-3 text-sm text-muted">{t("showing_for")} <strong className="text-forest dark:text-lime">"{q}"</strong> — <button onClick={clear} className="font-bold text-forest">{t("clear_search")}</button></p>}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-7" aria-label={t("browse_aria")}>{categories.map(c=><button key={c.slug} onClick={()=>setCat(cat===c.slug?"all":c.slug)} aria-pressed={cat===c.slug} className={`group relative w-full h-[104px] sm:h-[120px] rounded-3xl overflow-hidden text-left shadow-soft ${cat===c.slug?"ring-[3px] ring-forest ring-offset-2":""}`}><Photo id={imageForCategory(c.slug)} alt="" className="absolute inset-0"/><span className="absolute inset-0 bg-gradient-to-t from-[#08170F]/95 via-[#08170F]/40 to-transparent"/><span className="absolute bottom-3 left-3.5 right-3 font-display font-bold text-white text-sm leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{c.name}</span></button>)}</div>
  <div className="flex flex-col lg:flex-row gap-8 mt-7">
   <aside className="hidden lg:block w-64 shrink-0"><div className="bg-white dark:bg-[#20362A] border border-stone2 dark:border-white/10 rounded-3xl p-5 sticky top-32"><h2 className="font-display font-bold mb-4 flex items-center gap-2"><SlidersHorizontal size={17}/> {t("f_title")}{activeCount>0&&<span className="bg-lime text-ink text-[11px] font-extrabold px-2 py-0.5 rounded-full ml-1">{t("f_active",{n:activeCount})}</span>}</h2>{Filters}</div></aside>
   <div className="flex-1 min-w-0">
    <div className="flex flex-wrap items-center gap-3 mb-5 bg-white dark:bg-[#20362A] border border-stone2 dark:border-white/10 rounded-2xl px-4 py-3 shadow-sm"><p className="font-semibold text-sm" aria-live="polite">{loading?t("searching"):t(results.length===1?"count_one":"count_many",{n:results.length})}</p>
     <button onClick={()=>setShowFilters(!showFilters)} className="lg:hidden ml-auto px-4 py-2 rounded-full border border-stone2 dark:border-white/15 bg-white dark:bg-[#20362A] dark:text-white font-semibold text-sm flex items-center gap-2"><SlidersHorizontal size={15}/> {t("filters_btn")}</button>
     <label className="sm:ml-auto flex items-center gap-2 text-sm font-semibold">{t("sort_label")} <select value={sort} onChange={e=>setSort(e.target.value)} className="bg-white dark:bg-[#20362A] border border-stone2 rounded-xl px-3 py-2 text-sm"><option value="relevant">{t("sort_relevant")}</option><option value="az">{t("sort_az")}</option><option value="za">{t("sort_za")}</option></select></label>
     <div className="flex border border-stone2 rounded-full overflow-hidden bg-white dark:bg-white/10"><button aria-label={t("aria_grid")} onClick={()=>setView("grid")} className={`p-2.5 ${view==="grid"?"bg-forest text-white":""}`}><LayoutGrid size={17}/></button><button aria-label={t("aria_list")} onClick={()=>setView("list")} className={`p-2.5 ${view==="list"?"bg-forest text-white":""}`}><List size={17}/></button></div></div>
    <AnimatePresence>{showFilters&&<motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.25,ease:"easeOut"}} className="lg:hidden overflow-hidden"><div className="bg-white dark:bg-[#20362A] border border-stone2 dark:border-white/10 rounded-3xl p-5 mb-5">{Filters}</div></motion.div>}</AnimatePresence>
    {loading?<SkeletonGrid/>:results.length===0?<div className="bg-white dark:bg-[#20362A] border border-dashed border-stone2 dark:border-white/15 rounded-3xl p-8 sm:p-10 text-center"><span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-mint dark:bg-white/10 text-forest dark:text-lime mb-4"><SearchX size={26}/></span><h3 className="font-display font-extrabold text-xl">{t("none_t")}</h3><p className="text-sm text-muted mt-2 max-w-md mx-auto leading-relaxed">{t("none_b")}</p><div className="flex flex-wrap justify-center gap-2 mt-5">{t("none_chips").map(s=><button key={s} onClick={()=>setQ(s)} className="px-4 py-2 rounded-full border border-stone2 dark:border-white/15 text-sm font-semibold hover:border-forest hover:text-forest transition">{s}</button>)}</div><button onClick={()=>{setQ("");setCat("all");setProv("all");setLevel("all")}} className="mt-6 bg-forest text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#1B6247] active:scale-[.97] transition">{t("none_clear")}</button></div>:<div className={view==="grid"?`grid sm:grid-cols-2 xl:grid-cols-3 gap-5 ${results.length===1?"[&>*]:max-w-[440px]":""}`:"space-y-4"}>{results.map(g=><GuideCard key={g.slug} g={g} list={view==="list"}/>)}</div>}
    {!loading&&results.length>0&&results.length<3&&others.length>0&&<section className="mt-14"><h2 className="font-display font-extrabold text-[22px]">{t("also_t")}</h2><p className="text-sm text-muted mt-1">{t("also_b")}</p><div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">{others.map(g=><GuideCard key={g.slug} g={g}/>)}</div></section>}
   </div></div></main>
}
