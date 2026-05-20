"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Download } from "lucide-react";
import { useCVForm } from "@/lib/store";
import { getScreenTheme } from "@/lib/renderers/screen/themes";
import { summaryEntry } from "@/lib/sections/summary";
import { PersonalInfoForm, PersonalInfoScreen } from "@/lib/sections/personal-info";
import { experienceEntry } from "@/lib/sections/experience";
import { getTabStatuses, canExport, type TabId } from "@/lib/sections/completion";

export default function CVBuilderPage() {
  const { form, isMounted } = useCVForm();
  const [activeTab, setActiveTab] = useState<TabId>("personal");

  if (!isMounted) return null;

  const data = form.watch();
  const theme = getScreenTheme(data.theme);

  const summarySectionIndex = data.sections.findIndex((s) => s.type === "summary");
  const summarySection =
    summarySectionIndex >= 0 && data.sections[summarySectionIndex].type === "summary"
      ? data.sections[summarySectionIndex]
      : null;

  const experienceSectionIndex = data.sections.findIndex((s) => s.type === "experience");
  const experienceSection =
    experienceSectionIndex >= 0 && data.sections[experienceSectionIndex].type === "experience"
      ? data.sections[experienceSectionIndex]
      : null;

  const SummaryForm = summaryEntry.formComponent;
  const SummaryScreen = summaryEntry.screenComponent;
  const ExperienceForm = experienceEntry.formComponent;
  const ExperienceScreen = experienceEntry.screenComponent;

  const tabStatuses = getTabStatuses(data);
  const filledCount = tabStatuses.filter((t) => t.filled).length;
  const exportState = canExport(data);

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
              {summarySection && <SummaryScreen section={summarySection} theme={theme} />}
              {experienceSection && <ExperienceScreen section={experienceSection} theme={theme} />}
            </div>
          </div>
        </section>

        {/* FORM PANEL */}
        <section className="bg-panel rounded-lg p-10 min-h-[calc(100vh-80px)] shadow-[0_1px_0_rgba(0,0,0,0.02),0_24px_60px_-30px_rgba(58,52,30,0.12)] flex flex-col">
          <div className="mb-6">
            <h1 className="font-display text-4xl text-ink leading-none">Build your CV.</h1>
            <p className="text-sm text-ink-mid mt-3 leading-snug max-w-[42ch]">
              Fill in the details. Everything updates as you type.
            </p>
          </div>

          {/* Progress stepper */}
          <div className="mb-5">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-mono text-[10.5px] tracking-wider uppercase text-ink-mid">
                Progress
              </span>
              <span className="font-mono text-[10.5px] text-ink-faint tabular-nums">
                {filledCount} / {tabStatuses.length}
              </span>
            </div>
            <div className="flex gap-1">
              {tabStatuses.map((t) => (
                <div
                  key={t.id}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    t.filled ? "bg-ink" : "bg-hairline"
                  }`}
                />
              ))}
            </div>
          </div>

          <Tabs.Root
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabId)}
            className="flex flex-col flex-1"
          >
            <Tabs.List className="flex gap-1.5 mb-5 flex-wrap">
              {tabStatuses.map((t) => (
                <Tabs.Trigger
                  key={t.id}
                  value={t.id}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-mid px-3.5 py-1.5 border border-dashed border-hairline-strong rounded-sm hover:text-ink hover:border-ink-mid transition-colors data-[state=active]:bg-ink data-[state=active]:text-panel data-[state=active]:border-ink"
                >
                  {t.label}
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      t.filled
                        ? "bg-current opacity-80"
                        : "border border-current opacity-40"
                    }`}
                  />
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <div className="flex-1">
              <Tabs.Content value="personal" className="outline-none">
                <PersonalInfoForm form={form} />
              </Tabs.Content>
              <Tabs.Content value="summary" className="outline-none">
                {summarySection && summarySectionIndex >= 0 && (
                  <SummaryForm form={form} sectionIndex={summarySectionIndex} />
                )}
              </Tabs.Content>
              <Tabs.Content value="experience" className="outline-none">
                {experienceSection && experienceSectionIndex >= 0 && (
                  <ExperienceForm form={form} sectionIndex={experienceSectionIndex} />
                )}
              </Tabs.Content>
              <Tabs.Content value="education" className="outline-none">
                <p className="text-[12.5px] text-ink-faint italic">
                  Education section — coming next.
                </p>
              </Tabs.Content>
              <Tabs.Content value="skills" className="outline-none">
                <p className="text-[12.5px] text-ink-faint italic">
                  Skills section — coming next.
                </p>
              </Tabs.Content>
            </div>
          </Tabs.Root>

          {/* Bottom action bar */}
          <div className="mt-8 pt-6 border-t border-hairline flex items-center justify-between">
            <span className="font-mono text-[10.5px] text-ink-faint">
              {exportState.ok ? "Ready to export" : exportState.reason}
            </span>
            <button
              type="button"
              disabled={!exportState.ok}
              className="inline-flex items-center gap-2 bg-ink text-panel border border-ink rounded-sm px-4 py-2.5 text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" />
              Export PDF
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}