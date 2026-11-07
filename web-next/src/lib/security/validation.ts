import { z } from "zod";

const DANGEROUS_URI_SCHEME = /^\s*(?:javascript|data|vbscript|file|blob):/i;
const DANGEROUS_CHARS = /[<>"'`\u0000-\u001F\u007F\s]/;

export const safeSeoUrlSchema = z
  .string()
  .max(2048, "URL exceeds 2048 characters")
  .refine((val) => {
    const trimmed = val.trim();
    if (!trimmed) return true;
    if (DANGEROUS_URI_SCHEME.test(trimmed)) return false;
    if (DANGEROUS_CHARS.test(trimmed)) return false;
    if (trimmed.startsWith("/")) {
      return !trimmed.startsWith("//");
    }
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      return false;
    }
  }, "Must be a valid http(s):// URL or root-relative / path without dangerous characters");

export const loginPayloadSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(8).max(128),
});

export const registerPayloadSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(8).max(128),
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(40).optional().nullable(),
});

export const contactPayloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z.string().trim().max(40).optional().nullable(),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0, "Honeypot field must be empty").optional(),
});

export const reservationPayloadSchema = z.object({
  tourId: z.string().min(1).max(128),
  bookingDate: z.string().refine((d) => !Number.isNaN(new Date(d).getTime()), {
    message: "Invalid booking date",
  }),
  adults: z.number().int().min(1).max(50),
  children: z.number().int().min(0).max(50).default(0),
  guestName: z.string().trim().min(2).max(120),
  guestEmail: z.string().trim().toLowerCase().email().max(200),
  guestPhone: z.string().trim().max(40).optional(),
  specialRequests: z.string().trim().max(2000).optional(),
});

export const seoFieldsSchema = z.object({
  seo_title: z.string().trim().max(70).optional(),
  seo_description: z.string().trim().max(170).optional(),
  canonical_url: safeSeoUrlSchema.optional(),
  og_image: safeSeoUrlSchema.optional(),
  noindex: z.boolean().optional(),
});
