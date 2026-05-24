"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { Lightbulb, X, Check, Ban, ChevronDown } from "lucide-react";
import { CV_TYPES, TIPS, FAQS, type CVType, type CVSection } from "./content";

const SECTIONS: { id: CVSection; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
];

export function TipsModalTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 border border-hairline-strong rounded-sm px-3 py-2 text-[12.5px] font-medium text-ink hover:border-ink-mid hover:bg-ivory-warm transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          CV Building Tips
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-panel border border-hairline rounded-md w-[calc(100vw-2rem)] max-w-[900px] h-[calc(100vh-4rem)] max-h-[720px] z-50 shadow-[0_24px_60px_-20px_rgba(58,52,30,0.35)] flex flex-col overflow-hidden">
          <TipsContent onClose={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function TipsContent({ onClose }: { onClose: () => void }) {
  const [cvType, setCvType] = useState<CVType>("engineer");
  const [tab, setTab] = useState<CVSection>("summary");

  const content = TIPS[cvType];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-hairline shrink-0">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-ink-soft" />
          <Dialog.Title className="font-display text-xl text-ink leading-none">
            CV Building Tips
          </Dialog.Title>
        </div>
        <Dialog.Close asChild>
          <button
            type="button"
            aria-label="Close"
            className="w-8 h-8 rounded-sm border border-hairline flex items-center justify-center text-ink-soft hover:text-ink hover:border-ink-mid transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </Dialog.Close>
      </div>

      <Dialog.Description className="sr-only">
        Tips and best practices for writing each section of your CV, tailored by role type.
      </Dialog.Description>

      {/* CV type dropdown */}
      <div className="px-6 py-4 border-b border-hairline shrink-0 bg-ivory-warm/30">
        <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-mid mb-2">
          CV Type
        </label>
        <CVTypeDropdown value={cvType} onChange={setCvType} />
        <p className="text-[12px] text-ink-mid mt-2 leading-snug">{content.blurb}</p>
      </div>

      {/* Tabs + content */}
      <Tabs.Root
        value={tab}
        onValueChange={(v) => setTab(v as CVSection)}
        className="flex flex-col flex-1 min-h-0"
      >
        <Tabs.List className="flex gap-1.5 px-6 pt-4 pb-3 border-b border-hairline shrink-0 overflow-x-auto no-scrollbar">
          {SECTIONS.map((s) => (
            <Tabs.Trigger
              key={s.id}
              value={s.id}
              className="text-[13px] font-medium text-ink-mid px-3.5 py-1.5 border border-dashed border-hairline-strong rounded-sm whitespace-nowrap data-[state=active]:bg-ink data-[state=active]:text-panel data-[state=active]:border-ink hover:text-ink hover:border-ink-mid transition-colors data-[state=active]:hover:text-panel"
            >
              {s.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 no-scrollbar">
          {SECTIONS.map((s) => (
            <Tabs.Content key={s.id} value={s.id} className="outline-none">
              <DosDontsTable block={content.sections[s.id]} />
            </Tabs.Content>
          ))}

          {/* FAQ — always visible below the active tab content */}
          <div className="mt-10 pt-6 border-t border-hairline">
            <h3 className="font-mono text-[11px] tracking-[0.08em] uppercase text-ink-mid mb-3">
              / FAQ — Writing style
            </h3>
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </Tabs.Root>
    </>
  );
}

function CVTypeDropdown({
  value,
  onChange,
}: {
  value: CVType;
  onChange: (v: CVType) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CVType)}
        className="w-full appearance-none bg-paper border border-hairline-strong rounded-sm pl-3 pr-9 py-2 text-[13px] text-ink font-medium hover:border-ink-mid focus:border-ink focus:outline-none transition-colors cursor-pointer"
      >
        {CV_TYPES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-mid pointer-events-none" />
    </div>
  );
}

function DosDontsTable({ block }: { block: { dos: string[]; donts: string[] } }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="border border-hairline rounded-md bg-paper overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-hairline bg-emerald-50/50">
          <Check className="w-3.5 h-3.5 text-emerald-700" />
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-emerald-800 font-semibold">
            Do
          </span>
        </div>
        <ul className="p-4 space-y-2.5">
          {block.dos.map((item, i) => (
            <li key={i} className="text-[12.5px] text-ink leading-snug flex gap-2">
              <span className="text-emerald-700 shrink-0">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border border-hairline rounded-md bg-paper overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-hairline bg-red-50/50">
          <Ban className="w-3.5 h-3.5 text-red-700" />
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-red-800 font-semibold">
            Don't
          </span>
        </div>
        <ul className="p-4 space-y-2.5">
          {block.donts.map((item, i) => (
            <li key={i} className="text-[12.5px] text-ink leading-snug flex gap-2">
              <span className="text-red-700 shrink-0">×</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-hairline rounded-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-ivory-warm/30 transition-colors"
      >
        <span className="text-[13px] font-medium text-ink">{question}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-ink-mid transition-transform shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 text-[12.5px] text-ink-soft leading-snug">
          {answer}
        </div>
      )}
    </div>
  );
}