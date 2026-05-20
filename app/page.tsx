"use client";

import { useCVForm } from "@/lib/store";
import { getScreenTheme } from "@/lib/renderers/screen/themes";
import { summaryEntry } from "@/lib/sections/summary";
import { PersonalInfoForm, PersonalInfoScreen } from "@/lib/sections/personal-info";

export default function CVBuilderPage() {
  const { form, isMounted } = useCVForm();

  if (!isMounted) return null;

  const data = form.watch();
  const theme = getScreenTheme(data.theme);
  const summarySectionIndex = data.sections.findIndex((s) => s.type === "summary");
  const summarySection =
    summarySectionIndex >= 0 && data.sections[summarySectionIndex].type === "summary"
      ? data.sections[summarySectionIndex]
      : null;

  const SummaryForm = summaryEntry.formComponent;
  const SummaryScreen = summaryEntry.screenComponent;

  return (
    <div className="min-h-screen p-10">
      <div className="max-w-[1480px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        {/* PREVIEW PANEL */}
        <section className="bg-panel rounded-lg p-10 min-h-[calc(100vh-80px)] shadow-[0_1px_0_rgba(0,0,0,0.02),0_24px_60px_-30px_rgba(58,52,30,0.12)]">
          <div className="flex justify-between items-baseline mb-6">
            <span className="font-mono text-[11px] tracking-[0.08em] text-ink-mid uppercase">
              / Live preview
            </span>
            <span className="font-mono text-[11px] text-ink-faint">
              {theme.label} · Letter
            </span>
          </div>

          <div className="bg-paper border border-hairline rounded-sm p-14 shadow-[0_12px_32px_-16px_rgba(58,52,30,0.18)]">
            <div className={theme.pageClass}>
              <PersonalInfoScreen data={data.personalInfo} theme={theme} />

              {summarySection && (
                <SummaryScreen section={summarySection} theme={theme} />
              )}
            </div>
          </div>
        </section>

        {/* FORM PANEL */}
        <section className="bg-panel rounded-lg p-10 min-h-[calc(100vh-80px)] shadow-[0_1px_0_rgba(0,0,0,0.02),0_24px_60px_-30px_rgba(58,52,30,0.12)] flex flex-col">
          <div className="mb-8">
            <h1 className="font-display text-4xl text-ink leading-none">Build your CV.</h1>
            <p className="text-sm text-ink-mid mt-3 leading-snug max-w-[42ch]">
              Fill in the details. Everything updates as you type.
            </p>
          </div>

          <div className="space-y-5">
            <PersonalInfoForm form={form} />
            {summarySection && summarySectionIndex >= 0 && (
              <SummaryForm form={form} sectionIndex={summarySectionIndex} />
            )}
          </div>
        </section>

      </div>
    </div>
  );
}