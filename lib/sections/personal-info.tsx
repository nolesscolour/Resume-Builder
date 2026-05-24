"use client";

import type { UseFormReturn } from "react-hook-form";
import type { CVData } from "@/lib/schema";
import type { ScreenTheme } from "./types";
import { FieldRow } from "./field-row";

// Personal info is special — it lives at the root, not in sections[].
// It still follows the same form/screen pattern.

export function PersonalInfoForm({ form }: { form: UseFormReturn<CVData> }) {
  return (
    <div className="border border-hairline rounded-md bg-paper overflow-hidden">
      <FieldRow label="Full name" required tip="Use your real legal or professional name as it appears on LinkedIn and your ID. Drop nicknames and middle initials unless you actually publish under them.">
        <input
          type="text"
          {...form.register("personalInfo.fullName")}
          placeholder="Jane Doe"
          className={inputClass}
        />
      </FieldRow>
      <FieldRow label="Email" required tip="Use a clean firstname.lastname address from Gmail or your own domain. Skip nicknames, numbers, and old college emails.">
        <input
          type="email"
          {...form.register("personalInfo.email")}
          placeholder="jane@example.com"
          className={inputClass}
        />
      </FieldRow>
      <FieldRow label="Phone" required tip="Include country code (+91 for India, +1 for US). Use the number you actually answer — recruiters call.">
        <input
          type="tel"
          {...form.register("personalInfo.phone")}
          placeholder="+91 98765 43210"
          className={inputClass}
        />
      </FieldRow>
      <FieldRow label="Location" required tip="City and country only. No street address. If you're open to relocation, write 'City, Country (open to relocation)'.">
        <input
          type="text"
          {...form.register("personalInfo.location")}
          placeholder="Kolkata, India"
          className={inputClass}
        />
      </FieldRow>
      <FieldRow label="LinkedIn" tip="Custom URL preferred — 'linkedin.com/in/janedoe' not the default string of numbers. Make sure your profile matches your CV.">
        <input
          type="url"
          {...form.register("personalInfo.linkedin")}
          placeholder="linkedin.com/in/..."
          className={inputClass}
        />
      </FieldRow>
      <FieldRow label="GitHub" tip="Include only if your GitHub shows real work — pinned repos, recent commits. An empty profile is worse than no link.">
        <input
          type="url"
          {...form.register("personalInfo.github")}
          placeholder="github.com/..."
          className={inputClass}
        />
      </FieldRow>
      <FieldRow label="Website" last tip="Personal portfolio, project showcase, or writing. Skip if it's outdated or under construction.">
        <input
          type="url"
          {...form.register("personalInfo.website")}
          placeholder="example.com"
          className={inputClass}
        />
      </FieldRow>
    </div>
  );
}

const inputClass =
  "w-full bg-transparent border-0 text-[14px] text-ink py-3.5 pr-4 outline-none placeholder:text-ink-faint";

// Header renderer (sits above sections in the document)
export function PersonalInfoScreen({
  data,
  theme,
}: {
  data: CVData["personalInfo"];
  theme: ScreenTheme;
}) {
  const items = [
    data.email,
    data.phone,
    data.location,
    data.linkedin,
    data.github,
    data.website,
  ].filter(Boolean);

  return (
    <header className={theme.headerClass}>
      <div className={theme.nameClass}>{data.fullName || "Your Name"}</div>
      {items.length > 0 && (
        <div className={theme.contactRowClass}>
          {items.map((item, i) => (
            <span key={i}>
              {item}
              {i < items.length - 1 && theme.contactSeparator && (
                <span className="text-neutral-500">{theme.contactSeparator}</span>
              )}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}