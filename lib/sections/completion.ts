import type { CVData } from "@/lib/schema";

export type TabId = "personal" | "summary" | "experience" | "education" | "skills";
export type TabState = "empty" | "partial" | "complete";

export type TabStatus = {
  id: TabId;
  label: string;
  state: TabState;
};

export function getTabStatuses(data: CVData): TabStatus[] {
  return [
    { id: "personal", label: "Personal", state: personalState(data) },
    { id: "summary", label: "Summary", state: summaryState(data) },
    { id: "experience", label: "Experience", state: experienceState(data) },
    { id: "education", label: "Education", state: educationState(data) },
    { id: "skills", label: "Skills", state: skillsState(data) },
  ];
}

function personalState(data: CVData): TabState {
  const p = data.personalInfo;
  const required = [p.fullName, p.email, p.phone, p.location];
  const filled = required.filter((v) => v.trim()).length;
  if (filled === 0) return "empty";
  if (filled < required.length) return "partial";
  return "complete";
}

function summaryState(data: CVData): TabState {
  const s = data.sections.find((x) => x.type === "summary");
  if (s?.type !== "summary") return "empty";
  const len = s.data.text.trim().length;
  if (len === 0) return "empty";
  if (len < 40) return "partial";
  return "complete";
}

function experienceState(data: CVData): TabState {
  const s = data.sections.find((x) => x.type === "experience");
  if (s?.type !== "experience") return "empty";
  const items = s.data.items;
  if (items.length === 0) return "empty";
  const anyComplete = items.some(
    (i) => i.company.trim() && i.role.trim() && (i.startDate.trim() || i.endDate.trim())
  );
  return anyComplete ? "complete" : "partial";
}

function educationState(data: CVData): TabState {
  const s = data.sections.find((x) => x.type === "education");
  if (s?.type !== "education") return "empty";
  const items = s.data.items;
  if (items.length === 0) return "empty";
  const anyComplete = items.some((i) => i.school.trim() && i.degree.trim());
  return anyComplete ? "complete" : "partial";
}

function skillsState(data: CVData): TabState {
  const s = data.sections.find((x) => x.type === "skills");
  if (s?.type !== "skills") return "empty";
  const groups = s.data.groups;
  if (groups.length === 0) return "empty";
  const anyWithItems = groups.some((g) => g.items.length > 0);
  return anyWithItems ? "complete" : "partial";
}

export function canExport(data: CVData): { ok: boolean; reason: string } {
  if (!data.personalInfo.fullName.trim()) {
    return { ok: false, reason: "Add your name to export" };
  }
  const statuses = getTabStatuses(data);
  const contentTabs = statuses.filter((s) => s.id !== "personal");
  if (!contentTabs.some((s) => s.state !== "empty")) {
    return { ok: false, reason: "Fill at least one section to export" };
  }
  return { ok: true, reason: "" };
}