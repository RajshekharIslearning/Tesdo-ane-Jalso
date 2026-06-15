import { z } from "zod";
import { LOCALITIES, SPECIALITIES } from "@/constants";

// ============================
// VENDOR SCHEMAS
// ============================

export const vendorSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  speciality: z.string().min(1, "Please select a valid speciality"),
  locality: z.string().min(1, "Please select a valid locality"),
  address: z
    .string()
    .max(200, "Address must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  customSpeciality: z.string().optional(),
  forceAdd: z.boolean().optional(),
});

export type VendorFormData = z.infer<typeof vendorSchema>;

export const vendorUpdateSchema = vendorSchema.partial().extend({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  isVerified: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

// ============================
// RATING SCHEMA
// ============================

export const ratingSchema = z.object({
  stars: z
    .number()
    .int()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  comment: z
    .string()
    .max(500, "Comment must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  fingerprint: z.string().optional(),
});

export type RatingFormData = z.infer<typeof ratingSchema>;

// ============================
// CONTACT SCHEMA
// ============================

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(200)
    .trim(),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject must be less than 200 characters")
    .trim(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters")
    .trim(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ============================
// NEWSLETTER SCHEMA
// ============================

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address").trim(),
});

// ============================
// REPORT SCHEMA
// ============================

export const reportSchema = z.object({
  type: z.enum(["VENDOR", "RATING", "OTHER"]),
  reason: z
    .string()
    .min(5, "Please describe the reason")
    .max(200)
    .trim(),
  details: z
    .string()
    .max(1000)
    .optional()
    .or(z.literal("")),
  vendorId: z.string().optional(),
  ratingId: z.string().optional(),
});

export type ReportFormData = z.infer<typeof reportSchema>;

// ============================
// ADMIN LOGIN SCHEMA
// ============================

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email").trim(),
  password: z.string().min(1, "Password is required"),
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

// ============================
// SEARCH PARAMS SCHEMA
// ============================

export const vendorSearchSchema = z.object({
  search: z.string().optional(),
  locality: z.string().optional(),
  speciality: z.string().optional(),
  sort: z.enum(["rating", "newest", "most_rated", "name"]).optional().default("rating"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12),
});

export type VendorSearchParams = z.infer<typeof vendorSearchSchema>;
