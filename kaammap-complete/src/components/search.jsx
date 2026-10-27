import {useEffect,useMemo,useRef,useState} from "react"
import {useNavigate} from "react-router-dom"
import {Search,ArrowRight,FileQuestion,X} from "lucide-react"
import {motion,AnimatePresence} from "framer-motion"
import {guides,guideCategories} from "../data/guides"
import {catName} from "./ui"
import {useApp} from "../context/AppContext"
export function searchGuides(q,list,cats){ const src=list&&list.length?list:guides; const s=(q||"").toLowerCase().trim(); if(!s) return []
 const words=s.split(/\s+/).filter(w=>w.length>1)
 return src.map(g=>{ const hay=(g.title+" "+g.short+" "+(g.ur?.title||"")+" "+(g.ur?.short||"")+" "+catName(g.category,cats)+" "+(g.ur&&cats?(cats.find(c=>c.slug===g.category)?.name||""):"")+" "+(g.keywords||[]).join(" ")+" "+(g.ur?.keywords||[]).join(" ")).toLowerCase(); let score=0
  if(hay.includes(s)) score+=10; (g.keywords||[]).forEach(k=>{ if(k.includes(s)||s.includes(k)) score+=6 }); words.forEach(w=>{ if(hay.includes(w)) score+=2 }); return {g,score} }).filter(x=>x.score>=4).sort((a,b)=>b.score-a.score).map(x=>x.g)
}
export default function SearchBar({big=false,autoFocus=false}){ const nav=useNavigate(); const {guides:liveGuides,categories,t}=useApp(); const [q,setQ]=useState(""); const [open,setOpen]=useState(false); const [idx,setIdx]=useState(0); const ref=useRef(null); const inputRef=useRef(null)
 const results=useMemo(()=>searchGuides(q,liveGuides,categories).slice(0,6),[q,liveGuides,categories])
 useEffect(()=>{ setIdx(0); setOpen(q.trim().length>1) },[q])
 useEffect(()=>{ const f=e=>{ if(ref.current&&!ref.current.contains(e.target)) setOpen(false) }; document.addEventListener("mousedown",f); return ()=>document.removeEventListener("mousedown",f) },[])
 const go=(slug)=>{ if(slug){ nav("/guides/"+slug) } else if(q.trim()){ nav("/explore?q="+encodeURIComponent(q)) } setOpen(false) }
 const onKey=e=>{ if(e.key==="ArrowDown"){ e.preventDefault(); setIdx(i=>Math.min(results.length-1,i+1)) } else if(e.key==="ArrowUp"){ e.preventDefault(); setIdx(i=>Math.max(0,i-1)) } else if(e.key==="Enter"){ e.preventDefault(); go(results[idx]?.slug) } else if(e.key==="Escape"){ setOpen(false) } }
 return <div ref={ref} className="relative w-full">
  <div className={`bg-white dark:bg-[#20362A] border-2 rounded-full flex items-center shadow-soft transition ${open?"border-forest shadow-lift":"border-stone2 focus-within:border-forest"}`}>
   <Search className="ml-4 text-muted shrink-0" size={big?22:19}/>
   <input ref={inputRef} size={1} value={q} autoFocus={autoFocus} onChange={e=>setQ(e.target.value)} onFocus={()=>q.trim().length>1&&setOpen(true)} onKeyDown={onKey} placeholder={t("search_ph")} aria-label={t("search_aria")} role="combobox" aria-expanded={open} aria-controls="search-results" className={`flex-1 min-w-0 px-2.5 bg-transparent outline-none ${big?"py-4 text-[16px]":"py-3 text-[15px]"}`}/>{q&&<button type="button" aria-label={t("aria_clear_search")} onClick={()=>{setQ("");setOpen(false);inputRef.current&&inputRef.current.focus()}} className="shrink-0 p-2 mr-1 rounded-full text-muted hover:bg-black/5 dark:hover:bg-white/10 hover:text-ink dark:hover:text-white active:scale-90 transition"><X size={16}/></button>}
   <button onClick={()=>go(results[0]?.slug)} className={`bg-forest text-white rounded-full font-bold shrink-0 whitespace-nowrap active:scale-95 transition ${big?"px-4 sm:px-6 py-3 mr-1.5 text-[15px]":"px-4 py-2 mr-1 text-sm"}`}>{t("search_btn")}</button>
  </div>
  <AnimatePresence>{open&&<motion.ul id="search-results" role="listbox" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:4}} transition={{duration:.18}} className="absolute z-50 inset-x-0 top-full mt-2 bg-white dark:bg-[#20362A] border border-stone2 dark:border-white/10 rounded-3xl shadow-lift overflow-hidden text-left">
   {results.length?results.map((g,i)=><li key={g.slug} role="option" aria-selected={i===idx}><button onMouseEnter={()=>setIdx(i)} onClick={()=>go(g.slug)} className={`w-full flex items-center gap-3 px-4.5 px-5 py-3.5 transition ${i===idx?"bg-[#EAF3EC] dark:bg-forest/20":""}`}><span className="flex-1 min-w-0"><span className="block font-bold text-sm truncate">{g.title}</span><span className="block text-xs text-muted truncate">{catName(g.category,categories)} · {g.scope}</span></span><ArrowRight size={15} className="text-forest shrink-0"/></button></li>):
   <li className="px-5 py-4.5 py-5 flex gap-3 items-start"><FileQuestion className="text-coral shrink-0 mt-0.5" size={19}/><span className="text-sm"><strong>{t("search_none_t",{q})}</strong><span className="block text-muted mt-0.5">{t("search_none_b")}</span><button onClick={()=>{nav("/explore"); setOpen(false)}} className="font-bold text-forest mt-1.5 inline-block">{t("search_browse")}</button></span></li>}
  </motion.ul>}</AnimatePresence></div>
}
