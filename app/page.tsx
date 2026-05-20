"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import { Download } from "lucide-react";
import { useCVForm } from "@/lib/store";
import { getScreenTheme } from "@/lib/renderers/screen/themes";
import { summaryEntry } from "@/lib/sections/summary";
import { PersonalInfoForm, PersonalInfoScreen } from "@/lib/sections/personal-info";
import { experienceEntry } from "@/lib/sections/experience";
import { educationEntry } from "@/lib/sections/education";
import { skillsEntry } from "@/lib/sections/skills";
import { getTabStatuses, canExport, type TabId, type TabState } from "@/lib/sections/completion";

function lineColor(state: TabState): string {
  if (state === "complete") return "bg-emerald-600";
  if (state === "partial") return "bg-amber-600";
  return "bg-hairline";
}

function dotClass(state: TabState): string {
  if (state === "complete") return "bg-current opacity-80";
  if (state === "partial") return "bg-current opacity-50";
  return "border border-current opacity-40";
}

export default function CVBuilderPage() {
  const { form, isMounted, resetForm } = useCVForm();
  const [confirmOpen, setConfirmOpen] = useState(false);
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

  const educationSectionIndex = data.sections.findIndex((s) => s.type === "education");
  const educationSection =
    educationSectionIndex >= 0 && data.sections[educationSectionIndex].type === "education"
      ? data.sections[educationSectionIndex]
      : null;

  const skillsSectionIndex = data.sections.findIndex((s) => s.type === "skills");
  const skillsSection =
    skillsSectionIndex >= 0 && data.sections[skillsSectionIndex].type === "skills"
      ? data.sections[skillsSectionIndex]
      : null;

  const SummaryForm = summaryEntry.formComponent;
  const SummaryScreen = summaryEntry.screenComponent;
  const ExperienceForm = experienceEntry.formComponent;
  const ExperienceScreen = experienceEntry.screenComponent;
  const EducationForm = educationEntry.formComponent;
  const EducationScreen = educationEntry.screenComponent;
  const SkillsForm = skillsEntry.formComponent;
  const SkillsScreen = skillsEntry.screenComponent;

  const tabStatuses = getTabStatuses(data);
  const exportState = canExport(data);

  return (
    <div className="h-screen p-10 overflow-hidden flex flex-col">
      <div className="max-w-[1480px] mx-auto w-full shrink-0 mb-6">
        <h1 className="font-display text-4xl text-ink leading-none">Build your CV.</h1>
        <p className="text-sm text-ink-mid mt-2 leading-snug">
          Fill in the details. Everything updates as you type.
        </p>
      </div>

      <div className="max-w-[1480px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 flex-1 min-h-0">

        {/* PREVIEW PANEL */}
        <section className="bg-panel rounded-lg flex flex-col h-full min-h-0 shadow-[0_1px_0_rgba(0,0,0,0.02),0_24px_60px_-30px_rgba(58,52,30,0.12)] overflow-hidden">
          <div className="flex justify-between items-baseline px-10 pt-10 pb-6 shrink-0">
            <span className="font-mono text-[11px] tracking-[0.08em] text-ink-mid uppercase">
              / Live preview
            </span>
            <span className="font-mono text-[11px] text-ink-faint">
              {theme.label} · Letter
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-10 pb-10">
            <div className="bg-paper border border-hairline rounded-sm p-14 shadow-[0_12px_32px_-16px_rgba(58,52,30,0.18)]">
              <div className={theme.pageClass}>
                <PersonalInfoScreen data={data.personalInfo} theme={theme} />
                {summarySection && <SummaryScreen section={summarySection} theme={theme} />}
                {experienceSection && <ExperienceScreen section={experienceSection} theme={theme} />}
                {educationSection && <EducationScreen section={educationSection} theme={theme} />}
                {skillsSection && <SkillsScreen section={skillsSection} theme={theme} />}
              </div>
            </div>
          </div>
        </section>

        {/* FORM PANEL */}
        <section className="bg-panel rounded-lg flex flex-col h-full min-h-0 shadow-[0_1px_0_rgba(0,0,0,0.02),0_24px_60px_-30px_rgba(58,52,30,0.12)] overflow-hidden">

          <Tabs.Root
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabId)}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="px-10 pt-10 shrink-0">
              <Tabs.List className="flex gap-1.5 mb-5 flex-wrap">
                {tabStatuses.map((t) => {
                  const isComplete = t.state === "complete";
                  const isPartial = t.state === "partial";
                  return (
                    <Tabs.Trigger
                      key={t.id}
                      value={t.id}
                      className="group relative inline-flex flex-col items-stretch gap-1.5"
                    >
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-mid px-3.5 py-1.5 border border-dashed border-hairline-strong rounded-sm group-data-[state=inactive]:hover:text-ink group-data-[state=inactive]:hover:border-ink-mid transition-colors group-data-[state=active]:bg-ink group-data-[state=active]:text-panel group-data-[state=active]:border-ink">
                        {t.label}
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${dotClass(t.state)} ${
                            isComplete ? "text-emerald-600" : isPartial ? "text-amber-600" : ""
                          }`}
                        />
                      </span>
                      <span
                        className={`h-[2px] rounded-full transition-colors ${lineColor(t.state)}`}
                      />
                    </Tabs.Trigger>
                  );
                })}
              </Tabs.List>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-10 pb-6">
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
                {educationSection && educationSectionIndex >= 0 && (
                  <EducationForm form={form} sectionIndex={educationSectionIndex} />
                )}
              </Tabs.Content>
              <Tabs.Content value="skills" className="outline-none">
                {skillsSection && skillsSectionIndex >= 0 && (
                  <SkillsForm form={form} sectionIndex={skillsSectionIndex} />
                )}
              </Tabs.Content>
            </div>
          </Tabs.Root>

          <div className="px-10 py-5 border-t border-hairline bg-panel flex items-center justify-between gap-4 flex-wrap shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10.5px] tracking-wider uppercase text-ink-mid mr-1">
                Theme
              </span>
              {(["harvard", "faang", "dense"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => form.setValue("theme", t, { shouldDirty: true })}
                  className={`w-7 h-7 border rounded-sm text-[11px] font-mono uppercase flex items-center justify-center transition-colors ${
                    data.theme === t
                      ? "border-ink bg-ivory-warm text-ink"
                      : "border-dashed border-hairline-strong text-ink-mid hover:text-ink hover:border-ink-mid"
                  }`}
                  aria-label={t}
                  title={t.charAt(0).toUpperCase() + t.slice(1)}
                >
                  {t.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
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
          </div>

        </section>

      </div>

      <div className="max-w-[1480px] mx-auto w-full shrink-0 mt-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="text-[12px] text-red-700 hover:text-red-900 transition-colors underline-offset-2 hover:underline"
          >
            Reset everything
          </button>
        </div>
      </div>

      <Dialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-panel border border-hairline rounded-md p-6 w-[400px] z-50 shadow-[0_24px_60px_-20px_rgba(58,52,30,0.35)]">
            <Dialog.Title className="font-display text-2xl text-ink leading-none mb-3">
              Reset everything?
            </Dialog.Title>
            <Dialog.Description className="text-[13px] text-ink-mid leading-snug mb-6">
              This clears all CV data permanently. You can&apos;t undo this.
            </Dialog.Description>
            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="text-[13px] text-ink-soft border border-dashed border-hairline-strong rounded-sm px-3.5 py-2 hover:text-ink hover:border-ink-mid transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setConfirmOpen(false);
                }}
                className="text-[13px] bg-red-700 text-panel border border-red-700 rounded-sm px-3.5 py-2 hover:bg-red-800 transition-colors"
              >
                Reset
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}