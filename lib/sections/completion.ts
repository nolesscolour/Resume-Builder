import type { CVData } from "@/lib/schema";

export type TabId = "personal" | "summary" | "experience" | "education" | "skills";

export type TabStatus = {
  id: TabId;
  label: string;
  filled: boolean;
};

export function getTabStatuses(data: CVData): TabStatus[] {
  const summary = data.sections.find((s) => s.type === "summary");
  const experience = data.sections.find((s) => s.type === "experience");
  const education = data.sections.find((s) => s.type === "education");
  const skills = data.sections.find((s) => s.type === "skills");

  return [
    {
      id: "personal",
      label: "Personal",
      filled: Boolean(data.personalInfo.fullName.trim()),
    },
    {
      id: "summary",
      label: "Summary",
      filled: Boolean(summary?.type === "summary" && summary.data.text.trim()),
    },
    {
      id: "experience",
      label: "Experience",
      filled: Boolean(
        experience?.type === "experience" &&
          experience.data.items.some(
            (i) =>
              i.company.trim() ||
              i.role.trim() ||
              i.bullets.some((b) => b.text.trim())
          )
      ),
    },
    {
      id: "education",
      label: "Education",
      filled: Boolean(
        education?.type === "education" &&
          education.data.items.some(
            (i) => i.school.trim() || i.degree.trim()
          )
      ),
    },
    {
      id: "skills",
      label: "Skills",
      filled: Boolean(
        skills?.type === "skills" &&
          skills.data.groups.some(
            (g) => g.items.length > 0 || g.label.trim()
          )
      ),
    },
  ];
}

export function canExport(data: CVData): { ok: boolean; reason: string } {
  if (!data.personalInfo.fullName.trim()) {
    return { ok: false, reason: "Add your name to export" };
  }
  const statuses = getTabStatuses(data);
  const contentTabs = statuses.filter((s) => s.id !== "personal");
  if (!contentTabs.some((s) => s.filled)) {
    return { ok: false, reason: "Fill at least one section to export" };
  }
  return { ok: true, reason: "" };
}