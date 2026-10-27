// Merge a guide/category's `ur` translation object over the English fields.
// Arrays are index-aligned with the English originals; anything missing in
// Urdu falls back to the English item. Slugs, amounts, dates, URLs and
// status values are shared and never translated here.
export function locCategory(c, lang) {
  if (lang !== "ur" || !c || !c.ur) return c
  return { ...c, name: c.ur.name || c.name, desc: c.ur.desc || c.desc }
}

function zip(arr, uarr, fields) {
  return (arr || []).map((item, i) => {
    const t = uarr && uarr[i]
    if (!t) return item
    const o = { ...item }
    for (const f of fields) if (t[f] !== undefined && t[f] !== "") o[f] = t[f]
    return o
  })
}

export function locGuide(g, lang) {
  if (lang !== "ur" || !g || !g.ur) return g
  const u = g.ur
  return {
    ...g,
    title: u.title || g.title,
    short: u.short || g.short,
    authority: u.authority || g.authority,
    scope: u.scope || g.scope,
    whoFor: u.whoFor || g.whoFor,
    verifyNote: u.verifyNote || g.verifyNote,
    keywords: [...(g.keywords || []), ...(u.keywords || [])],
    documents: zip(g.documents, u.documents, ["name", "desc", "note"]),
    fees: zip(g.fees, u.fees, ["name", "applies"]),
    steps: (g.steps || []).map((s, i) => {
      const t = u.steps && u.steps[i]
      if (!t) return s
      return {
        ...s,
        title: t.title || s.title,
        desc: t.desc || s.desc,
        link: s.link ? { ...s.link, label: t.linkLabel || s.link.label } : s.link,
      }
    }),
    applyAt: zip(g.applyAt, u.applyAt, ["label", "desc"]),
    sources: zip(g.sources, u.sources, ["desc"]),
    notes: (g.notes || []).map((n, i) => (u.notes && u.notes[i]) || n),
    faqs: zip(g.faqs, u.faqs, ["q", "a"]),
    feesUnavailable: u.feesUnavailableText || g.feesUnavailable,
  }
}
