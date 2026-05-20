import { useEffect, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cvSchema, CVData, Section } from "./schema";

const STORAGE_KEY = "cv-builder-data";

function makeDefaultSections(): Section[] {
  return [
    { id: crypto.randomUUID(), type: "summary", visible: true, data: { text: "" } },
    { id: crypto.randomUUID(), type: "experience", visible: true, data: { items: [] } },
    { id: crypto.randomUUID(), type: "education", visible: true, data: { items: [] } },
    { id: crypto.randomUUID(), type: "skills", visible: true, data: { groups: [] } },
  ];
}

function makeDefaultCV(): CVData {
  return {
    schemaVersion: 2,
    theme: "harvard",
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    sections: makeDefaultSections(),
  };
}

function loadFromStorage(): CVData {
  if (typeof window === "undefined") return makeDefaultCV();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return makeDefaultCV();
    const parsed = JSON.parse(raw);
    const result = cvSchema.safeParse(parsed);
    if (result.success) return result.data;
    console.warn("Stored CV failed validation, resetting", result.error);
    localStorage.removeItem(STORAGE_KEY);
    return makeDefaultCV();
  } catch {
    return makeDefaultCV();
  }
}

function debounce<T extends (...args: never[]) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function useCVForm() {
  const [isMounted, setIsMounted] = useState(false);

  const form = useForm<CVData>({
    resolver: zodResolver(cvSchema) as unknown as Resolver<CVData>,
    defaultValues: makeDefaultCV(),
    mode: "onChange",
  });

  useEffect(() => {
    const loaded = loadFromStorage();
    form.reset(loaded);
    setIsMounted(true);
  }, [form]);

  const persistRef = useRef(
    debounce((value: CVData) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch (err) {
        console.error("Failed to persist CV", err);
      }
    }, 400)
  );

  useEffect(() => {
    if (!isMounted) return;
    const sub = form.watch((value) => {
      persistRef.current(value as CVData);
    });
    return () => sub.unsubscribe();
  }, [form, isMounted]);

  return { form, isMounted };
}

export { makeDefaultCV, makeDefaultSections };