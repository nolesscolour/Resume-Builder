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

  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const hasAutoAdded = useRef(false);

  useEffect(() => {
    if (fields.length === 0 && !hasAutoAdded.current) {
      hasAutoAdded.current = true;
      append(makeEmptyEdu());
      setExpandedIndex(0);
    } else if (fields.length > 0 && expandedIndex >= fields.length) {
      setExpandedIndex(fields.length - 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.length]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    if (oldIndex >= 0 && newIndex >= 0) {
      move(oldIndex, newIndex);
      if (expandedIndex === oldIndex) setExpandedIndex(newIndex);
      else if (expandedIndex === newIndex) setExpandedIndex(oldIndex);
    }
  }

  function handleAdd() {
    append(makeEmptyEdu());
    setExpandedIndex(fields.length);
  }

  function handleRemove(index: number) {
    if (fields.length === 1) {
      const empty = makeEmptyEdu();
      form.setValue(`sections.${sectionIndex}.data.items.${index}` as const, empty, {
        shouldDirty: true,
      });
      setExpandedIndex(0);
    } else {
      remove(index);
      if (expandedIndex === index) setExpandedIndex(0);
      else if (expandedIndex > index) setExpandedIndex(expandedIndex - 1);
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
                onToggle={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
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
          <FieldRow label="School" required>
            <input
              {...form.register(`sections.${sectionIndex}.data.items.${eduIndex}.school`)}
              placeholder="National Institute of Design"
              className={inputClass}
            />
          </FieldRow>
          <FieldRow label="Degree" required>
            <input
              {...form.register(`sections.${sectionIndex}.data.items.${eduIndex}.degree`)}
              placeholder="B.Des"
              className={inputClass}
            />
          </FieldRow>
          <FieldRow label="Field">
            <input
              {...form.register(`sections.${sectionIndex}.data.items.${eduIndex}.field`)}
              placeholder="Interaction Design"
              className={inputClass}
            />
          </FieldRow>
          <FieldRow label="Location">
            <input
              {...form.register(`sections.${sectionIndex}.data.items.${eduIndex}.location`)}
              placeholder="Ahmedabad, India"
              className={inputClass}
            />
          </FieldRow>
          <div className="grid grid-cols-2 border-b border-hairline">
            <div className="grid grid-cols-[60px_1fr] items-center focus-within:bg-ivory-warm transition-colors">
              <label className="text-[13px] text-ink-soft px-3 py-3.5 font-medium">Start</label>
              <input
                {...form.register(`sections.${sectionIndex}.data.items.${eduIndex}.startDate`)}
                placeholder="MM/YYYY"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-[60px_1fr] items-center border-l border-hairline focus-within:bg-ivory-warm transition-colors">
              <label className="text-[13px] text-ink-soft px-3 py-3.5 font-medium">End</label>
              <input
                {...form.register(`sections.${sectionIndex}.data.items.${eduIndex}.endDate`)}
                placeholder="MM/YYYY"
                className={inputClass}
              />
            </div>
          </div>
          <FieldRow label="GPA" last>
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

function FieldRow({
  label,
  children,
  last,
  required,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
  required?: boolean;
}) {
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