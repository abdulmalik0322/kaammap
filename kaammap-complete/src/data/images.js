// Photo IDs verified live (HTTP 200) from images.unsplash.com — checked Oct 2026
export const categoryImages={
 "identity-civil":"1521791136064-7986c2920216",
 "travel-passport":"1436491865332-7a61a109cc05",
 "driving-transport":"1449965408869-eaa3f722e40d",
 "education-admissions":"1541339907198-e08756dedf3f",
 "scholarships-aid":"1522202176988-66273c2fd55f",
 "jobs-employment":"1507679799987-c73779587ccf",
 "government-services":"1517048676732-d65bc937f952",
 "everyday-processes":"1511895426328-dc8714191300",
}
export const guideImages={
 "new-passport":"1436491865332-7a61a109cc05",
 "passport-renewal":"1521791136064-7986c2920216",
 "cnic-services":"1454165804606-c3d57bc86b40",
 "learner-licence-punjab":"1449965408869-eaa3f722e40d",
 "permanent-licence-punjab":"1449824913935-59a10b8d2000",
 "university-admission":"1541339907198-e08756dedf3f",
 "scholarship-application":"1522202176988-66273c2fd55f",
 "job-application-documents":"1507679799987-c73779587ccf",
}
export const heroImages={ main:"1517486808906-6ca8b3f04846", docs:"1454165804606-c3d57bc86b40", students:"1522202176988-66273c2fd55f", campus:"1562774053-701939374585", family:"1511895426328-dc8714191300", meeting:"1517048676732-d65bc937f952" }
export const photoUrl=(id,w=1000)=>`https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`
export const imageForGuide=g=>guideImages[g.slug]||categoryImages[g.category]||heroImages.main
export const imageForCategory=slug=>categoryImages[slug]||heroImages.main
