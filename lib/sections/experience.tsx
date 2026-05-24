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

type ExperienceSection = SectionByType<"experience">;

function makeEmptyJob() {
  return {
    id: crypto.randomUUID(),
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    bullets: [],
  };
}

function ExperienceForm({ form, sectionIndex }: SectionFormProps) {
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: `sections.${sectionIndex}.data.items` as const,
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const hasAutoAdded = useRef(false);

  // Auto-add a single empty entry on first mount when list is empty
  useEffect(() => {
    if (fields.length === 0 && !hasAutoAdded.current) {
      hasAutoAdded.current = true;
      append(makeEmptyJob());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derive expanded index at render time. If the stored ID doesn't match any
  // current field (e.g. user deleted it, or none picked yet), fall back to the
  // last card. -1 means nothing is expanded.
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
    // expandedId persists through reorder \u2014 same field still expanded
  }

  function handleAdd() {
    const job = makeEmptyJob();
    append(job);
    setExpandedId(job.id);
  }

  function handleRemove(index: number) {
    if (fields.length === 1) {
      const empty = makeEmptyJob();
      form.setValue(`sections.${sectionIndex}.data.items.${index}` as const, empty, {
        shouldDirty: true,
      });
      setExpandedId(null);
    } else {
      remove(index);
      // If the removed card was the explicitly expanded one, clear so derive falls back to last
      if (fields[index]?.id === expandedId) setExpandedId(null);
    }
  }

  const collapsible = fields.length > 1;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center sticky top-0 bg-panel py-2 z-10 -mx-1 px-1">
        <h2 className="font-mono text-[11px] tracking-[0.08em] text-ink-mid uppercase">
          / Experience
        </h2>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 border border-dashed border-hairline-strong text-ink-soft text-[12px] px-2.5 py-1.5 rounded-sm hover:border-ink-mid hover:text-ink transition-colors"
        >
          <Plus className="w-3 h-3" /> Add job
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <SortableJobCard
                key={field.id}
                id={field.id}
                form={form}
                sectionIndex={sectionIndex}
                jobIndex={index}
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

function SortableJobCard(props: {
  id: string;
  form: SectionFormProps["form"];
  sectionIndex: number;
  jobIndex: number;
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
      <JobCard {...props} dragAttributes={attributes} dragListeners={listeners} />
    </div>
  );
}

function JobCard({
  form,
  sectionIndex,
  jobIndex,
  isExpanded,
  collapsible,
  onToggle,
  onRemove,
  dragAttributes,
  dragListeners,
}: {
  form: SectionFormProps["form"];
  sectionIndex: number;
  jobIndex: number;
  isExpanded: boolean;
  collapsible: boolean;
  onToggle: () => void;
  onRemove: () => void;
  dragAttributes?: React.HTMLAttributes<HTMLButtonElement>;
  dragListeners?: React.DOMAttributes<HTMLButtonElement>;
}) {
  const bulletsPath = `sections.${sectionIndex}.data.items.${jobIndex}.bullets` as const;
  const { fields: bullets, append: appendBullet, remove: removeBullet } = useFieldArray({
    control: form.control,
    name: bulletsPath,
  });

  const company = form.watch(`sections.${sectionIndex}.data.items.${jobIndex}.company` as const);
  const role = form.watch(`sections.${sectionIndex}.data.items.${jobIndex}.role` as const);

  const summaryTitle =
    [company, role].filter((s) => s && s.trim()).join(" — ") || `Job #${jobIndex + 1}`;

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
            aria-label="Remove job"
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
          <FieldRow label="Company" required tip="Use the official company name as it appears on LinkedIn or the company website. Skip 'Inc.', 'LLC', and parent-company suffixes unless the brand is genuinely known by them.">
            <input
              {...form.register(`sections.${sectionIndex}.data.items.${jobIndex}.company`)}
              placeholder="Acme Studio"
              className={inputClass}
            />
          </FieldRow>
          <FieldRow label="Role" required tip="Use your real job title. If your internal title was unusual (e.g., 'Pixel Wrangler'), translate it to a standard equivalent ('Frontend Engineer') so recruiters and ATS systems can match it.">
            <input
              {...form.register(`sections.${sectionIndex}.data.items.${jobIndex}.role`)}
              placeholder="Frontend Engineer"
              className={inputClass}
            />
          </FieldRow>
          <FieldRow label="Location" tip="City and country, or 'Remote'. Skip street addresses. If you worked remote for a company in another city, write 'Remote' — not the company's HQ city.">
            <input
              {...form.register(`sections.${sectionIndex}.data.items.${jobIndex}.location`)}
              placeholder="Remote"
              className={inputClass}
            />
          </FieldRow>
          <div className="grid grid-cols-2 border-b border-hairline">
            <div className="grid grid-cols-[60px_1fr_44px] items-center focus-within:bg-ivory-warm transition-colors">
              <label className="text-[13px] text-ink-soft px-3 py-3.5 font-medium">Start</label>
              <input
                {...form.register(`sections.${sectionIndex}.data.items.${jobIndex}.startDate`)}
                placeholder="MM/YYYY"
                className={inputClass}
              />
              <div className="border-l border-hairline h-full flex items-center justify-center">
                <FieldTip text="Use MM/YYYY format (e.g., '03/2022'). Consistency across all entries beats precision." />
              </div>
            </div>
            <div className="grid grid-cols-[60px_1fr_44px] items-center border-l border-hairline focus-within:bg-ivory-warm transition-colors">
              <label className="text-[13px] text-ink-soft px-3 py-3.5 font-medium">End</label>
              <input
                {...form.register(`sections.${sectionIndex}.data.items.${jobIndex}.endDate`)}
                placeholder="Present"
                className={inputClass}
              />
              <div className="border-l border-hairline h-full flex items-center justify-center">
                <FieldTip text="Use MM/YYYY, or 'Present' if you're still in this role. Don't leave blank — recruiters notice gaps and ambiguous dates." />
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10.5px] tracking-wider uppercase text-ink-mid">
                  Bullet points
                </span>
                <FieldTip text="Start each bullet with a strong past-tense verb — 'Led', 'Built', 'Shipped', 'Reduced'. Quantify impact whenever possible: '40% faster', '$2M saved', '3-person team'. Skip 'responsible for' and 'helped with' — they signal absence of agency. One line per bullet, 3-6 bullets per role." />
              </div>
              <button
                type="button"
                onClick={() => appendBullet({ id: crypto.randomUUID(), text: "" })}
                className="text-[11.5px] text-ink-soft hover:text-ink"
              >
                + Add bullet
              </button>
            </div>
            {bullets.length === 0 && (
              <p className="text-[11.5px] text-ink-faint italic">No bullets yet.</p>
            )}
            <div className="space-y-1.5">
              {bullets.map((b, bIndex) => (
                <div key={b.id} className="flex gap-1.5 items-start">
                  <input
                    {...form.register(
                      `sections.${sectionIndex}.data.items.${jobIndex}.bullets.${bIndex}.text`
                    )}
                    placeholder="What you did, what you shipped, the impact."
                    className="flex-1 bg-paper border border-hairline rounded-sm text-[13px] px-2.5 py-2 outline-none focus:border-ink-mid placeholder:text-ink-faint"
                  />
                  <button
                    type="button"
                    onClick={() => removeBullet(bIndex)}
                    aria-label="Remove bullet"
                    className="text-ink-mid hover:text-red-700 px-1.5 py-2 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}



const inputClass =
  "w-full bg-transparent border-0 text-[14px] text-ink py-3.5 pr-4 outline-none placeholder:text-ink-faint";

function ExperienceScreen({ section, theme }: SectionScreenProps<ExperienceSection>) {
  const items = section.data.items.filter(
    (i) => i.company.trim() || i.role.trim() || i.bullets.some((b) => b.text.trim())
  );
  if (items.length === 0) return null;

  return (
    <section className={theme.sectionClass}>
      <h2 className={theme.sectionTitleClass}>Work Experience</h2>
      {items.map((job) => {
        const validBullets = job.bullets.filter((b) => b.text.trim());
        const dateRange = formatDateRange(job.startDate, job.endDate, job.current);
        return (
          <div key={job.id} className="mb-2.5">
            <div className={theme.itemHeaderClass}>
              <span className={theme.itemTitleClass}>{job.company || "Company"}</span>
              {dateRange && <span className={theme.itemDateClass}>{dateRange}</span>}
            </div>
            {job.role && <div className={theme.itemSubtitleClass}>{job.role}</div>}
            {validBullets.length > 0 && (
              <ul className={theme.bulletListClass}>
                {validBullets.map((b) => (
                  <li key={b.id} className={theme.bulletItemClass}>
                    {b.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </section>
  );
}

function formatDateRange(start: string, end: string, current: boolean): string {
  const endLabel = current ? "Present" : end;
  if (!start && !endLabel) return "";
  if (!start) return endLabel;
  if (!endLabel) return start;
  return `${start} — ${endLabel}`;
}

export const experienceEntry: SectionEntry<ExperienceSection> = {
  type: "experience",
  label: "Experience",
  description: "Work history with bullet points.",
  formComponent: ExperienceForm,
  screenComponent: ExperienceScreen as never,
  isEmpty: (s) =>
    s.data.items.every(
      (i) => !i.company.trim() && !i.role.trim() && !i.bullets.some((b) => b.text.trim())
    ),
};