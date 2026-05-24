"use client";

import { pdf } from "@react-pdf/renderer";
import { CVPdfDocument } from "./document";
import type { CVData } from "@/lib/schema";
import type { PaperSize, PdfThemeId } from "./themes";

export async function exportCVAsPdf(
  data: CVData,
  themeId: PdfThemeId,
  paperSize: PaperSize
): Promise<void> {
  const blob = await pdf(
    <CVPdfDocument data={data} themeId={themeId} paperSize={paperSize} />
  ).toBlob();

  const fileName = buildFileName(data.personalInfo.fullName);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function buildFileName(name: string): string {
  const safe = (name || "CV")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "");
  return `${safe || "CV"}.pdf`;
}