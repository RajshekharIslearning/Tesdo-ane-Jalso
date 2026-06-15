import { Vendor, VendorImage, Rating, User } from "@prisma/client";

// ============================
// VENDOR TYPES
// ============================

export type VendorWithDetails = Vendor & {
  images: VendorImage[];
  ratings: Rating[];
  _count?: { ratings: number; favorites: number };
};

export type VendorSummary = Pick<
  Vendor,
  | "id"
  | "slug"
  | "name"
  | "speciality"
  | "locality"
  | "address"
  | "isVerified"
  | "isFeatured"
  | "status"
  | "ratingSum"
  | "ratingCount"
  | "createdAt"
> & {
  primaryImage?: string;
  averageRating: number;
};

export type LocalityRanking = {
  locality: string;
  vendorCount: number;
  averageRating: number;
  totalRatings: number;
  topVendors: VendorSummary[];
};

// ============================
// RATING TYPES
// ============================

export type RatingWithUser = Rating & {
  user?: Pick<User, "id" | "name" | "image"> | null;
};

// ============================
// PAGINATION
// ============================

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
};

// ============================
// API RESPONSE TYPES
// ============================

export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiError = {
  success: false;
  error: string;
  details?: Record<string, string[]>;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ============================
// ADMIN TYPES
// ============================

export type AdminStats = {
  totalVendors: number;
  pendingVendors: number;
  approvedVendors: number;
  totalRatings: number;
  totalUsers: number;
  pendingReports: number;
  unreadMessages: number;
  topLocalities: Array<{ locality: string; count: number }>;
  recentActivity: Array<{ type: string; label: string; at: Date }>;
};

// ============================
// NAV TYPES
// ============================

export type NavItem = {
  label: string;
  href: string;
  icon?: string;
};

// ============================
// SESSION TYPES (augment next-auth)
// ============================
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "USER" | "ADMIN";
    };
  }
}
