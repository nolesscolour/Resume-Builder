"use client";

import { FieldTip } from "./field-row";
import type { SectionEntry, SectionFormProps, SectionScreenProps } from "./types";
import type { SectionByType } from "@/lib/schema";

type SummarySection = SectionByType<"summary">;

function SummaryForm({ form, sectionIndex }: SectionFormProps) {
  return (
    <div className="border border-hairline rounded-md bg-paper overflow-hidden">
      <div className="grid grid-cols-[96px_1fr_44px] items-start border-b border-hairline focus-within:bg-ivory-warm transition-colors">
        <label className="text-[13px] text-ink-soft px-4 py-3.5 font-medium">
          Summary
        </label>
        <textarea
          {...form.register(`sections.${sectionIndex}.data.text`)}
          placeholder="Two or three sentences. What you do, what you're known for."
          className="w-full bg-transparent border-0 text-[14px] text-ink py-3.5 pr-4 leading-snug min-h-[100px] resize-y outline-none placeholder:text-ink-faint"
        />
        <div className="border-l border-hairline self-stretch flex items-start justify-center pt-3.5">
          <FieldTip text="Two or three sentences. Lead with what you do and your strongest specialty, then add one line of proof — years of experience, notable companies, or a measurable result. Avoid 'passionate', 'motivated', 'team player' — every CV says that." />
        </div>
      </div>
    </div>
  );
}

function SummaryScreen({ section, theme }: SectionScreenProps<SummarySection>) {
  if (!section.data.text.trim()) return null;
  return (
    <section className={theme.sectionClass}>
      <h2 className={theme.sectionTitleClass}>Summary</h2>
      <p className={theme.bodyClass}>{section.data.text}</p>
    </section>
  );
}

export const summaryEntry: SectionEntry<SummarySection> = {
  type: "summary",
  label: "Summary",
  description: "A short statement at the top of the CV.",
  formComponent: SummaryForm,
  screenComponent: SummaryScreen as never,
  isEmpty: (s) => !s.data.text.trim(),
};