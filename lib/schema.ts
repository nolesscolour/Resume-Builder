import { z } from "zod";

// ============================================================
// PRIMITIVES
// ============================================================

const dateString = z
  .string()
  .regex(
    /^(0[1-9]|1[0-2])\/\d{4}$|^Present$|^$/,
    "Use MM/YYYY format or 'Present'"
  );

const optionalEmail = z
  .string()
  .trim()
  .default("")
  .refine(
    (val) => val === "" || z.string().email().safeParse(val).success,
    "Must be a valid email or empty"
  );

const optionalUrl = z
  .string()
  .trim()
  .default("")
  .refine(
    (val) =>
      val === "" ||
      /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/.test(val),
    "Must be a valid URL or empty"
  );

// ============================================================
// SECTION DATA SHAPES
// ============================================================

export const personalInfoSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required").default(""),
  email: optionalEmail,
  phone: z.string().trim().default(""),
  location: z.string().trim().default(""),
  linkedin: optionalUrl,
  github: optionalUrl,
  website: optionalUrl,
});

export const bulletSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  text: z.string().default(""),
});

export const experienceSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  company: z.string().trim().default(""),
  role: z.string().trim().default(""),
  location: z.string().trim().default(""),
  startDate: dateString.default(""),
  endDate: dateString.default(""),
  current: z.boolean().default(false),
  bullets: z.array(bulletSchema).default([]),
});

export const educationSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  school: z.string().trim().default(""),
  degree: z.string().trim().default(""),
  field: z.string().trim().default(""),
  location: z.string().trim().default(""),
  startDate: dateString.default(""),
  endDate: dateString.default(""),
  gpa: z.string().trim().default(""),
});

export const skillGroupSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  label: z.string().trim().default(""),
  items: z.array(z.string()).default([]),
});

export const projectSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().trim().default(""),
  link: optionalUrl,
  description: z.string().default(""),
  bullets: z.array(bulletSchema).default([]),
});

export const certificationSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().trim().default(""),
  issuer: z.string().trim().default(""),
  date: dateString.default(""),
});

// ============================================================
// SECTION REGISTRY (discriminated union)
// ============================================================

export const SECTION_TYPES = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export const sectionSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    type: z.literal("summary"),
    visible: z.boolean().default(true),
    data: z.object({ text: z.string().default("") }),
  }),
  z.object({
    id: z.string(),
    type: z.literal("experience"),
    visible: z.boolean().default(true),
    data: z.object({ items: z.array(experienceSchema).default([]) }),
  }),
  z.object({
    id: z.string(),
    type: z.literal("education"),
    visible: z.boolean().default(true),
    data: z.object({ items: z.array(educationSchema).default([]) }),
  }),
  z.object({
    id: z.string(),
    type: z.literal("skills"),
    visible: z.boolean().default(true),
    data: z.object({ groups: z.array(skillGroupSchema).default([]) }),
  }),
  z.object({
    id: z.string(),
    type: z.literal("projects"),
    visible: z.boolean().default(true),
    data: z.object({ items: z.array(projectSchema).default([]) }),
  }),
  z.object({
    id: z.string(),
    type: z.literal("certifications"),
    visible: z.boolean().default(true),
    data: z.object({ items: z.array(certificationSchema).default([]) }),
  }),
]);

// ============================================================
// THEME
// ============================================================

export const THEMES = ["harvard", "faang", "dense"] as const;
export type ThemeId = (typeof THEMES)[number];

export const themeSchema = z.enum(THEMES).default("harvard");

// ============================================================
// ROOT CV SCHEMA
// ============================================================

export const cvSchema = z.object({
  schemaVersion: z.literal(2).default(2),
  theme: themeSchema,
  personalInfo: personalInfoSchema,
  sections: z.array(sectionSchema).default([]),
});

// ============================================================
// INFERRED TYPES
// ============================================================

export type CVData = z.infer<typeof cvSchema>;
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Bullet = z.infer<typeof bulletSchema>;
export type Section = z.infer<typeof sectionSchema>;

export type SectionByType<T extends SectionType> = Extract<Section, { type: T }>;