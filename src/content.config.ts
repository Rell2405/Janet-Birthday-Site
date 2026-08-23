import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const publicEntry = {
  order: z.number().int().min(0).default(100),
  visibility: z.literal("public").default("public"),
  draft: z.boolean().default(false),
};

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

const timeZone = z.string().trim().min(1).refine((value) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}, "Use a valid IANA timezone such as America/Jamaica.");

const itinerary = defineCollection({
  loader: glob({
    base: "./src/content/itinerary",
    pattern: "**/*.md",
  }),
  schema: z.object({
    ...publicEntry,
    title: z.string().trim().min(1).max(100),
    summary: z.string().trim().max(240).optional(),
    date: z.string().regex(datePattern, "Use a YYYY-MM-DD date."),
    startTime: z
      .string()
      .regex(timePattern, "Use a 24-hour HH:mm time.")
      .optional(),
    endTime: z
      .string()
      .regex(timePattern, "Use a 24-hour HH:mm time.")
      .optional(),
    timeZone,
    allDay: z.boolean().default(false),
    locationLabel: z.string().trim().max(120).optional(),
    category: z
      .enum([
        "arrival",
        "meal",
        "activity",
        "celebration",
        "departure",
        "other",
      ])
      .default("other"),
  }),
});

const faq = defineCollection({
  loader: glob({
    base: "./src/content/faq",
    pattern: "**/*.md",
  }),
  schema: z.object({
    ...publicEntry,
    question: z.string().trim().min(1).max(160),
    category: z
      .enum([
        "general",
        "travel",
        "venue",
        "attire",
        "gifts",
        "accessibility",
        "other",
      ])
      .default("general"),
  }),
});

const travel = defineCollection({
  loader: glob({
    base: "./src/content/travel",
    pattern: "**/*.md",
  }),
  schema: z.object({
    ...publicEntry,
    title: z.string().trim().min(1).max(100),
    summary: z.string().trim().max(240).optional(),
    category: z
      .enum(["transportation", "lodging", "packing", "local", "other"])
      .default("other"),
  }),
});

const tabPages = defineCollection({
  loader: glob({
    base: "./src/content/tabs",
    pattern: "**/*.md",
  }),
  schema: z.object({
    ...publicEntry,
    tab: z.enum([
      "welcome",
      "resort",
      "birthday-weekend",
      "what-to-wear",
      "book-your-stay",
    ]),
    title: z.string().trim().min(1).max(120),
    eyebrow: z.string().trim().min(1).max(80),
    description: z.string().trim().min(1).max(260),
  }),
});

export const collections = { itinerary, faq, travel, tabPages };
