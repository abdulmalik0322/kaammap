import {createContext,useContext,useEffect,useMemo,useRef,useState,useCallback} from "react"
import {API_MODE,apiGet,apiPost,apiPatch,apiPut,apiDelete,setAccessToken} from "../lib/api"
import {STR} from "../i18n/ui"
import {locGuide,locCategory} from "../i18n/loc"
const Ctx=createContext(null); export const useApp=()=>useContext(Ctx)
const load=(k,f)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):f }catch{ return f } }
const save=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)) }catch{} }
const toItems=p=>[...(p?.docs||[]).map(i=>"d"+i),...(p?.steps||[]).map(i=>"s"+i)]
const fromItems=items=>{ const docs=[],steps=[]; (items||[]).forEach(id=>{ const n=parseInt(String(id).slice(1),10); if(String(id).startsWith("d")&&!Number.isNaN(n))docs.push(n); if(String(id).startsWith("s")&&!Number.isNaN(n))steps.push(n) }); return {docs,steps} }

export function AppProvider({children}){
 const [theme,setTheme]=useState(()=>load("km_theme","light"))
 const [lang,setLangState]=useState(()=>load("km_lang","en"))
 const [savedGuides,setSavedGuides]=useState(()=>load("km_saved",[]))
 const [progress,setProgress]=useState(()=>load("km_progress",{}))
 const [recent,setRecent]=useState(()=>load("km_recent",[]))
 const [user,setUserState]=useState(null)
 const [issues,setIssues]=useState(()=>load("km_issues",[]))
 const [toasts,setToasts]=useState([])
 // --- Data (bundled in standalone mode, API in API mode) ---
 const [dataGuides,setDataGuides]=useState([])
 const [dataCats,setDataCats]=useState([])
 const [dataLoading,setDataLoading]=useState(true)
 const [dataError,setDataError]=useState("")
 const [authReady,setAuthReady]=useState(false)
 const syncedUserRef=useRef(null)

 const toast=useCallback((msg,type="success")=>{ const id=Date.now()+Math.random(); setToasts(t=>[...t,{id,msg,type}]); setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3400) },[])
 const setLang=useCallback((l)=>{ if(l==="en"||l==="ur") setLangState(l) },[])
 const t=useCallback((key,vars)=>{ let v=(STR[lang]&&STR[lang][key])!==undefined?STR[lang][key]:STR.en[key]; if(v===undefined) return key; if(typeof v==="string"&&vars) for(const [k,val] of Object.entries(vars)) v=v.split("{"+k+"}").join(String(val)); return v },[lang])

 const reloadData=useCallback(async()=>{
   setDataLoading(true); setDataError("")
   try{
     const [cats,gs]=await Promise.all([apiGet("/categories"),apiGet("/guides?limit=50")])
     setDataCats(Array.isArray(cats)?cats:(cats.items||[]))
     setDataGuides(gs.items||gs||[])
   }catch(e){ setDataError(e.message||"Could not load guides from the server.") }
   finally{ setDataLoading(false) }
 },[])
 useEffect(()=>{ reloadData() },[reloadData])

 // --- Session restore + server sync (API mode) ---
 const syncForUser=useCallback(async(u)=>{
   if(!u) return
   try{ const s=await apiGet("/users/me/saved-guides"); const slugs=(s.items||s||[]).map(it=>it.guide?.slug||it.slug||it.guideSlug).filter(Boolean); setSavedGuides(slugs) }catch{ /* keep local list */ }
 },[])
 useEffect(()=>{
   ;(async()=>{
     try{ const r=await apiPost("/auth/refresh"); if(r?.accessToken){ setAccessToken(r.accessToken); const me=await apiGet("/auth/me"); const u=me.user||me; setUserState(u); syncedUserRef.current=u?.id||u?._id; if(u&&(u.preferredLanguage==="ur"||u.preferredLanguage==="en")) setLangState(u.preferredLanguage); await syncForUser(u) } }
     catch{ setUserState(null) }
     finally{ setAuthReady(true) }
   })()
 },[syncForUser])

 const applySession=useCallback(async(data)=>{
   if(data?.accessToken) setAccessToken(data.accessToken)
   const u=data?.user||null; setUserState(u); syncedUserRef.current=u?.id||u?._id; if(u&&(u.preferredLanguage==="ur"||u.preferredLanguage==="en")) setLangState(u.preferredLanguage)
   if(u) await syncForUser(u)
   return u
 },[syncForUser])
 const login=useCallback(async(email,password)=>{ const d=await apiPost("/auth/login",{email,password}); return applySession(d) },[applySession])
 const register=useCallback(async(name,email,password)=>{ const d=await apiPost("/auth/register",{name,email,password}); await applySession(d).catch(()=>{}); return d },[applySession])
 const logout=useCallback(async()=>{
   if(API_MODE){ try{ await apiPost("/auth/logout") }catch{} setAccessToken(null) }
   setUserState(null); syncedUserRef.current=null
   setSavedGuides(load("km_saved",[])); setProgress(load("km_progress",{}))
 },[])
 const forgotPassword=useCallback((email)=>apiPost("/auth/forgot-password",{email}),[])
 const resetPassword=useCallback((email,code,password)=>apiPost("/auth/reset-password",{email,code,password}),[])
 const verifyEmail=useCallback((token)=>apiPost("/auth/verify-email",{token}),[])
 const resendVerification=useCallback(()=>apiPost("/auth/resend-verification"),[])
 const updateProfile=useCallback(async(patch)=>{ const d=await apiPatch("/users/me",patch); const u=d.user||d; setUserState(u); return u },[])
 const changePassword=useCallback((currentPassword,newPassword)=>apiPatch("/users/me/password",{currentPassword,newPassword}),[])
 const deleteAccount=useCallback(async()=>{ await apiDelete("/users/me"); await logout() },[logout])
 const submitContact=useCallback((data)=>apiPost("/contact",data),[])
 const submitReport=useCallback((slug,data)=>apiPost(`/guides/${slug}/report-issue`,data),[])
 const loadProgress=useCallback(async(slug)=>{
   if(!API_MODE||!syncedUserRef.current) return
   try{ const d=await apiGet(`/users/me/progress/${slug}`); setProgress(p=>({...p,[slug]:fromItems(d.completedItems||[])})) }catch{ /* no saved progress yet */ }
 },[])

 // --- Theme + guest persistence ---
 useEffect(()=>{ document.documentElement.classList.toggle("dark",theme==="dark"); save("km_theme",theme) },[theme])
 useEffect(()=>{ save("km_lang",lang); const el=document.documentElement; el.lang=lang==="ur"?"ur":"en"; el.dir=lang==="ur"?"rtl":"ltr" },[lang])
 useEffect(()=>{ if(API_MODE&&user&&(user.preferredLanguage==="ur"||user.preferredLanguage==="en")&&user.preferredLanguage!==lang){ updateProfile({preferredLanguage:lang}).catch(()=>{}) } },[lang,user]) // eslint-disable-line
 const guestMode=!user
 useEffect(()=>{ if(guestMode) save("km_saved",savedGuides) },[savedGuides,guestMode])
 useEffect(()=>{ if(guestMode) save("km_progress",progress) },[progress,guestMode])
 useEffect(()=>save("km_recent",recent),[recent])
 useEffect(()=>save("km_issues",issues),[issues])

 const toggleSaveGuide=useCallback((slug)=>{
   const has=savedGuides.includes(slug)
   setSavedGuides(s=>has?s.filter(x=>x!==slug):[...s,slug])
   toast(has?t("toast_removed"):t("toast_saved"))
   if(API_MODE&&user){
     const req=has?apiDelete(`/users/me/saved-guides/${slug}`):apiPost(`/users/me/saved-guides/${slug}`)
     req.catch(()=>{ setSavedGuides(s=>has?[...s,slug]:s.filter(x=>x!==slug)); toast(t("toast_sync_fail"),"error") })
   }
 },[savedGuides,user,toast,t])
 const markViewed=useCallback((slug)=>{ setRecent(r=>[slug,...r.filter(x=>x!==slug)].slice(0,6)) },[])
 const pushProgress=useCallback((slug,next)=>{
   if(API_MODE&&user){ apiPut(`/users/me/progress/${slug}`,{completedItems:toItems(next)}).catch(()=>toast(t("toast_progress_fail"),"error")) }
 },[user,toast,t])
 const toggleCheck=useCallback((slug,kind,idx)=>{ setProgress(p=>{ const cur=p[slug]||{docs:[],steps:[]}; const arr=cur[kind]||[]; const nextArr=arr.includes(idx)?arr.filter(x=>x!==idx):[...arr,idx]; const next={...cur,[kind]:nextArr}; pushProgress(slug,next); return {...p,[slug]:next} }) },[pushProgress])
 const resetProgress=useCallback((slug)=>{ setProgress(p=>({...p,[slug]:{docs:[],steps:[]}})); if(API_MODE&&user){ apiDelete(`/users/me/progress/${slug}`).catch(()=>{}) } },[user])
 const guideProgress=useCallback((g)=>{ const p=progress[g.slug]||{docs:[],steps:[]}; const total=(g.documents?.length||0)+(g.steps?.length||0); const done=(p.docs?.length||0)+(p.steps?.length||0); return {done,total,pct:total?Math.round(done/total*100):0,docs:p.docs||[],steps:p.steps||[]} },[progress])
 const locGuides=useMemo(()=>dataGuides.map(g=>locGuide(g,lang)),[dataGuides,lang])
 const locCats=useMemo(()=>dataCats.map(c=>locCategory(c,lang)),[dataCats,lang])
 const getGuide=useCallback((slug)=>locGuides.find(g=>g.slug===slug),[locGuides])

 const value={lang,setLang,t,theme,setTheme,toggleTheme:()=>setTheme(t=>t==="dark"?"light":"dark"),savedGuides,setSavedGuides,toggleSaveGuide,progress,toggleCheck,resetProgress,guideProgress,recent,markViewed,user,issues,setIssues,toasts,toast,
  guides:locGuides,categories:locCats,getGuide,dataLoading,dataError,reloadData,apiMode:API_MODE,authReady,login,register,logout,forgotPassword,resetPassword,verifyEmail,resendVerification,updateProfile,changePassword,deleteAccount,submitContact,submitReport,loadProgress}
 return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
