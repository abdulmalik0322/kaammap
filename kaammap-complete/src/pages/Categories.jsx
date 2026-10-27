import {Link,useParams} from "react-router-dom"
import {motion} from "framer-motion"
import {useApp} from "../context/AppContext"
import {GuideCard,PageTitle,EmptyState,Photo,CategoryCard} from "../components/ui"
import {imageForCategory} from "../data/images"
export function Categories(){ const {guides,categories,t}=useApp(); return <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10"><PageTitle title={t("cats_title")} desc={t("cats_desc")}/>
 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-9">{categories.map((c,i)=><motion.div key={c.slug} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:(i%3)*.07,duration:.4}}><CategoryCard c={c} count={guides.filter(g=>g.category===c.slug).length}/></motion.div>)}</div>
 <p className="text-sm text-muted mt-8 max-w-2xl">{t("cats_note")}</p></main> }
export function CategoryDetails(){ const {slug}=useParams(); const {guides,categories,t}=useApp(); const c=categories.find(x=>x.slug===slug); if(!c) return <main className="max-w-4xl mx-auto px-4 pt-12"><EmptyState title={t("cat_notfound_t")} body={t("cat_notfound_b")} cta={t("cat_notfound_cta")} to="/categories"/></main>
 const list=guides.filter(g=>g.category===slug); const related=categories.filter(x=>x.slug!==slug).slice(0,4)
 return <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8"><Link to="/categories" className="text-sm font-bold text-forest">{t("back_cats")}</Link>
  <div className="relative rounded-[32px] overflow-hidden mt-4 shadow-soft"><Photo id={imageForCategory(slug)} alt={c.name} className="h-60 sm:h-72 w-full"/><div className="absolute inset-0 bg-gradient-to-t from-[#0E241B]/88 via-[#0E241B]/35 to-transparent"/>
   <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8"><h1 className="font-display font-extrabold text-3xl sm:text-[40px] text-white leading-tight">{c.name}</h1><p className="text-white/85 text-sm sm:text-[15px] mt-2 max-w-2xl leading-relaxed">{c.desc}</p></div></div>
  <div className="mt-9">{list.length?<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">{list.map(g=><GuideCard key={g.slug} g={g}/>)}</div>:<EmptyState title={t("coming_t")} body={t("coming_b")} cta={t("coming_cta")} to="/finder"/>}</div>
  <section className="mt-14"><h2 className="font-display font-extrabold text-2xl">{t("other_cats")}</h2><div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">{related.map(x=><div key={x.slug}><CategoryCard c={x} count={guides.filter(g=>g.category===x.slug).length}/></div>)}</div></section></main> }
