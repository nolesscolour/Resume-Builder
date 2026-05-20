import type { ScreenTheme } from "@/lib/sections/types";
import type { ThemeId } from "@/lib/schema";

const harvard: ScreenTheme = {
  id: "harvard",
  label: "Harvard",
  pageClass: "font-doc text-black leading-relaxed",
  headerClass: "text-center pb-2.5 mb-4 border-b-[1.5px] border-black",
  nameClass: "text-2xl font-bold uppercase tracking-[0.06em]",
  contactRowClass: "text-[11px] mt-1.5 flex flex-wrap justify-center gap-x-2",
  contactSeparator: " · ",
  sectionClass: "mb-3",
  sectionTitleClass:
    "text-[11.5px] font-bold uppercase tracking-[0.08em] border-b-[0.75px] border-black pb-0.5 mb-1.5",
  bodyClass: "text-[11.5px] leading-[1.5]",
  mutedClass: "text-[10.5px] text-neutral-700",
  bulletListClass: "list-disc ml-[18px] text-[10.5px] leading-[1.45] mt-1",
  bulletItemClass: "pl-0.5 mb-0.5",
  itemHeaderClass: "flex justify-between items-baseline gap-3",
  itemTitleClass: "text-[12px] font-bold",
  itemSubtitleClass: "text-[11px] italic",
  itemDateClass: "text-[10.5px] text-neutral-700 tabular-nums whitespace-nowrap",
};

const faang: ScreenTheme = {
  ...harvard,
  id: "faang",
  label: "FAANG",
  pageClass: "font-sans text-neutral-900 leading-relaxed",
  headerClass: "pb-2.5 mb-4 border-b-2 border-neutral-900",
  nameClass: "text-2xl font-bold tracking-tight",
  contactRowClass: "text-[11px] mt-1.5 flex flex-wrap gap-x-3 text-neutral-700",
  contactSeparator: "",
  sectionTitleClass:
    "text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-900 mb-1.5",
  itemTitleClass: "text-[12px] font-semibold text-neutral-900",
  itemSubtitleClass: "text-[11px] text-neutral-700",
};

const dense: ScreenTheme = {
  ...harvard,
  id: "dense",
  label: "Dense",
  pageClass: "font-sans text-neutral-900 leading-tight",
  headerClass: "pb-1.5 mb-2.5 border-b border-neutral-300",
  nameClass: "text-xl font-bold tracking-tight",
  contactRowClass: "text-[10.5px] mt-1 flex flex-wrap gap-x-2 text-neutral-700",
  contactSeparator: " | ",
  sectionClass: "mb-2.5",
  sectionTitleClass:
    "text-[10.5px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5 mb-1",
  bodyClass: "text-[10.5px] leading-snug",
  bulletListClass: "list-disc ml-4 text-[10.5px] leading-snug",
  bulletItemClass: "pl-0.5",
  itemTitleClass: "text-[11px] font-semibold",
  itemSubtitleClass: "text-[10.5px] text-neutral-700",
  itemDateClass: "text-[10px] text-neutral-700 tabular-nums whitespace-nowrap",
};

export const screenThemes: Record<ThemeId, ScreenTheme> = {
  harvard,
  faang,
  dense,
};

export function getScreenTheme(id: ThemeId): ScreenTheme {
  return screenThemes[id] ?? harvard;
}