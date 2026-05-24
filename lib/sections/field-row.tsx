"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";
import { useState, type ReactNode } from "react";

type FieldRowProps = {
  label: string;
  children: ReactNode;
  required?: boolean;
  last?: boolean;
  tip?: string;
};

export function FieldRow({ label, children, required, last, tip }: FieldRowProps) {
  return (
    <div
      className={`grid grid-cols-[96px_1fr_44px] items-center ${last ? "" : "border-b border-hairline"} focus-within:bg-ivory-warm transition-colors`}
    >
      <label className="text-[13px] text-ink-soft px-4 py-3.5 font-medium">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      <div className="min-w-0">{children}</div>
      <div className="border-l border-hairline h-full flex items-center justify-center">
        {tip && <FieldTip text={tip} />}
      </div>
    </div>
  );
}

export function FieldTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            aria-label="More info"
            onClick={(e) => {
              e.preventDefault();
              setOpen((v) => !v);
            }}
            className="text-ink-faint hover:text-ink transition-colors inline-flex items-center"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="left"
            align="center"
            sideOffset={6}
            onPointerDownOutside={() => setOpen(false)}
            className="z-50 max-w-[260px] bg-ink text-panel text-[12px] leading-snug font-normal rounded-md px-3 py-2 shadow-[0_8px_24px_-6px_rgba(58,52,30,0.4)]"
          >
            {text}
            <Tooltip.Arrow className="fill-ink" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}