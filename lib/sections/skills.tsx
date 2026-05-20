"use client";

import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2, GripVertical, X } from "lucide-react";
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

type SkillsSection = SectionByType<"skills">;

function SkillsForm({ form, sectionIndex }: SectionFormProps) {
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: `sections.${sectionIndex}.data.groups` as const,
  });

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center sticky top-0 bg-panel py-2 z-10 -mx-1 px-1">
        <h2 className="font-mono text-[11px] tracking-[0.08em] text-ink-mid uppercase">
          / Skills
        </h2>
        <button
          type="button"
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              label: "",
              items: [],
            })
          }
          className="inline-flex items-center gap-1.5 border border-dashed border-hairline-strong text-ink-soft text-[12px] px-2.5 py-1.5 rounded-sm hover:border-ink-mid hover:text-ink transition-colors"
        >
          <Plus className="w-3 h-3" /> Add group
        </button>
      </div>

      {fields.length === 0 && (
        <p className="text-[12.5px] text-ink-faint italic px-1">
          No skill groups yet. Add one to start — e.g. Languages, Frameworks.
        </p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <SortableSkillGroup
                key={field.id}
                id={field.id}
                form={form}
                sectionIndex={sectionIndex}
                groupIndex={index}
                onRemove={() => remove(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableSkillGroup(props: {
  id: string;
  form: SectionFormProps["form"];
  sectionIndex: number;
  groupIndex: number;
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
      <SkillGroupCard {...props} dragAttributes={attributes} dragListeners={listeners} />
    </div>
  );
}

function SkillGroupCard({
  form,
  sectionIndex,
  groupIndex,
  onRemove,
  dragAttributes,
  dragListeners,
}: {
  form: SectionFormProps["form"];
  sectionIndex: number;
  groupIndex: number;
  onRemove: () => void;
  dragAttributes?: React.HTMLAttributes<HTMLButtonElement>;
  dragListeners?: React.DOMAttributes<HTMLButtonElement>;
}) {
  const itemsPath = `sections.${sectionIndex}.data.groups.${groupIndex}.items` as const;
  const items = form.watch(itemsPath) ?? [];
  const [draft, setDraft] = useState("");

  function addItem() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    form.setValue(itemsPath, [...items, trimmed], { shouldDirty: true });
    setDraft("");
  }

  function removeItem(index: number) {
    const next = items.filter((_, i) => i !== index);
    form.setValue(itemsPath, next, { shouldDirty: true });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    } else if (e.key === "Backspace" && draft === "" && items.length > 0) {
      removeItem(items.length - 1);
    }
  }

  return (
    <div className="border border-hairline rounded-md bg-paper overflow-hidden">
      <div className="flex justify-between items-center px-2 py-2 border-b border-hairline bg-ivory-warm/30">
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Drag to reorder"
            className="cursor-grab active:cursor-grabbing text-ink-faint hover:text-ink-mid p-1.5 transition-colors touch-none"
            {...dragAttributes}
            {...dragListeners}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <span className="text-[12px] font-medium text-ink-soft">
            Group #{groupIndex + 1}
          </span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove group"
          className="text-ink-mid hover:text-red-700 transition-colors p-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-[96px_1fr] items-center border-b border-hairline focus-within:bg-ivory-warm transition-colors">
        <label className="text-[13px] text-ink-soft px-4 py-3.5 font-medium">Group</label>
        <input
          {...form.register(`sections.${sectionIndex}.data.groups.${groupIndex}.label`)}
          placeholder="Languages, Frameworks, Tools…"
          className="w-full bg-transparent border-0 text-[14px] text-ink py-3.5 pr-4 outline-none placeholder:text-ink-faint"
        />
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 bg-ivory-warm border border-hairline rounded-sm px-2 py-0.5 text-[12.5px] text-ink"
            >
              {item}
              <button
                type="button"
                onClick={() => removeItem(i)}
                aria-label={`Remove ${item}`}
                className="text-ink-mid hover:text-red-700 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={addItem}
          placeholder={items.length === 0 ? "Type a skill, press Enter" : "Add another…"}
          className="w-full bg-paper border border-hairline rounded-sm text-[13px] px-2.5 py-2 outline-none focus:border-ink-mid placeholder:text-ink-faint"
        />
      </div>
    </div>
  );
}

function SkillsScreen({ section, theme }: SectionScreenProps<SkillsSection>) {
  const groups = section.data.groups.filter((g) => g.items.length > 0);
  if (groups.length === 0) return null;

  return (
    <section className={theme.sectionClass}>
      <h2 className={theme.sectionTitleClass}>Skills</h2>
      <div className={theme.bodyClass}>
        {groups.map((g) => (
          <div key={g.id} className="mb-0.5">
            {g.label && <strong className="font-semibold">{g.label}: </strong>}
            {g.items.join(", ")}
          </div>
        ))}
      </div>
    </section>
  );
}

export const skillsEntry: SectionEntry<SkillsSection> = {
  type: "skills",
  label: "Skills",
  description: "Grouped lists of skills.",
  formComponent: SkillsForm,
  screenComponent: SkillsScreen as never,
  isEmpty: (s) => s.data.groups.every((g) => g.items.length === 0 && !g.label.trim()),
};