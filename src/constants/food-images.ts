/**
 * Curated authentic photo URLs for each food speciality.
 * All photos are strictly vegetarian, focusing on Gujarati and Indian street food.
 * Using local images provided by the user.
 */
export const SPECIALITY_IMAGES: Record<string, string> = {
  "Pani Puri / Golgappa": "/images/food/PaniPuri.jpeg",
  "Dabeli": "/images/food/Dabeli.jpeg",
  "Bhel Puri": "/images/food/GujaratiFarshan1.jpeg",
  "Sev Puri": "/images/food/GujaratiFarshan1.jpeg",
  "Ragda Pattice": "/images/food/Samosa.jpeg",
  "Vada Pav": "/images/food/vadapav.jpeg",
  "Chole Bhature": "/images/food/Chole_Bhature.jpeg",
  "Kachori": "/images/food/Bhajia.jpeg",
  "Samosa": "/images/food/Samosa.jpeg",
  "Jalebi": "/images/food/Jalebi.jpeg",
  "Fafda & Jalebi": "/images/food/Jalebi.jpeg",
  "Chai & Nashta": "/images/food/Bhajia.jpeg",
  "Khaman / Dhokla": "/images/food/GujaratiFarshan1.jpeg",
  "Thepla": "/images/food/Chole_Kulche.jpeg",
  "Sandwich": "/images/food/Pizza1.jpeg",
  "Pav Bhaji": "/images/food/Pavbhaji.jpeg",
  "Corn": "/images/food/Bhajia.jpeg",
  "Ice Gola": "/images/food/Kulfi.jpeg",
  "Lassi": "/images/food/Kulfi.jpeg",
  "Juice": "/images/food/Kulfi.jpeg",
  "Tawa Pulao": "/images/food/PunjabiThali.jpeg",
  "Maggi": "/images/food/Chawmein.jpeg",
  "Frankie / Roll": "/images/food/Chawmein.jpeg",
  "Momo": "/images/food/Manchurian.jpeg",
  "Chaat": "/images/food/GujaratiFarshan1.jpeg",
  "Dosa": "/images/food/Dosa.jpeg",
  "Idli Vada": "/images/food/Idli_vada.jpeg",
  "Biryani": "/images/food/PunjabiThali.jpeg",
  "Sweets & Mithai": "/images/food/Jalebi.jpeg",
  "Other": "/images/food/PunjabiThali.jpeg",
};

/** Default fallback image for vendors with no speciality match */
export const DEFAULT_FOOD_IMAGE = "/images/food/GujaratiFarshan1.jpeg";

/** Returns the best food image for a given vendor speciality */
export function getFoodImage(speciality: string): string {
  return SPECIALITY_IMAGES[speciality] ?? DEFAULT_FOOD_IMAGE;
}

/**
 * Hero mosaic images — a curated set of 15 distinct Ahmedabad street food
 * photos used in the homepage hero visual grid.
 */
export const HERO_FOOD_IMAGES = [
  { src: "/images/food/PaniPuri.jpeg", alt: "Pani puri street food" },
  { src: "/images/food/Dabeli.jpeg", alt: "Dabeli" },
  { src: "/images/food/Samosa.jpeg", alt: "Samosa" },
  { src: "/images/food/Pavbhaji.jpeg", alt: "Pav Bhaji" },
  { src: "/images/food/Jalebi.jpeg", alt: "Jalebi" },
  { src: "/images/food/GujaratiFarshan1.jpeg", alt: "Gujarati Farshan" },
  { src: "/images/food/vadapav.jpeg", alt: "Vada Pav" },
  { src: "/images/food/Chole_Bhature.jpeg", alt: "Chole Bhature" },
  { src: "/images/food/Dosa.jpeg", alt: "Dosa" },
  { src: "/images/food/Idli_vada.jpeg", alt: "Idli Vada" },
  { src: "/images/food/Bhajia.jpeg", alt: "Bhajia" },
  { src: "/images/food/Kulfi.jpeg", alt: "Kulfi" },
  { src: "/images/food/Manchurian.jpeg", alt: "Manchurian" },
  { src: "/images/food/PunjabiThali.jpeg", alt: "Thali" },
  { src: "/images/food/Chawmein.jpeg", alt: "Chowmein" },
];



