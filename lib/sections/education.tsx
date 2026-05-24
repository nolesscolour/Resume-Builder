"use client";

import { useEffect, useRef, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2, GripVertical, ChevronDown } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SectionEntry, SectionFormProps, SectionScreenProps } from "./types";
import { FieldRow, FieldTip } from "./field-row";
import type { SectionByType } from "@/lib/schema";

type EducationSection = SectionByType<"education">;

function makeEmptyEdu() {
  return {
    id: crypto.randomUUID(),
    school: "",
    degree: "",
    field: "",
    location: "",
    startDate: "",
    endDate: "",
    gpa: "",
  };
}

function EducationForm({ form, sectionIndex }: SectionFormProps) {
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: `sections.${sectionIndex}.data.items` as const,
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const hasAutoAdded = useRef(false);

  useEffect(() => {
    if (fields.length === 0 && !hasAutoAdded.current) {
      hasAutoAdded.current = true;
      append(makeEmptyEdu());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const explicitIndex = expandedId
    ? fields.findIndex((f) => f.id === expandedId)
    : -1;
  const expandedIndex =
    explicitIndex >= 0
      ? explicitIndex
      : fields.length > 0
      ? fields.length - 1
      : -1;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    if (oldIndex >= 0 && newIndex >= 0) move(oldIndex, newIndex);
  }

  function handleAdd() {
    const edu = makeEmptyEdu();
    append(edu);
    setExpandedId(edu.id);
  }

  function handleRemove(index: number) {
    if (fields.length === 1) {
      const empty = makeEmptyEdu();
      form.setValue(`sections.${sectionIndex}.data.items.${index}` as const, empty, {
        shouldDirty: true,
      });
      setExpandedId(null);
    } else {
      if (fields[index]?.id === expandedId) setExpandedId(null);
      remove(index);
    }
  }

  const collapsible = fields.length > 1;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center sticky top-0 bg-panel py-2 z-10 -mx-1 px-1">
        <h2 className="font-mono text-[11px] tracking-[0.08em] text-ink-mid uppercase">
          / Education
        </h2>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 border border-dashed border-hairline-strong text-ink-soft text-[12px] px-2.5 py-1.5 rounded-sm hover:border-ink-mid hover:text-ink transition-colors"
        >
          <Plus className="w-3 h-3" /> Add education
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <SortableEduCard
                key={field.id}
                id={field.id}
                form={form}
                sectionIndex={sectionIndex}
                eduIndex={index}
                isExpanded={expandedIndex === index}
                collapsible={collapsible}
                onToggle={() =>
                  setExpandedId(fields[index].id === expandedId ? null : fields[index].id)
                }
                onRemove={() => handleRemove(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableEduCard(props: {
  id: string;
  form: SectionFormProps["form"];
  sectionIndex: number;
  eduIndex: number;
  isExpanded: boolean;
  collapsible: boolean;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <EduCard {...props} dragAttributes={attributes} dragListeners={listeners} />
    </div>
  );
}

function EduCard({
  form,
  sectionIndex,
  eduIndex,
  isExpanded,
  collapsible,
  onToggle,
  onRemove,
  dragAttributes,
  dragListeners,
}: {
  form: SectionFormProps["form"];
  sectionIndex: number;
  eduIndex: number;
  isExpanded: boolean;
  collapsible: boolean;
  onToggle: () => void;
  onRemove: () => void;
  dragAttributes?: React.HTMLAttributes<HTMLButtonElement>;
  dragListeners?: React.DOMAttributes<HTMLButtonElement>;
}) {
  const school = form.watch(`sections.${sectionIndex}.data.items.${eduIndex}.school` as const);
  const degree = form.watch(`sections.${sectionIndex}.data.items.${eduIndex}.degree` as const);

  const summaryTitle =
    [school, degree].filter((s) => s && s.trim()).join(" — ") || `Entry #${eduIndex + 1}`;

  return (
    <div className="border border-hairline rounded-md bg-paper overflow-hidden">
      <div
        className={`flex justify-between items-center px-2 py-2 border-b border-hairline bg-ivory-warm/30 ${
          collapsible ? "cursor-pointer" : ""
        }`}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("button[data-no-toggle]")) return;
          if (collapsible) onToggle();
        }}
      >
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <button
            type="button"
            aria-label="Drag to reorder"
            data-no-toggle
            className="cursor-grab active:cursor-grabbing text-ink-faint hover:text-ink-mid p-1.5 transition-colors touch-none shrink-0"
            {...dragAttributes}
            {...dragListeners}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <span className="text-[12px] font-medium text-ink-soft truncate">{summaryTitle}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onRemove}
            data-no-toggle
            aria-label="Remove education"
            className="text-ink-mid hover:text-red-700 transition-colors p-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {collapsible && (
            <ChevronDown
              className={`w-3.5 h-3.5 text-ink-mid transition-transform mr-1 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>

      {isExpanded && (
        <>
          <FieldRow label="School" required tip="Full official name of the institution. 'MIT' is fine if widely recognized; otherwise write it out. Don't include the department here — that goes in Field.">
            <input
              {...form.register(`sections.${sectionIndex}.data.items.${eduIndex}.school`)}
              placeholder="National Institute of Design"
              className={inputClass}
            />
          </FieldRow>
          <FieldRow label="Degree" required tip="The degree name only: B.Tech, M.S., MBA, B.A., Ph.D. Skip 'Bachelor of' prefixes — use the standard abbreviation recruiters scan for.">
            <input
              {...form.register(`sections.${sectionIndex}.data.items.${eduIndex}.degree`)}
              placeholder="B.Des"
              className={inputClass}
            />
          </FieldRow>
          <FieldRow label="Field" tip="Major or specialization — Computer Science, Interaction Design, Mechanical Engineering. Skip generic terms like 'Studies'.">
            <input
              {...form.register(`sections.${sectionIndex}.data.items.${eduIndex}.field`)}
              placeholder="Interaction Design"
              className={inputClass}
            />
          </FieldRow>
          <FieldRow label="Location" tip="City and country. Helps recruiters who care about regional context — local employers often filter by it.">
            <input
              {...form.register(`sections.${sectionIndex}.data.items.${eduIndex}.location`)}
              placeholder="Ahmedabad, India"
              className={inputClass}
            />
          </FieldRow>
          <div className="grid grid-cols-2 border-b border-hairline">
            <div className="grid grid-cols-[60px_1fr_44px] items-center focus-within:bg-ivory-warm transition-colors">
              <label className="text-[13px] text-ink-soft px-3 py-3.5 font-medium">Start</label>
              <input
                {...form.register(`sections.${sectionIndex}.data.items.${eduIndex}.startDate`)}
                placeholder="MM/YYYY"
                className={inputClass}
              />
              <div className="border-l border-hairline h-full flex items-center justify-center">
                <FieldTip text="Use MM/YYYY format. Use the actual start of your program, not the calendar year you were accepted." />
              </div>
            </div>
            <div className="grid grid-cols-[60px_1fr_44px] items-center border-l border-hairline focus-within:bg-ivory-warm transition-colors">
              <label className="text-[13px] text-ink-soft px-3 py-3.5 font-medium">End</label>
              <input
                {...form.register(`sections.${sectionIndex}.data.items.${eduIndex}.endDate`)}
                placeholder="MM/YYYY"
                className={inputClass}
              />
              <div className="border-l border-hairline h-full flex items-center justify-center">
                <FieldTip text="Graduation date (MM/YYYY). For ongoing degrees, use 'Expected MM/YYYY'." />
              </div>
            </div>
          </div>
          <FieldRow label="GPA" last tip="Only include if it's 3.5/4.0 or above (or top 25% equivalent). Below that, leave it blank — a low GPA hurts more than no GPA. Always include the scale: '3.8/4.0', not just '3.8'.">
            <input
              {...form.register(`sections.${sectionIndex}.data.items.${eduIndex}.gpa`)}
              placeholder="3.8 / 4.0 (optional)"
              className={inputClass}
            />
          </FieldRow>
        </>
      )}
    </div>
  );
}



const inputClass =
  "w-full bg-transparent border-0 text-[14px] text-ink py-3.5 pr-4 outline-none placeholder:text-ink-faint";

function EducationScreen({ section, theme }: SectionScreenProps<EducationSection>) {
  const items = section.data.items.filter(
    (i) => i.school.trim() || i.degree.trim()
  );
  if (items.length === 0) return null;

  return (
    <section className={theme.sectionClass}>
      <h2 className={theme.sectionTitleClass}>Education</h2>
      {items.map((edu) => {
        const degreeLine = [edu.degree, edu.field].filter(Boolean).join(", ");
        const dateRange = formatDateRange(edu.startDate, edu.endDate);
        return (
          <div key={edu.id} className="mb-2.5">
            <div className={theme.itemHeaderClass}>
              <span className={theme.itemTitleClass}>{edu.school || "School"}</span>
              {dateRange && <span className={theme.itemDateClass}>{dateRange}</span>}
            </div>
            {degreeLine && <div className={theme.itemSubtitleClass}>{degreeLine}</div>}
            {edu.gpa && <div className={theme.mutedClass}>GPA: {edu.gpa}</div>}
          </div>
        );
      })}
    </section>
  );
}

function formatDateRange(start: string, end: string): string {
  if (!start && !end) return "";
  if (!start) return end;
  if (!end) return start;
  return `${start} — ${end}`;
}

export const educationEntry: SectionEntry<EducationSection> = {
  type: "education",
  label: "Education",
  description: "School, degree, dates.",
  formComponent: EducationForm,
  screenComponent: EducationScreen as never,
  isEmpty: (s) => s.data.items.every((i) => !i.school.trim() && !i.degree.trim()),
};