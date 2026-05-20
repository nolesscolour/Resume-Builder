"use client";

import type { UseFormReturn } from "react-hook-form";
import type { CVData } from "@/lib/schema";
import type { ScreenTheme } from "./types";

// Personal info is special — it lives at the root, not in sections[].
// It still follows the same form/screen pattern.

export function PersonalInfoForm({ form }: { form: UseFormReturn<CVData> }) {
  return (
    <div className="border border-hairline rounded-md bg-paper overflow-hidden">
      <Row label="Full name" required>
        <input
          type="text"
          {...form.register("personalInfo.fullName")}
          placeholder="Jane Doe"
          className={inputClass}
        />
      </Row>
      <Row label="Email" required>
        <input
          type="email"
          {...form.register("personalInfo.email")}
          placeholder="jane@example.com"
          className={inputClass}
        />
      </Row>
      <Row label="Phone" required>
        <input
          type="tel"
          {...form.register("personalInfo.phone")}
          placeholder="+91 98765 43210"
          className={inputClass}
        />
      </Row>
      <Row label="Location" required>
        <input
          type="text"
          {...form.register("personalInfo.location")}
          placeholder="Kolkata, India"
          className={inputClass}
        />
      </Row>
      <Row label="LinkedIn">
        <input
          type="url"
          {...form.register("personalInfo.linkedin")}
          placeholder="linkedin.com/in/..."
          className={inputClass}
        />
      </Row>
      <Row label="GitHub">
        <input
          type="url"
          {...form.register("personalInfo.github")}
          placeholder="github.com/..."
          className={inputClass}
        />
      </Row>
      <Row label="Website" last>
        <input
          type="url"
          {...form.register("personalInfo.website")}
          placeholder="example.com"
          className={inputClass}
        />
      </Row>
    </div>
  );
}

function Row({ label, last, required, children }: { label: string; last?: boolean; required?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`grid grid-cols-[96px_1fr] items-center ${last ? "" : "border-b border-hairline"} focus-within:bg-ivory-warm transition-colors`}
    >
      <label className="text-[13px] text-ink-soft px-4 py-3.5 font-medium">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      {children}
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