export const fmtRs = n => { if(n===null||n===undefined) return "Confirm officially"; const v=Number(n); if(!isFinite(v)) return "Confirm officially"; if(v===0) return "Free"; return "Rs. "+Math.round(v).toLocaleString("en-PK") }
export const fmtDate = d => { if(!d) return "—"; try{ return new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}) }catch{ return d } }
