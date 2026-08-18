export const LOCALITIES = [
  "Ambawadi", "Ambli", "Amraiwadi", "Anand Nagar", "Asarwa", "Astodia",
  "Bapunagar", "Behrampura", "Bodakdev", "Bopal", "Chandkheda", "Chandlodiya",
  "CTM", "Dani Limda", "Dariapur", "Dudheshwar", "Ghatlodiya", "Ghodasar",
  "Gomtipur", "Gota", "Gulbai Tekra", "Gurukul", "Jamalpur", "Jivraj Park",
  "Jodhpur", "Juhapura", "Kalupur", "Kankaria", "Khadia", "Khanpur", "Khokhra",
  "Law Garden", "Maninagar", "Manek Chowk", "Naroda", "Navrangpura",
  "Naranpura", "New CG Road", "Nikol", "Paldi", "Prahlad Nagar", "Rakhial",
  "Ramol", "Ranip", "Satellite", "SG Highway", "Shahibaug", "Shela",
  "Shyamal", "Sindhu Bhavan Road", "Sola", "Thaltej", "Vastrapur",
  "Vejalpur", "Vastral", "Vatva", "Wadaj", "Isanpur", "Odhav", "Ellis Bridge",
  "Prahladnagar", "Girdhar Nagar", "Bhadaj", "Tragad", "Zundal", "Motera",
  "Sabarmati", "Usmanpura",
] as const;

export type Locality = (typeof LOCALITIES)[number];

export const SPECIALITIES = [
  "Pani Puri / Golgappa", "Dabeli", "Bhel Puri", "Sev Puri", "Ragda Pattice",
  "Vada Pav", "Chole Bhature", "Kachori", "Samosa", "Jalebi", "Fafda & Jalebi",
  "Chai & Nashta", "Khaman / Dhokla", "Thepla", "Sandwich", "Pav Bhaji",
  "Corn", "Ice Gola", "Lassi", "Juice", "Tawa Pulao", "Maggi", "Frankie / Roll",
  "Momo", "Chaat", "Dosa", "Idli Vada", "Biryani", "Sweets & Mithai", "Other",
] as const;

export type Speciality = (typeof SPECIALITIES)[number];

export const STAR_LABELS = ["", "Poor", "Below Average", "Average", "Good", "Excellent"] as const;

export const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
  { value: "most_rated", label: "Most Reviewed" },
  { value: "name", label: "Name A-Z" },
] as const;

export const SITE_CONFIG = {
  name: "Ahmedabad Street Eats",
  tagline: "Discover & rate your favourite local vendors",
  description:
    "Community-powered platform to discover, rate, and explore the best street food vendors across Ahmedabad's 70+ localities.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://ahmedabad-street-eats.vercel.app",
  email: "hello@ahmedabadstreeteats.in",
  social: {
    instagram: "https://instagram.com/amdstreeteats",
    twitter: "https://twitter.com/amdstreeteats",
  },
} as const;

export const RATE_LIMITS = {
  addVendor: { requests: 3, window: "1 h" },
  submitRating: { requests: 10, window: "1 h" },
  contactForm: { requests: 3, window: "1 h" },
  newsletter: { requests: 3, window: "1 h" },
} as const;
