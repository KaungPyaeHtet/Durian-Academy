export const site = {
  name: "Durian Academy",
  tagline: "make it bold",
  url: "https://durianacademy.com",
  facebook: "https://www.facebook.com/profile.php?id=61591489172634",
  messenger: "https://m.me/durianacademy",
  tiktok: "https://www.tiktok.com/@durianacademy",
  // TODO: replace with real details
  email: "admin@durianacademy.com",
  phone: "+95 9 000 000 000",
  location: "Yangon, Myanmar",
};

// `logo` points to an official curriculum logo in /public/logos. Drop the real
// files there using these exact names; until then the card falls back to the
// numbered badge automatically.
export const programs = [
  {
    code: "AP",
    name: "Advanced Placement",
    logo: "/logos/ap.svg",
    blurb:
      "College-level courses and exams recognised by universities worldwide. Calculus, Physics, Chemistry, Biology, Economics and more.",
    tags: ["College Board", "1–5 scoring"],
  },
  {
    code: "SAT",
    name: "SAT",
    logo: "/logos/sat.svg",
    blurb:
      "Digital SAT preparation covering Reading & Writing and Math, with full-length practice tests and targeted score strategies.",
    tags: ["Digital SAT", "1600 scale"],
  },
  {
    code: "IGCSE",
    name: "IGCSE",
    logo: "/logos/igcse.svg",
    blurb:
      "Cambridge & Edexcel IGCSE across the sciences, mathematics, English and business — the foundation for A-Levels.",
    tags: ["Cambridge", "Edexcel"],
  },
  {
    code: "A-Level",
    name: "A-Levels",
    logo: "/logos/a-level.svg",
    blurb:
      "AS & A2 preparation with depth in Maths, Further Maths, Physics, Chemistry, Biology and Economics for top university entry.",
    tags: ["AS & A2", "University entry"],
  },
  {
    code: "G12",
    name: "Myanmar G12",
    logo: "/logos/g12.svg",
    blurb:
      "Grade 12 matriculation support aligned to the national curriculum, helping students excel in the exams that matter at home.",
    tags: ["National curriculum", "Matriculation"],
  },
];

// Seniors available for 1-on-1 consultation. Each `bookingUrl` opens the
// person's real scheduling page (Google Calendar / Cal.com / Calendly), where
// the actual available times are shown.
export type Senior = {
  id: string;
  name: string;
  role: string;
  provider: string;
  bookingUrl: string;
  blurb: string;
};

export const seniors: Senior[] = [
  {
    id: "aung-khant-paing",
    name: "Aung Khant Paing",
    role: "15-min free consultation",
    provider: "Google Calendar",
    bookingUrl: "https://calendar.app.google/Mkr6B9D9L4zN8sSe9",
    blurb:
      "တက္ကသိုလ်ဝင်ခွင့်လျှောက်ပုံ၊ AP courses နဲ့ Stanford သို့ Transfer လုပ်ခဲ့ပုံတွေကို တိုင်ပင်ပေးနိုင်ပါတယ်။",
  },
  {
    id: "kaung-pyae-htet",
    name: "Kaung Pyae Htet",
    role: "15-min free consultation",
    provider: "Cal.com",
    bookingUrl:
      "https://cal.com/kaungpyaehtet/durianacademy-s-kaung-pyae-htet-appointment",
    blurb:
      "IGCSE/A-Level၊ Hackathon/Tech Experience နဲ့ NUS ရဲ့ ASEAN Scholarship လျှောက်ခဲ့ပုံတွေကို လမ်းပြပေးနိုင်ပါတယ်။",
  },
  {
    id: "min-kyal-sin-thant",
    name: "Min Kyal Sin Thant",
    role: "15-min free consultation",
    provider: "Calendly",
    bookingUrl: "https://calendly.com/mksthant-durianacademy/15min",
    blurb:
      "မြန်မာ ၁၂ တန်းသင်ရိုးနဲ့ NUS (စင်္ကာပူ) ရဲ့ ASEAN Scholarship လျှောက်ခဲ့တဲ့ နည်းနာတွေကို တိုင်ပင်ပေးနိုင်ပါတယ်။",
  },
];

// Quick, scannable facts shown in the hero card. Edit these to match reality.
export const highlights = [
  { icon: "spark", label: "Next intake", value: "Enrolling now" },
  { icon: "group", label: "Class size", value: "Small groups" },
  { icon: "academic", label: "Format", value: "In-person & online" },
  { icon: "trophy", label: "Free", value: "Diagnostic assessment" },
];

export const stats = [
  { value: "500+", label: "Students guided" },
  { value: "5", label: "Curricula covered" },
  { value: "20+", label: "Subject specialists" },
  { value: "90%", label: "Reach their target grade" },
];

export const reasons = [
  {
    title: "Experienced instructors",
    body: "Every class is led by subject specialists who know each syllabus inside-out and mark to the real exam standard.",
    icon: "academic",
  },
  {
    title: "Small, focused classes",
    body: "We keep groups small so teaching adapts to each student — no one gets left behind, no one gets held back.",
    icon: "group",
  },
  {
    title: "Curriculum-aligned",
    body: "Lessons map directly to College Board, Cambridge, Edexcel and the Myanmar national curriculum — no wasted effort.",
    icon: "book",
  },
  {
    title: "Proven results",
    body: "Structured practice, past-paper drills and honest feedback that consistently move students toward their target scores.",
    icon: "trophy",
  },
];

export const steps = [
  {
    title: "Assess",
    body: "We start with a diagnostic to understand exactly where a student stands and what their target requires.",
  },
  {
    title: "Plan",
    body: "A clear, week-by-week study plan built around the syllabus, the exam date and the student's goals.",
  },
  {
    title: "Practice",
    body: "Guided teaching plus past-paper practice and timed mocks so exam day feels familiar, not frightening.",
  },
  {
    title: "Perform",
    body: "Regular feedback and score tracking until the student walks in confident and walks out with results.",
  },
];

export const testimonials = [
  {
    quote:
      "The teachers explained A-Level Physics in a way my school never did. I went from a C to an A in one term.",
    name: "A-Level student",
    detail: "Physics & Maths",
  },
  {
    quote:
      "Durian Academy's SAT practice tests were exactly like the real thing. I hit my target score on the first try.",
    name: "SAT student",
    detail: "Class of 2025",
  },
  {
    quote:
      "Small classes made all the difference — I could actually ask questions. My IGCSE results were the best in my school.",
    name: "IGCSE student",
    detail: "Sciences",
  },
];
