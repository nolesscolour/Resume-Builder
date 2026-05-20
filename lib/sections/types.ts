import type { UseFormReturn } from "react-hook-form";
import type { CVData, Section, SectionType, ThemeId } from "@/lib/schema";

export type ScreenTheme = {
  id: ThemeId;
  label: string;
  pageClass: string;
  headerClass: string;
  nameClass: string;
  contactRowClass: string;
  contactSeparator: string;
  sectionClass: string;
  sectionTitleClass: string;
  bodyClass: string;
  mutedClass: string;
  bulletListClass: string;
  bulletItemClass: string;
  itemHeaderClass: string;
  itemTitleClass: string;
  itemSubtitleClass: string;
  itemDateClass: string;
};

export type SectionFormProps = {
  form: UseFormReturn<CVData>;
  sectionIndex: number;
};

export type SectionFormComponent = React.ComponentType<SectionFormProps>;

export type SectionScreenProps<T extends Section = Section> = {
  section: T;
  theme: ScreenTheme;
};

export type SectionScreenComponent<T extends Section = Section> =
  React.ComponentType<SectionScreenProps<T>>;

export type SectionEntry<T extends Section = Section> = {
  type: SectionType;
  label: string;
  description: string;
  formComponent: SectionFormComponent;
  screenComponent: SectionScreenComponent<T>;
  isEmpty: (section: T) => boolean;
};

export type SectionRegistry = Partial<Record<SectionType, SectionEntry>>;