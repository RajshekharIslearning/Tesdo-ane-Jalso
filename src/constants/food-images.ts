/**
 * Curated Unsplash photo URLs for each food speciality.
 * All photos are free to use under the Unsplash License.
 * Format: https://images.unsplash.com/photo-{ID}?w=1200&q=90&auto=format&fit=crop
 */
export const SPECIALITY_IMAGES: Record<string, string> = {
  "Pani Puri / Golgappa":
    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=1200&q=90&auto=format&fit=crop",
  "Dabeli":
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=90&auto=format&fit=crop",
  "Bhel Puri":
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&q=90&auto=format&fit=crop",
  "Sev Puri":
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&q=90&auto=format&fit=crop",
  "Ragda Pattice":
    "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=90&auto=format&fit=crop",
  "Vada Pav":
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1200&q=90&auto=format&fit=crop",
  "Chole Bhature":
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=1200&q=90&auto=format&fit=crop",
  "Kachori":
    "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&q=90&auto=format&fit=crop",
  "Samosa":
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&q=90&auto=format&fit=crop",
  "Jalebi":
    "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=1200&q=90&auto=format&fit=crop",
  "Fafda & Jalebi":
    "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=1200&q=90&auto=format&fit=crop",
  "Chai & Nashta":
    "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1200&q=90&auto=format&fit=crop",
  "Khaman / Dhokla":
    "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=1200&q=90&auto=format&fit=crop",
  "Thepla":
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&q=90&auto=format&fit=crop",
  "Sandwich":
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=1200&q=90&auto=format&fit=crop",
  "Pav Bhaji":
    "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=1200&q=90&auto=format&fit=crop",
  "Corn":
    "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=1200&q=90&auto=format&fit=crop",
  "Ice Gola":
    "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=1200&q=90&auto=format&fit=crop",
  "Lassi":
    "https://images.unsplash.com/photo-1567337710282-00832b415979?w=1200&q=90&auto=format&fit=crop",
  "Juice":
    "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=1200&q=90&auto=format&fit=crop",
  "Tawa Pulao":
    "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=1200&q=90&auto=format&fit=crop",
  "Maggi":
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&q=90&auto=format&fit=crop",
  "Frankie / Roll":
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&q=90&auto=format&fit=crop",
  "Momo":
    "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=1200&q=90&auto=format&fit=crop",
  "Chaat":
    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=1200&q=90&auto=format&fit=crop",
  "Dosa":
    "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=1200&q=90&auto=format&fit=crop",
  "Idli Vada":
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&q=90&auto=format&fit=crop",
  "Biryani":
    "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=1200&q=90&auto=format&fit=crop",
  "Sweets & Mithai":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=90&auto=format&fit=crop",
  "Other":
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=90&auto=format&fit=crop",
};

/** Default fallback image for vendors with no speciality match */
export const DEFAULT_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=90&auto=format&fit=crop";

/** Returns the best food image for a given vendor speciality */
export function getFoodImage(speciality: string): string {
  return SPECIALITY_IMAGES[speciality] ?? DEFAULT_FOOD_IMAGE;
}

/**
 * Hero mosaic images — a curated set of 4 beautiful Ahmedabad street food
 * photos used in the homepage hero visual grid.
 */
export const HERO_FOOD_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=1200&q=90&auto=format&fit=crop",
    alt: "Pani puri street food",
  },
  {
    src: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&q=90&auto=format&fit=crop",
    alt: "Samosa",
  },
  {
    src: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=1200&q=90&auto=format&fit=crop",
    alt: "Jalebi",
  },
  {
    src: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1200&q=90&auto=format&fit=crop",
    alt: "Masala chai",
  },
];
