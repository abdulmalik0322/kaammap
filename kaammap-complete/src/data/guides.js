export const guideCategories=[
 {
  "slug": "identity-civil",
  "name": "Identity & Civil Documents",
  "desc": "CNIC, B-Form, family certificates and other NADRA identity services \u2014 what to bring and where to go."
 },
 {
  "slug": "travel-passport",
  "name": "Travel & Passport",
  "desc": "New passports, renewals and travel documents, explained step by step with official fees."
 },
 {
  "slug": "driving-transport",
  "name": "Driving & Transport",
  "desc": "Learner permits and permanent driving licences, by province and licensing authority."
 },
 {
  "slug": "education-admissions",
  "name": "Education & Admissions",
  "desc": "Getting your documents ready for university and college admissions in Pakistan."
 },
 {
  "slug": "scholarships-aid",
  "name": "Scholarships & Financial Aid",
  "desc": "Prepare a complete scholarship application \u2014 documents, certificates and common requirements."
 },
 {
  "slug": "jobs-employment",
  "name": "Jobs & Employment",
  "desc": "The documents almost every job application in Pakistan asks for, ready before you apply."
 },
 {
  "slug": "government-services",
  "name": "Government Services",
  "desc": "Everyday government services and certificates, gathered in one place."
 },
 {
  "slug": "everyday-processes",
  "name": "Other Everyday Processes",
  "desc": "Small but important life processes that are hard to figure out the first time."
 }
]

export const guides=[
 {
  "slug": "new-passport",
  "title": "New Pakistani Passport (E-Passport)",
  "short": "Apply for your first Pakistani e-passport: documents, official DGIP fees, and every step at the passport office.",
  "category": "travel-passport",
  "authority": "Directorate General of Immigration & Passports (DGIP)",
  "scope": "Pakistan (nationwide)",
  "level": "checked",
  "verifiedDate": "2026-10-24",
  "verifyNote": "Fee amounts follow the DGIP e-passport fee schedule published on the official DGIP website (dgip.gov.pk \u2014 site and fee section checked directly on 24 Oct 2026; amounts cross-checked against national reports of the schedule). DGIP announced machine-readable passports are discontinued from 23 Oct 2026. Always confirm the amount on the DGIP website before paying \u2014 schedules can change.",
  "whoFor": "Pakistani citizens applying for a passport for the first time. If you already have a passport that is expiring, use the renewal guide instead.",
  "keywords": [
   "passport",
   "new passport",
   "first passport",
   "passport fee",
   "e-passport",
   "passport apply",
   "passport documents",
   "safar",
   "travel document",
   "passport banana"
  ],
  "documents": [
   {
    "name": "Original CNIC or NICOP",
    "desc": "Your valid national identity card. Your passport record is verified against NADRA data, so your CNIC details must be correct and up to date.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Photocopy of CNIC / NICOP",
    "desc": "Carry at least one clear photocopy along with the original.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Fee payment proof",
    "desc": "Original bank-paid fee challan, or e-payment confirmation (receipt / SMS / email with the PSID number). Pay only the official fee for your chosen category.",
    "status": "required",
    "note": ""
   },
   {
    "name": "NOC from your department",
    "desc": "No Objection Certificate if you are a government, semi-government or autonomous-body employee.",
    "status": "conditional",
    "note": "Only for government employees."
   },
   {
    "name": "Foreign passport (dual nationals)",
    "desc": "Your current foreign passport and a photocopy, if you hold dual nationality.",
    "status": "conditional",
    "note": "Only for dual nationals."
   },
   {
    "name": "Parents' CNIC copies + CRC / B-Form",
    "desc": "For applicants under 18: copies of both parents' CNICs and the child's NADRA Child Registration Certificate (B-Form).",
    "status": "conditional",
    "note": "Only for minors."
   }
  ],
  "fees": [
   {
    "name": "E-Passport, 36 pages \u2014 Normal (5 years)",
    "amount": 9000,
    "applies": "New application, normal processing",
    "source": "DGIP e-passport schedule announced Oct 2026",
    "checked": "2026-10-24"
   },
   {
    "name": "E-Passport, 36 pages \u2014 Urgent (5 years)",
    "amount": 15000,
    "applies": "New application, urgent processing",
    "source": "DGIP e-passport schedule announced Oct 2026",
    "checked": "2026-10-24"
   },
   {
    "name": "E-Passport, 36 pages \u2014 Normal (10 years)",
    "amount": 13500,
    "applies": "New application, normal processing",
    "source": "DGIP e-passport schedule announced Oct 2026",
    "checked": "2026-10-24"
   },
   {
    "name": "E-Passport, 36 pages \u2014 Urgent (10 years)",
    "amount": 22500,
    "applies": "New application, urgent processing",
    "source": "DGIP e-passport schedule announced Oct 2026",
    "checked": "2026-10-24"
   },
   {
    "name": "E-Passport, 72 pages \u2014 Normal (5 years)",
    "amount": 16500,
    "applies": "For frequent travellers",
    "source": "DGIP e-passport schedule announced Oct 2026",
    "checked": "2026-10-24"
   },
   {
    "name": "E-Passport, 72 pages \u2014 Urgent (10 years)",
    "amount": 40500,
    "applies": "72 pages, longest + fastest option",
    "source": "DGIP e-passport schedule announced Oct 2026",
    "checked": "2026-10-24"
   }
  ],
  "steps": [
   {
    "title": "Check your CNIC first",
    "desc": "Make sure your CNIC/NICOP is valid and your name, date of birth and parents' names are spelled exactly as you want them on the passport. Fix NADRA record errors before applying.",
    "link": null
   },
   {
    "title": "Choose pages, validity & speed",
    "desc": "Decide 36 or 72 pages, 5 or 10 years validity, and normal or urgent processing. Your fee depends on this choice.",
    "link": null
   },
   {
    "title": "Pay the official fee",
    "desc": "Pay through the bank challan or official e-payment channels \u2014 DGIP also offers online fee payment via QR code \u2014 and keep the challan / PSID proof safe. If you apply fully online, the fee is paid by credit/debit card and, per DGIP, is not refundable. Never pay an agent an 'extra' unofficial amount.",
    "link": null
   },
   {
    "title": "Visit your passport office",
    "desc": "Go to your Regional Passport Office (RPO) with all documents \u2014 the in-person process starts with token issuance, so arrive early. You can also start through DGIP's online passport service on its e-Services page (link below).",
    "link": {
     "label": "DGIP official website",
     "url": "https://dgip.gov.pk"
    }
   },
   {
    "title": "Token, data entry, photo & biometrics",
    "desc": "At the counters your documents are checked, your photograph and fingerprints are taken, and you confirm your printed details before submission. Read every spelling carefully.",
    "link": null
   },
   {
    "title": "Collect your passport",
    "desc": "You receive a collection slip/token receipt. Collect the passport on the date given, or use the delivery option if offered at your office.",
    "link": null
   }
  ],
  "applyAt": [
   {
    "label": "DGIP \u2014 Official Website",
    "url": "https://dgip.gov.pk",
    "desc": "Directorate General of Immigration & Passports: official information, office lists and online services."
   },
   {
    "label": "DGIP Online Passport Service (e-Services)",
    "url": "https://dgip.gov.pk/eServices/online-passport.php",
    "desc": "DGIP's official online application and online renewal service. The online fee is paid by credit/debit card and is not refundable."
   },
   {
    "label": "Regional Passport Office",
    "url": "",
    "desc": "Apply in person at the passport office of your district/region. Office lists are published on the DGIP website \u2014 KAAMMAP does not invent office addresses."
   }
  ],
  "notes": [
   "DGIP's official announcement states machine-readable passports are discontinued from 23 October 2026 and only e-Passports are issued by passport offices and foreign missions. Older machine-readable passports stay valid until their printed expiry date.",
   "Requirements can differ for minors, government employees and dual nationals \u2014 see the conditional documents in the checklist.",
   "Official fees can change. Confirm the current schedule on the DGIP website on the day you pay."
  ],
  "faqs": [
   {
    "q": "Can I apply for a passport without a CNIC?",
    "a": "No. A valid CNIC or NICOP is the base document for a passport application. If you are 18 or older and do not have one yet, first complete the CNIC guide on KAAMMAP."
   },
   {
    "q": "Is the old machine-readable passport still valid?",
    "a": "Yes \u2014 existing machine-readable passports remain valid until their expiry date. New applications are now issued as e-passports."
   },
   {
    "q": "Do I need an agent?",
    "a": "No. The process is designed for citizens to complete themselves. KAAMMAP exists so you can prepare everything before you go."
   }
  ],
  "related": [
   "passport-renewal",
   "cnic-services"
  ],
  "sources": [
   {
    "name": "Directorate General of Immigration & Passports (DGIP)",
    "url": "https://dgip.gov.pk",
    "desc": "Official authority for Pakistani passports."
   },
   {
    "name": "DGIP e-passport fee schedule \u2014 announced Oct 2026",
    "url": "https://dgip.gov.pk",
    "desc": "Fee schedule as announced by DGIP and reported nationally in October 2026. Confirm current amounts on the official site."
   },
   {
    "name": "DGIP \u2014 E-Passport (official)",
    "url": "https://dgip.gov.pk/eServices/epassport.php",
    "desc": "Official e-Passport information with the fee section, on the DGIP website (checked 24 Oct 2026)."
   }
  ]
 },
 {
  "slug": "passport-renewal",
  "title": "Pakistani Passport Renewal (E-Passport)",
  "short": "Renew an expiring or expired Pakistani passport: what to bring, the current e-passport fees, and the office process.",
  "category": "travel-passport",
  "authority": "Directorate General of Immigration & Passports (DGIP)",
  "scope": "Pakistan (nationwide)",
  "level": "checked",
  "verifiedDate": "2026-10-24",
  "verifyNote": "Renewals are now issued as e-passports under the DGIP schedule (DGIP website checked directly on 24 Oct 2026; machine-readable passports discontinued from 23 Oct 2026 per DGIP's announcement). Confirm the amount for your category on the official DGIP website before paying.",
  "whoFor": "Citizens whose passport is expired or expiring soon. You can generally renew before expiry \u2014 you do not need to wait for the last day.",
  "keywords": [
   "passport renewal",
   "renew passport",
   "passport expire",
   "passport renew fee",
   "old passport",
   "passport tajdeed"
  ],
  "documents": [
   {
    "name": "Previous passport (original)",
    "desc": "Your most recent passport book. The office needs it to transfer your record to the new e-passport.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Photocopy of previous passport",
    "desc": "A clear copy of the data pages of your old passport.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Original CNIC or NICOP + photocopy",
    "desc": "Your valid identity card and one photocopy.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Fee payment proof",
    "desc": "Bank challan or e-payment confirmation (PSID) for your chosen renewal category.",
    "status": "required",
    "note": ""
   },
   {
    "name": "NOC from your department",
    "desc": "Only if you are a government / semi-government employee.",
    "status": "conditional",
    "note": "Only for government employees."
   }
  ],
  "fees": [
   {
    "name": "E-Passport renewal, 36 pages \u2014 Normal (5 years)",
    "amount": 9000,
    "applies": "Standard renewal",
    "source": "DGIP e-passport schedule announced Oct 2026",
    "checked": "2026-10-24"
   },
   {
    "name": "E-Passport renewal, 36 pages \u2014 Urgent (5 years)",
    "amount": 15000,
    "applies": "Faster processing",
    "source": "DGIP e-passport schedule announced Oct 2026",
    "checked": "2026-10-24"
   },
   {
    "name": "E-Passport renewal, 36 pages \u2014 Normal (10 years)",
    "amount": 13500,
    "applies": "Longer validity",
    "source": "DGIP e-passport schedule announced Oct 2026",
    "checked": "2026-10-24"
   },
   {
    "name": "E-Passport renewal, 36 pages \u2014 Urgent (10 years)",
    "amount": 22500,
    "applies": "Longer validity + urgent",
    "source": "DGIP e-passport schedule announced Oct 2026",
    "checked": "2026-10-24"
   }
  ],
  "steps": [
   {
    "title": "Gather your old passport & CNIC",
    "desc": "Keep your previous passport and valid CNIC ready. If your CNIC is expired, renew the CNIC first.",
    "link": null
   },
   {
    "title": "Choose your category & pay the fee",
    "desc": "Pick pages, validity and normal/urgent, then pay the official fee and keep the payment proof.",
    "link": null
   },
   {
    "title": "Visit the passport office",
    "desc": "Take all documents to your Regional Passport Office and take a token \u2014 or use DGIP's official online renewal service on its e-Services page.",
    "link": {
     "label": "DGIP official website",
     "url": "https://dgip.gov.pk"
    }
   },
   {
    "title": "Verification, photo & biometrics",
    "desc": "Your old passport and CNIC are verified, a fresh photo and fingerprints are taken, and you confirm your details.",
    "link": null
   },
   {
    "title": "Collect the new e-passport",
    "desc": "Collect on the date on your slip. Your old passport is cancelled/returned as per office practice \u2014 ask at the counter if you need it for old visas.",
    "link": null
   }
  ],
  "applyAt": [
   {
    "label": "DGIP \u2014 Official Website",
    "url": "https://dgip.gov.pk",
    "desc": "Official passport authority: information and office lists."
   },
   {
    "label": "DGIP Online Passport Renewal (e-Services)",
    "url": "https://dgip.gov.pk/eServices/online-passport.php",
    "desc": "DGIP's official online renewal service. The online fee is paid by credit/debit card and is not refundable."
   },
   {
    "label": "Regional Passport Office",
    "url": "",
    "desc": "Renewals are processed at passport offices. Find yours on the DGIP website."
   }
  ],
  "notes": [
   "Lost or stolen passports follow a different process with extra steps (including a police report) \u2014 ask the passport office; do not use the simple renewal path.",
   "If your name or other CNIC details changed, update the NADRA record first so the new passport prints correctly.",
   "Fees can change \u2014 confirm on the DGIP website before paying."
  ],
  "faqs": [
   {
    "q": "My passport expired years ago. Can I still renew?",
    "a": "Yes, an expired passport can be renewed through the same office process. Bring the old passport and a valid CNIC."
   },
   {
    "q": "Will I get an e-passport on renewal?",
    "a": "Yes. Renewals since October 2026 are issued as e-passports under the new system."
   },
   {
    "q": "What if my old passport is lost?",
    "a": "Report the loss (police report / FIR as required) and inform the passport office \u2014 lost-passport cases have additional verification and may have different fees. Confirm the current requirements with DGIP."
   }
  ],
  "related": [
   "new-passport",
   "cnic-services"
  ],
  "sources": [
   {
    "name": "Directorate General of Immigration & Passports (DGIP)",
    "url": "https://dgip.gov.pk",
    "desc": "Official authority for Pakistani passports."
   }
  ]
 },
 {
  "slug": "cnic-services",
  "title": "CNIC Services \u2014 New, Renewal, Modification & Smart CNIC",
  "short": "NADRA CNIC explained simply: first card, renewal, changes and duplicates, with the official fee table and both ways to apply.",
  "category": "identity-civil",
  "authority": "NADRA (National Database & Registration Authority)",
  "scope": "Pakistan (nationwide)",
  "level": "checked",
  "verifiedDate": "2026-10-24",
  "verifyNote": "Fees below follow NADRA's published fee schedule as checked in October 2026. NADRA revises fees from time to time \u2014 the amount shown in the Pak-ID app or at the centre on your visit is final.",
  "whoFor": "Citizens aged 18+ who need a first CNIC, a renewal, a correction (modification), or a duplicate after loss. Under-18s use the CRC (B-Form) instead.",
  "keywords": [
   "cnic",
   "nic",
   "smart cnic",
   "nadra",
   "id card",
   "identity card",
   "cnic renewal",
   "cnic fee",
   "pak id",
   "shanakhti card",
   "new cnic"
  ],
  "documents": [
   {
    "name": "For a FIRST CNIC: birth certificate, B-Form/CRC, or matric certificate",
    "desc": "One document that proves your birth record, plus a parent's or sibling's CNIC copy for family verification. NADRA may accept family-record verification where a birth document is genuinely unavailable \u2014 ask at the centre.",
    "status": "required",
    "note": "First-time applicants only."
   },
   {
    "name": "For RENEWAL: your current / expired CNIC",
    "desc": "Bring the card being renewed. If it is lost, say so \u2014 you will apply for a duplicate instead.",
    "status": "required",
    "note": "Renewal & duplicate applicants."
   },
   {
    "name": "For MODIFICATION: proof of the change",
    "desc": "For example a marriage certificate (Nikah Nama) for a name/status change, or a corrected educational record. Requirements depend on what is changing.",
    "status": "conditional",
    "note": "Modification applicants only."
   },
   {
    "name": "A family member for verification (first CNIC)",
    "desc": "For a first card, a blood relative (parent/sibling) may need to attest/verify your application at the centre.",
    "status": "conditional",
    "note": "First-time applicants."
   }
  ],
  "fees": [
   {
    "name": "New CNIC \u2014 Normal",
    "amount": 0,
    "applies": "First CNIC, normal processing is free",
    "source": "NADRA published fee schedule",
    "checked": "2026-10-24"
   },
   {
    "name": "New CNIC \u2014 Urgent",
    "amount": 1150,
    "applies": "First CNIC, faster",
    "source": "NADRA published fee schedule",
    "checked": "2026-10-24"
   },
   {
    "name": "New CNIC \u2014 Executive",
    "amount": 2150,
    "applies": "First CNIC, fastest",
    "source": "NADRA published fee schedule",
    "checked": "2026-10-24"
   },
   {
    "name": "CNIC renewal / modification / duplicate \u2014 Normal",
    "amount": 400,
    "applies": "Standard card",
    "source": "NADRA published fee schedule",
    "checked": "2026-10-24"
   },
   {
    "name": "CNIC renewal / modification / duplicate \u2014 Urgent",
    "amount": 1150,
    "applies": "Standard card, faster",
    "source": "NADRA published fee schedule",
    "checked": "2026-10-24"
   },
   {
    "name": "Smart CNIC (new / renewal / duplicate) \u2014 Normal",
    "amount": 750,
    "applies": "Chip-based Smart card",
    "source": "NADRA published fee schedule",
    "checked": "2026-10-24"
   },
   {
    "name": "Smart CNIC \u2014 Urgent",
    "amount": 1500,
    "applies": "Smart card, faster",
    "source": "NADRA published fee schedule",
    "checked": "2026-10-24"
   },
   {
    "name": "Smart CNIC \u2014 Executive",
    "amount": 2500,
    "applies": "Smart card, fastest",
    "source": "NADRA published fee schedule",
    "checked": "2026-10-24"
   }
  ],
  "steps": [
   {
    "title": "Choose your route: Pak-ID app or NADRA centre",
    "desc": "Many services (renewal, duplicate, modification) can be started from home in the official Pak-ID app. First-time applicants and biometric issues are usually handled at a NADRA Registration Centre.",
    "link": {
     "label": "NADRA official website",
     "url": "https://nadra.gov.pk"
    }
   },
   {
    "title": "Take a token & submit the form",
    "desc": "At the centre you get a token, your form is filled/verified, and you confirm every detail \u2014 especially name spellings and date of birth.",
    "link": null
   },
   {
    "title": "Biometrics & photograph",
    "desc": "Your fingerprints and photo are captured. This is why the applicant must appear in person for most services.",
    "link": null
   },
   {
    "title": "Pay the fee for your category",
    "desc": "Pay the Normal, Urgent or Executive fee for your service. Keep the receipt/token slip safe.",
    "link": null
   },
   {
    "title": "Track & receive your card",
    "desc": "Track with your tracking ID (SMS / Pak-ID app). The card is delivered or collected as per your chosen service.",
    "link": null
   }
  ],
  "applyAt": [
   {
    "label": "NADRA \u2014 Official Website",
    "url": "https://nadra.gov.pk",
    "desc": "Official NADRA services, fee schedule and centre information."
   },
   {
    "label": "Pak-ID (official NADRA app/portal)",
    "url": "https://id.nadra.gov.pk",
    "desc": "NADRA's official online identity services portal."
   },
   {
    "label": "NADRA Registration Centre",
    "url": "",
    "desc": "Visit any NADRA centre. KAAMMAP does not list centre addresses \u2014 use NADRA's official centre locator."
   }
  ],
  "notes": [
   "Never share your CNIC number publicly or with agents online. Apply yourself through official channels.",
   "A first CNIC on the normal track is free \u2014 anyone demanding a large 'fee' for it is not official.",
   "Fees and processing categories can change. The Pak-ID app shows the live amount before you pay."
  ],
  "faqs": [
   {
    "q": "What is the difference between CNIC and Smart CNIC?",
    "a": "The Smart CNIC is a chip-based card with extra security features and carries a different fee. Both are valid identity documents."
   },
   {
    "q": "Can I renew my CNIC fully online?",
    "a": "Renewals and several other services can be completed through the official Pak-ID app, including in-app biometric verification. Some cases may still require a centre visit."
   },
   {
    "q": "My CNIC is lost. What do I apply for?",
    "a": "Apply for a duplicate CNIC through Pak-ID or a NADRA centre. The normal-track fee for a duplicate is listed in the fee table above."
   }
  ],
  "related": [
   "new-passport",
   "job-application-documents"
  ],
  "sources": [
   {
    "name": "NADRA \u2014 Official Website",
    "url": "https://nadra.gov.pk",
    "desc": "National Database & Registration Authority."
   },
   {
    "name": "Pak-ID \u2014 NADRA Online Services",
    "url": "https://id.nadra.gov.pk",
    "desc": "Official online application portal."
   }
  ]
 },
 {
  "slug": "learner-licence-punjab",
  "title": "Driving Learner Licence \u2014 Punjab",
  "short": "Get your Punjab learner permit online through DLIMS/Dastak: eligibility, the Rs. 500 fee, and how the 42-day rule works.",
  "category": "driving-transport",
  "authority": "Punjab Traffic Police \u2014 DLIMS / Dastak",
  "scope": "Punjab only",
  "level": "checked",
  "verifiedDate": "2026-10-24",
  "verifyNote": "Learner fee, validity and the 42-day rule follow the Punjab DLIMS fee/rule information as checked in October 2026. Other provinces use their own systems \u2014 this guide is Punjab-specific.",
  "whoFor": "Punjab residents who meet the minimum age for their vehicle category (for example 18 for a car) and hold a valid CNIC.",
  "keywords": [
   "learner licence",
   "learner license",
   "driving licence punjab",
   "dlims",
   "learner permit",
   "license banana",
   "driving test",
   "learner fee"
  ],
  "documents": [
   {
    "name": "Original CNIC",
    "desc": "A valid CNIC is required. For the online application you will upload front/back images, so keep clear photos ready.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Passport-size photograph",
    "desc": "A recent photograph for the online application upload.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Medical certificate",
    "desc": "Required for applicants above the age threshold (commonly 50+) or for commercial categories (LTV/HTV).",
    "status": "conditional",
    "note": "Age / category dependent."
   }
  ],
  "fees": [
   {
    "name": "Learner permit \u2014 per vehicle category",
    "amount": 500,
    "applies": "For example motorcycle or car; charged per category you select",
    "source": "Punjab DLIMS fee information",
    "checked": "2026-10-24"
   }
  ],
  "steps": [
   {
    "title": "Create your account",
    "desc": "Register on the official Dastak portal/app or DLIMS Punjab using your CNIC and mobile number.",
    "link": {
     "label": "DLIMS Punjab (official)",
     "url": "https://dlims.punjab.gov.pk"
    }
   },
   {
    "title": "Apply for a learner permit",
    "desc": "Select 'Learner Licence', choose your vehicle category (you can select more than one), and fill in your details carefully.",
    "link": null
   },
   {
    "title": "Upload documents",
    "desc": "Upload clear images of your CNIC and photograph. Blurry uploads are a common reason for delays.",
    "link": null
   },
   {
    "title": "Pay through PSID",
    "desc": "The system generates a PSID (payment slip ID). Pay it through your banking app, Easypaisa/JazzCash or e-Pay Punjab.",
    "link": null
   },
   {
    "title": "Download your e-learner",
    "desc": "After payment, download/print your learner permit from the portal. It is valid for 6 months.",
    "link": null
   },
   {
    "title": "Practise for at least 42 days",
    "desc": "You can only take the permanent licence test after holding the learner for at least 42 days.",
    "link": null
   }
  ],
  "applyAt": [
   {
    "label": "DLIMS Punjab \u2014 Official Portal",
    "url": "https://dlims.punjab.gov.pk",
    "desc": "Punjab driving licence system: applications, verification, tracking and e-licence."
   },
   {
    "label": "Dastak Punjab",
    "url": "https://dastak.punjab.gov.pk",
    "desc": "Punjab government's one-window services portal, now used for licence applications."
   },
   {
    "label": "Police Khidmat Markaz",
    "url": "",
    "desc": "You can also apply in person at any Police Khidmat Markaz in Punjab with your original CNIC."
   }
  ],
  "notes": [
   "This guide is for Punjab only. Sindh, KP, Balochistan and Islamabad have separate licensing authorities and portals.",
   "A learner permit is not a full licence \u2014 follow learner rules and always practise responsibly with a licensed driver.",
   "If a website does not end in .gov.pk, it is not the official Punjab portal."
  ],
  "faqs": [
   {
    "q": "How long is a learner permit valid?",
    "a": "Six months. But you must hold it for at least 42 days before you can take the permanent licence test."
   },
   {
    "q": "Can I get the learner permit fully online?",
    "a": "Yes, in Punjab the learner permit is issued online through Dastak/DLIMS after PSID payment \u2014 no test is needed at this stage."
   },
   {
    "q": "I live in Karachi. Does this guide apply to me?",
    "a": "No. Sindh has its own licensing authority and process. This guide covers Punjab only."
   }
  ],
  "related": [
   "permanent-licence-punjab",
   "cnic-services"
  ],
  "sources": [
   {
    "name": "DLIMS Punjab \u2014 Official Portal",
    "url": "https://dlims.punjab.gov.pk",
    "desc": "Punjab Traffic Police / PITB driving licence system."
   },
   {
    "name": "Dastak \u2014 Government of Punjab",
    "url": "https://dastak.punjab.gov.pk",
    "desc": "Official one-window portal for Punjab government services."
   }
  ]
 },
 {
  "slug": "permanent-licence-punjab",
  "title": "Permanent Driving Licence \u2014 Punjab",
  "short": "After 42 days on a learner permit: book your test on DLIMS/Dastak, pass the sign and driving tests, and get your permanent licence.",
  "category": "driving-transport",
  "authority": "Punjab Traffic Police \u2014 DLIMS / Dastak",
  "scope": "Punjab only",
  "level": "partial",
  "verifiedDate": "2026-10-25",
  "verifyNote": "Process steps and the 42-day rule follow Punjab DLIMS/PKM rules \u2014 the six-week (42-day) learner requirement is stated on the official Police Khidmat Markaz services page and by Punjab Police. New-licence fees depend on vehicle category and the validity years you choose; the example annual rates were read from DLIMS/Dastak fee information in October 2026 and the final total appears on your PSID \u2014 confirm it before paying. The renewal and duplicate fees were read on the official PKM services page on 25 October 2026.",
  "whoFor": "Punjab residents who have held a learner permit for at least 42 days and are ready for the theory (sign) and practical driving tests.",
  "keywords": [
   "permanent licence",
   "regular licence",
   "driving test punjab",
   "licence fee car",
   "motorcycle licence",
   "dlims test",
   "full licence"
  ],
  "documents": [
   {
    "name": "Learner permit (at least 42 days old)",
    "desc": "Your learner must be older than 42 days on the test date. If it expired (6 months), renew it first.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Original CNIC",
    "desc": "Carry the original; details must match your learner record.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Medical certificate",
    "desc": "Required for older applicants (commonly 50+) and commercial categories.",
    "status": "conditional",
    "note": "Age / category dependent."
   },
   {
    "name": "Test fee payment (PSID)",
    "desc": "The test/licence fee is paid through the PSID generated in the system.",
    "status": "required",
    "note": ""
   }
  ],
  "fees": [
   {
    "name": "Motorcycle licence \u2014 1 year (example)",
    "amount": 930,
    "applies": "Annual rate incl. card/courier as listed by DLIMS/Dastak fee info; test fee extra",
    "source": "Punjab DLIMS / Dastak fee information (Oct 2026) \u2014 confirm on PSID",
    "checked": "2026-10-24"
   },
   {
    "name": "Car / Jeep licence \u2014 1 year (example)",
    "amount": 1830,
    "applies": "Annual rate incl. card/courier as listed; test fee extra. Each extra validity year adds the annual licence fee.",
    "source": "Punjab DLIMS / Dastak fee information (Oct 2026) \u2014 confirm on PSID",
    "checked": "2026-10-24"
   },
   {
    "name": "Test fee",
    "amount": null,
    "applies": "Charged per test attempt (listed around Rs. 50\u2013150 by category)",
    "source": "Confirm exact amount on your PSID in Dastak/DLIMS",
    "checked": "2026-10-24"
   },
   {
    "name": "Renewal processing fee \u2014 Motorcycle / Rickshaw",
    "amount": 500,
    "applies": "Licence renewal at a Police Khidmat Markaz",
    "source": "Police Khidmat Markaz \u2014 pkm.punjab.gov.pk",
    "checked": "2026-10-25"
   },
   {
    "name": "Renewal processing fee \u2014 Car / LTV / Tractor (commercial)",
    "amount": 750,
    "applies": "Licence renewal at a Police Khidmat Markaz",
    "source": "Police Khidmat Markaz \u2014 pkm.punjab.gov.pk",
    "checked": "2026-10-25"
   },
   {
    "name": "Renewal processing fee \u2014 HTV",
    "amount": 2000,
    "applies": "Licence renewal at a Police Khidmat Markaz",
    "source": "Police Khidmat Markaz \u2014 pkm.punjab.gov.pk",
    "checked": "2026-10-25"
   },
   {
    "name": "Duplicate licence \u2014 Motorcycle",
    "amount": 100,
    "applies": "Replacement of a lost licence at a Police Khidmat Markaz",
    "source": "Police Khidmat Markaz \u2014 pkm.punjab.gov.pk",
    "checked": "2026-10-25"
   },
   {
    "name": "Duplicate licence \u2014 Car / LTV",
    "amount": 500,
    "applies": "Replacement of a lost licence at a Police Khidmat Markaz",
    "source": "Police Khidmat Markaz \u2014 pkm.punjab.gov.pk",
    "checked": "2026-10-25"
   },
   {
    "name": "Duplicate licence \u2014 HTV",
    "amount": 200,
    "applies": "Replacement of a lost licence at a Police Khidmat Markaz",
    "source": "Police Khidmat Markaz \u2014 pkm.punjab.gov.pk",
    "checked": "2026-10-25"
   }
  ],
  "steps": [
   {
    "title": "Check your 42 days",
    "desc": "Count from your learner issue date. Booking before 42 days is the most common reason applications are rejected.",
    "link": null
   },
   {
    "title": "Book your test appointment",
    "desc": "Apply for the regular licence in Dastak/DLIMS and choose your licensing centre and date.",
    "link": {
     "label": "DLIMS Punjab (official)",
     "url": "https://dlims.punjab.gov.pk"
    }
   },
   {
    "title": "Appear for the tests",
    "desc": "At the centre: first the road-sign/theory test, then the practical driving test in the track. Bring your CNIC and learner permit.",
    "link": null
   },
   {
    "title": "Pay the licence fee",
    "desc": "On passing, pay the generated PSID for your category and chosen validity period (1\u20135 years).",
    "link": null
   },
   {
    "title": "Receive your licence",
    "desc": "An e-licence is available through DLIMS, and the printed card follows through the delivery method shown in the system.",
    "link": null
   }
  ],
  "applyAt": [
   {
    "label": "DLIMS Punjab \u2014 Official Portal",
    "url": "https://dlims.punjab.gov.pk",
    "desc": "Booking, verification, tracking and e-licence."
   },
   {
    "label": "City Traffic Police Licensing Centre",
    "url": "",
    "desc": "Tests are taken in person at licensing centres/branches in Punjab. Choose your centre inside Dastak/DLIMS."
   }
  ],
  "notes": [
   "Fees grow with validity years: a 5-year licence costs more upfront than a 1-year licence. The PSID always shows the final payable amount \u2014 trust it over any third-party list, including this one.",
   "If you fail a test, you can reappear after the waiting period shown by the licensing centre \u2014 ask at the counter for the current rule.",
   "Province-specific guide: Punjab only.",
   "Renewing later? At any Police Khidmat Markaz, renewal needs Application Form E, 2 passport-size photographs, a copy of your NIC, your original licence and a medical report; PKM lists delivery in about 5 working days by courier (PKM services page, checked Oct 2026).",
   "Lost your licence? Duplicate fees on the official PKM schedule: Motorcycle Rs. 100, Car/LTV Rs. 500, HTV Rs. 200 (checked Oct 2026)."
  ],
  "faqs": [
   {
    "q": "Can I take the test on day 30 of my learner?",
    "a": "No. Punjab requires at least 42 days between the learner permit and the permanent licence test."
   },
   {
    "q": "What tests do I have to pass?",
    "a": "A road-sign/theory test and a practical driving test for your vehicle category."
   },
   {
    "q": "Is the e-licence valid?",
    "a": "DLIMS provides an official e-licence you can generate from the portal. Carry your physical card when it arrives, as advised by the traffic police."
   }
  ],
  "related": [
   "learner-licence-punjab",
   "cnic-services"
  ],
  "sources": [
   {
    "name": "DLIMS Punjab \u2014 Official Portal",
    "url": "https://dlims.punjab.gov.pk",
    "desc": "Punjab Traffic Police / PITB driving licence system."
   },
   {
    "name": "Dastak \u2014 Government of Punjab",
    "url": "https://dastak.punjab.gov.pk",
    "desc": "Official application portal."
   },
   {
    "name": "Police Khidmat Markaz \u2014 Punjab Police",
    "url": "https://pkm.punjab.gov.pk/public/home/services?id=b",
    "desc": "Official PKM services page: learner, renewal, duplicate and endorsement requirements and processing fees."
   }
  ]
 },
 {
  "slug": "university-admission",
  "title": "University Admission \u2014 Document Preparation",
  "short": "A preparation guide: gather every document Pakistani universities commonly ask for, before admission season opens.",
  "category": "education-admissions",
  "authority": "Your chosen university (requirements vary)",
  "scope": "Pakistan \u2014 varies by university",
  "level": "preparation",
  "verifiedDate": null,
  "verifyNote": "This is a preparation guide, not an official requirement list. Every university publishes its own admission notice with exact documents, dates and fees. Always follow the official notice of the university you are applying to.",
  "whoFor": "Students applying for undergraduate or postgraduate admission at a Pakistani university for the first time.",
  "keywords": [
   "university admission",
   "admission documents",
   "university apply",
   "admission form",
   "entry test",
   "merit list",
   "dakhla",
   "university requirements"
  ],
  "documents": [
   {
    "name": "CNIC or B-Form (CRC) copy",
    "desc": "Your identity document. Under-18 applicants usually submit the B-Form; 18+ submit CNIC.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Matric result card / certificate",
    "desc": "Original for verification at admission, plus photocopies for the application file.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Intermediate result card / certificate",
    "desc": "Your FSc/FA/A-Level result. Result-awaiting candidates may apply provisionally at many universities \u2014 check the admission notice.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Recent passport-size photographs",
    "desc": "Most universities ask for several photographs with a specified background. Keep 8\u201310 ready.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Domicile certificate",
    "desc": "Some public universities and quota seats require a domicile of your district/province.",
    "status": "conditional",
    "note": "Public-sector / quota admissions."
   },
   {
    "name": "Migration certificate",
    "desc": "If you passed intermediate from a board different from the university's usual boards, or are moving from another university.",
    "status": "conditional",
    "note": "Board/university changers."
   },
   {
    "name": "Equivalence certificate (IBCC)",
    "desc": "For O/A-Level or foreign qualifications, equivalence from IBCC is normally required.",
    "status": "conditional",
    "note": "Foreign-board students."
   },
   {
    "name": "Entry test result (if applicable)",
    "desc": "MDCAT, ECAT, or the university's own test result \u2014 only where the programme requires it.",
    "status": "conditional",
    "note": "Programme dependent."
   }
  ],
  "fees": [],
  "feesUnavailable": "Admission and application fees are set by each university and change every session. KAAMMAP does not publish a fee for this guide \u2014 check the official admission advertisement / prospectus of your university for the current amount and the official payment method (usually a bank challan or online voucher generated from the admission portal).",
  "steps": [
   {
    "title": "Shortlist programmes & check eligibility",
    "desc": "Read the official admission notice: required subjects, minimum percentages and entry tests for your programme.",
    "link": null
   },
   {
    "title": "Prepare your document file",
    "desc": "Use the checklist on this page. Keep originals in one folder and 3\u20134 photocopy sets in another.",
    "link": null
   },
   {
    "title": "Apply on the official admission portal",
    "desc": "Create your account only on the university's official website (check the address ends with the university's real domain, often .edu.pk).",
    "link": null
   },
   {
    "title": "Pay the application fee officially",
    "desc": "Pay only through the method in the admission notice \u2014 generated challan/voucher or the portal's payment options. Keep the paid copy.",
    "link": null
   },
   {
    "title": "Entry test & merit lists",
    "desc": "Appear in the entry test if required, then follow the merit lists and submit dues/documents by the dates in the notice.",
    "link": null
   }
  ],
  "applyAt": [
   {
    "label": "Your university's official admission portal",
    "url": "",
    "desc": "Each university runs its own portal and dates. Find the link from the university's official website \u2014 never from an agent's page."
   }
  ],
  "notes": [
   "Deadlines, fees and required documents differ by university and session. The admission notice is the only final authority.",
   "Never pay admission dues to a personal bank account or an agent's number \u2014 official payments always come with a generated challan/voucher.",
   "Keep digital scans (PDF) of every document; most portals require uploads under a size limit."
  ],
  "faqs": [
   {
    "q": "Can I apply while waiting for my intermediate result?",
    "a": "Many universities allow provisional application for result-awaiting students, with final admission after the result. Check your university's notice."
   },
   {
    "q": "Do private and public universities ask for the same documents?",
    "a": "The core set (identity, matric, intermediate, photos) is similar, but domicile, migration and quota documents are mostly public-sector requirements."
   },
   {
    "q": "Where do I find the real fee?",
    "a": "In the official admission advertisement and prospectus of the university \u2014 not on social media posts."
   }
  ],
  "related": [
   "scholarship-application",
   "cnic-services",
   "job-application-documents"
  ],
  "sources": [
   {
    "name": "Higher Education Commission (HEC) Pakistan",
    "url": "https://hec.gov.pk",
    "desc": "National regulator. Use HEC's portal to confirm a university is recognised before applying."
   },
   {
    "name": "HEC e-Services Portal",
    "url": "https://eservices.hec.gov.pk",
    "desc": "HEC's official online services portal \u2014 degree attestation and other HEC services (sign in with CNIC/Passport/POC)."
   }
  ]
 },
 {
  "slug": "scholarship-application",
  "title": "Scholarship Application \u2014 Document Preparation",
  "short": "Prepare a complete scholarship file before deadlines: the certificates, income proof and documents providers commonly require.",
  "category": "scholarships-aid",
  "authority": "The scholarship provider (requirements vary)",
  "scope": "Pakistan \u2014 varies by provider",
  "level": "preparation",
  "verifiedDate": null,
  "verifyNote": "Preparation guide only. Each scholarship (HEC, Ehsaas/BISP-linked, university merit/need-based, provincial endowment funds, private trusts) has its own criteria, documents and deadlines on its official notice.",
  "whoFor": "Students preparing to apply for merit-based or need-based scholarships at school, college or university level.",
  "keywords": [
   "scholarship",
   "wazifa",
   "financial aid",
   "need based",
   "merit scholarship",
   "hec scholarship",
   "ehsaas scholarship",
   "scholarship documents",
   "scholarship apply"
  ],
  "documents": [
   {
    "name": "Applicant CNIC / B-Form copy",
    "desc": "Your identity document (and often the father's/guardian's CNIC copy as well).",
    "status": "required",
    "note": ""
   },
   {
    "name": "Latest result cards / transcripts",
    "desc": "Matric, intermediate or last-semester transcripts \u2014 providers judge both merit and need from these.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Admission proof / bonafide certificate",
    "desc": "Proof that you are enrolled: admission slip, university ID card copy, or a bonafide certificate from your institution.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Income certificate / salary proof of guardian",
    "desc": "For need-based aid: the guardian's salary slip, pension book, or an income certificate/affidavit as the provider's notice specifies.",
    "status": "conditional",
    "note": "Need-based scholarships."
   },
   {
    "name": "Utility bill copy",
    "desc": "A recent electricity/gas bill is commonly used to verify the household address and expenses in need-based assessment.",
    "status": "conditional",
    "note": "Need-based scholarships."
   },
   {
    "name": "Recommendation / referee details",
    "desc": "Some schemes ask for a teacher/referee reference. Keep contact details ready; never fabricate a letter.",
    "status": "conditional",
    "note": "Scheme dependent."
   },
   {
    "name": "Bank account in the student's name",
    "desc": "Many providers transfer funds to the student's own account. If you do not have one, open it early \u2014 it takes time.",
    "status": "conditional",
    "note": "Often required before disbursement."
   }
  ],
  "fees": [],
  "feesUnavailable": "Genuine scholarships do not charge large 'processing fees'. If a scheme asks for an application fee, it will be stated in its official notice with an official payment method. Never send money to a personal account for a 'scholarship form'.",
  "steps": [
   {
    "title": "Find genuine schemes",
    "desc": "Look on official sources only: your university's financial-aid office, HEC, and provincial government portals. Save the official notice/screenshot.",
    "link": null
   },
   {
    "title": "Read the eligibility criteria twice",
    "desc": "Check level, domicile, income limit, minimum marks and which documents are mandatory for that scheme.",
    "link": null
   },
   {
    "title": "Build your scholarship file",
    "desc": "Use the checklist: identity, results, admission proof, income proof. Scan everything clearly.",
    "link": null
   },
   {
    "title": "Apply before the deadline \u2014 early",
    "desc": "Portals slow down near deadlines. Submit early and save the submitted application copy and tracking/reference number.",
    "link": null
   },
   {
    "title": "Follow up through official channels",
    "desc": "Check the portal/notice board for shortlists and interviews. Respond only through official contacts.",
    "link": null
   }
  ],
  "applyAt": [
   {
    "label": "Provider's official portal / your institution's aid office",
    "url": "",
    "desc": "Apply only through the channel named in the official scholarship notice."
   },
   {
    "label": "HEC \u2014 Scholarships & Grants",
    "url": "https://www.hec.gov.pk/english/scholarshipsgrants",
    "desc": "Higher Education Commission's official scholarships & grants section: national scholarship programmes and announcements."
   }
  ],
  "notes": [
   "A scholarship notice shared only on WhatsApp/Facebook with a personal contact number is a common scam pattern. Verify on the provider's official website.",
   "Need-based assessment may include a physical verification or interview \u2014 keep original documents ready.",
   "Deadlines are strict. Prepare the file before the announcement so you only fill the form when it opens."
  ],
  "faqs": [
   {
    "q": "Can I apply for more than one scholarship?",
    "a": "Usually you can apply to several, but many schemes require you to declare other aid and may not allow double benefits. Read each scheme's rules."
   },
   {
    "q": "I don't have a bank account. Can I still apply?",
    "a": "Apply first if the form allows it, but open a student bank account in parallel \u2014 disbursement almost always needs your own account."
   },
   {
    "q": "Does KAAMMAP offer scholarships?",
    "a": "No. KAAMMAP is only an information guide. Scholarships come from the providers themselves."
   }
  ],
  "related": [
   "university-admission",
   "cnic-services"
  ],
  "sources": [
   {
    "name": "Higher Education Commission (HEC) Pakistan",
    "url": "https://hec.gov.pk",
    "desc": "Official source for national higher-education scholarships and recognised institutions."
   }
  ]
 },
 {
  "slug": "job-application-documents",
  "title": "Job Application \u2014 Document Preparation",
  "short": "The document file almost every employer in Pakistan asks for: prepare it once, then apply anywhere with confidence.",
  "category": "jobs-employment",
  "authority": "Your employer (requirements vary)",
  "scope": "Pakistan \u2014 varies by employer",
  "level": "preparation",
  "verifiedDate": null,
  "verifyNote": "Preparation guide. Government jobs publish exact document lists in their official advertisement (often through testing agencies); private employers list theirs in the job post. Always match the advertisement \u2014 do not send documents that were not asked for.",
  "whoFor": "Fresh graduates and job seekers applying to private companies, banks, or government departments for the first time.",
  "keywords": [
   "job application",
   "job documents",
   "cv",
   "resume",
   "government job",
   "nokri",
   "job apply documents",
   "attested documents",
   "hec attestation"
  ],
  "documents": [
   {
    "name": "Updated CV / Resume",
    "desc": "One or two pages, tailored to the job. Keep a clean PDF version ready.",
    "status": "required",
    "note": ""
   },
   {
    "name": "CNIC copy",
    "desc": "Almost every application asks for it. Keep front/back on one page.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Educational degrees & transcripts (copies)",
    "desc": "Matric onward. Government applications usually ask for attested copies; private jobs often verify originals at interview.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Recent passport-size photographs",
    "desc": "Keep several printed copies and a soft copy with a plain background.",
    "status": "required",
    "note": ""
   },
   {
    "name": "Experience letters",
    "desc": "From previous employers, where you have experience. Fresh applicants skip this.",
    "status": "conditional",
    "note": "Experienced applicants."
   },
   {
    "name": "Domicile & PRC",
    "desc": "Commonly required for provincial government jobs and quota-based posts.",
    "status": "conditional",
    "note": "Government jobs."
   },
   {
    "name": "HEC-attested degrees",
    "desc": "Some government and senior roles require degrees attested by HEC. Attestation takes time \u2014 start early if a post requires it.",
    "status": "conditional",
    "note": "Where the advertisement demands it."
   },
   {
    "name": "Character certificate",
    "desc": "Occasionally asked by government departments, issued by a gazetted officer or your last institution.",
    "status": "conditional",
    "note": "Government jobs."
   }
  ],
  "fees": [],
  "feesUnavailable": "Private employers do not charge application fees \u2014 treat any 'fee' for a private job as a scam warning. Government job application fees, where charged, are stated in the official advertisement with a designated bank/testing-agency payment method only.",
  "steps": [
   {
    "title": "Build your master document file",
    "desc": "One folder (physical + scanned PDFs) with everything in the checklist, named clearly: CNIC.pdf, Degree-BS.pdf, and so on.",
    "link": null
   },
   {
    "title": "Read the advertisement like a checklist",
    "desc": "Note the exact documents, attestation, copies count, and the deadline. Government ads are strict about these.",
    "link": null
   },
   {
    "title": "Tailor your CV to the post",
    "desc": "Match your skills and experience words to the job description \u2014 honestly. Never invent qualifications.",
    "link": null
   },
   {
    "title": "Apply through the official channel only",
    "desc": "The employer's portal, the testing agency named in the ad, or the address given. Keep the sent-copy / tracking number.",
    "link": null
   },
   {
    "title": "Prepare originals for the interview/test day",
    "desc": "Shortlisted candidates are almost always asked to bring originals for verification.",
    "link": null
   }
  ],
  "applyAt": [
   {
    "label": "The channel named in the official job advertisement",
    "url": "",
    "desc": "Employer portal, testing agency (for government posts), or postal address exactly as printed in the ad."
   },
   {
    "label": "National Job Portal (NJP)",
    "url": "https://njp.gov.pk",
    "desc": "The Government of Pakistan's official job portal \u2014 verified federal and provincial government job listings."
   }
  ],
  "notes": [
   "No genuine employer asks for your original CNIC, degrees, or money before selection. Hand over copies; show originals only for verification.",
   "Attestation (board/HEC) takes days to weeks \u2014 do not leave it for the last day of an application window.",
   "Keep scans under common portal size limits and in PDF where possible."
  ],
  "faqs": [
   {
    "q": "Should I attest my documents for every job?",
    "a": "Only where the advertisement asks. Many private employers do not need attested copies at application stage."
   },
   {
    "q": "Can I apply without experience letters as a fresh graduate?",
    "a": "Yes. Fresh posts are designed for candidates without experience \u2014 your degrees, CNIC and CV are the core file."
   },
   {
    "q": "A job post asks me to WhatsApp my CNIC and pay a 'registration fee'. Is that normal?",
    "a": "No. That is a well-known scam pattern. Real employers use official portals and never charge candidates through personal numbers."
   }
  ],
  "related": [
   "cnic-services",
   "university-admission"
  ],
  "sources": [
   {
    "name": "National Job Portal (NJP) \u2014 Government of Pakistan",
    "url": "https://njp.gov.pk",
    "desc": "Official government jobs portal: search verified government vacancies and apply through the channel named in each ad."
   },
   {
    "name": "Higher Education Commission (HEC) Pakistan",
    "url": "https://hec.gov.pk",
    "desc": "Degree attestation and recognised-institution verification."
   }
  ]
 }
]

import { guideUr, categoryUr } from "./guidesUr.js"
for (const c of guideCategories) { if (categoryUr[c.slug]) c.ur = categoryUr[c.slug] }
for (const g of guides) { if (guideUr[g.slug]) g.ur = guideUr[g.slug] }

export const getGuide=slug=>guides.find(g=>g.slug===slug)
export const levelLabel=l=>({checked:'Fees & steps checked',partial:'Partly checked',preparation:'Preparation guide'}[l]||'Guide')
