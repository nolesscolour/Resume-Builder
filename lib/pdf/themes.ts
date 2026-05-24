import { Font, type Styles } from "@react-pdf/renderer";

type Style = Styles[string];

// Register fonts once at module load
Font.register({
  family: "InstrumentSerif",
  fonts: [
    { src: "/fonts/InstrumentSerif-Regular.ttf" },
    { src: "/fonts/InstrumentSerif-Italic.ttf", fontStyle: "italic" },
  ],
});

Font.register({
  family: "Inter",
  fonts: [
    { src: "/fonts/Inter-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/Inter-Italic.ttf", fontWeight: 400, fontStyle: "italic" },
    { src: "/fonts/Inter-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/Inter-MediumItalic.ttf", fontWeight: 500, fontStyle: "italic" },
    { src: "/fonts/Inter-SemiBold.ttf", fontWeight: 600 },
    { src: "/fonts/Inter-SemiBoldItalic.ttf", fontWeight: 600, fontStyle: "italic" },
    { src: "/fonts/Inter-Bold.ttf", fontWeight: 700 },
    { src: "/fonts/Inter-BoldItalic.ttf", fontWeight: 700, fontStyle: "italic" },
    { src: "/fonts/Inter-ExtraBold.ttf", fontWeight: 800 },
    { src: "/fonts/Inter-ExtraBoldItalic.ttf", fontWeight: 800, fontStyle: "italic" },
    { src: "/fonts/Inter-Black.ttf", fontWeight: 900 },
    { src: "/fonts/Inter-BlackItalic.ttf", fontWeight: 900, fontStyle: "italic" },
  ],
});

Font.register({
  family: "SourceSerif",
  fonts: [
    { src: "/fonts/SourceSerif4.ttf", fontWeight: 400 },
    { src: "/fonts/SourceSerif4.ttf", fontWeight: 500 },
    { src: "/fonts/SourceSerif4.ttf", fontWeight: 600 },
    { src: "/fonts/SourceSerif4.ttf", fontWeight: 700 },
    { src: "/fonts/SourceSerif4.ttf", fontWeight: 800 },
    { src: "/fonts/SourceSerif4-Italic.ttf", fontStyle: "italic" },
  ],
});

Font.register({
  family: "LibreCaslon",
  fonts: [
    { src: "/fonts/LibreCaslonText-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/LibreCaslonText-Italic.ttf", fontWeight: 400, fontStyle: "italic" },
    { src: "/fonts/LibreCaslonText-Bold.ttf", fontWeight: 700 },
  ],
});

export type PdfThemeId = "harvard" | "faang" | "dense";

export type PdfTheme = {
  id: PdfThemeId;
  label: string;
  pageStyle: Style;
  headerStyle: Style;
  nameStyle: Style;
  contactRowStyle: Style;
  contactItemStyle: Style;
  contactSeparator: string;
  sectionStyle: Style;
  sectionTitleStyle: Style;
  itemHeaderStyle: Style;
  itemTitleStyle: Style;
  itemDateStyle: Style;
  itemSubtitleStyle: Style;
  bulletListStyle: Style;
  bulletItemStyle: Style;
  bulletDotStyle: Style;
  bulletTextStyle: Style;
  bodyStyle: Style;
  mutedStyle: Style;
};

// Color constants (matching screen theme)
const INK = "#1a1a1a";
const INK_SOFT = "#4a4843";
const INK_MID = "#8a8780";
const HAIRLINE = "#cdc6b1";

// Page padding for all themes
const PAGE_PADDING_NORMAL = 56; // ~0.78 inches
const PAGE_PADDING_DENSE = 40;  // ~0.55 inches

export const HARVARD: PdfTheme = {
  id: "harvard",
  label: "Harvard",
  pageStyle: {
    backgroundColor: "#ffffff",
    paddingTop: PAGE_PADDING_NORMAL,
    paddingBottom: PAGE_PADDING_NORMAL,
    paddingHorizontal: PAGE_PADDING_NORMAL,
    fontFamily: "SourceSerif",
    fontSize: 11,
    fontWeight: 900,
    color: INK,
    lineHeight: 1.5,
  },
  headerStyle: {
    flexDirection: "column",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: INK,
    paddingBottom: 6,
    marginBottom: 12,
  },
  nameStyle: {
    fontFamily: "LibreCaslon",
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: 1.8,
    color: INK,
    textTransform: "uppercase",
    lineHeight: 1,
    marginBottom: 6,
  },
  contactRowStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 2,
    fontSize: 10,
  },
  contactItemStyle: { color: INK_SOFT },
  contactSeparator: "  ·  ",
  sectionStyle: { marginBottom: 10 },
  sectionTitleStyle: {
    fontFamily: "LibreCaslon",
    fontSize: 11.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    borderBottomWidth: 0.75,
    borderBottomColor: INK,
    paddingBottom: 1,
    marginBottom: 4,
  },
  itemHeaderStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  itemTitleStyle: { fontWeight: 800, fontSize: 12 },
  itemDateStyle: { fontSize: 10, color: INK_SOFT },
  itemSubtitleStyle: { fontSize: 10, marginBottom: 1, fontStyle: "italic", fontWeight: 400, color: INK_SOFT },
  bulletListStyle: { marginTop: 1, marginLeft: 14 },
  bulletItemStyle: { flexDirection: "row", marginBottom: 0 },
  bulletDotStyle: { width: 10, fontSize: 10 },
  bulletTextStyle: { flex: 1, fontSize: 10, fontWeight: 500 },
  bodyStyle: { fontSize: 11, fontWeight: 500 },
  mutedStyle: { fontSize: 10, color: INK_SOFT, fontWeight: 500 },
};

export const FAANG: PdfTheme = {
  id: "faang",
  label: "FAANG",
  pageStyle: {
    backgroundColor: "#ffffff",
    paddingTop: PAGE_PADDING_NORMAL,
    paddingBottom: PAGE_PADDING_NORMAL,
    paddingHorizontal: PAGE_PADDING_NORMAL,
    fontFamily: "Inter",
    fontSize: 10,
    color: INK,
    lineHeight: 1.4,
  },
  headerStyle: {
    flexDirection: "column",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: INK,
    paddingBottom: 10,
    marginBottom: 14,
  },
  nameStyle: {
    fontFamily: "Inter",
    fontWeight: 900,
    fontSize: 24,
    color: INK,
    lineHeight: 1,
    marginBottom: 8,
  },
  contactRowStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
    fontSize: 9,
  },
  contactItemStyle: { color: INK_SOFT },
  contactSeparator: "  ·  ",
  sectionStyle: { marginBottom: 14 },
  sectionTitleStyle: {
    fontFamily: "Inter",
    fontSize: 10,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: INK,
    marginBottom: 6,
  },
  itemHeaderStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  itemTitleStyle: { fontWeight: 900, fontSize: 10.5 },
  itemDateStyle: { fontSize: 9, color: INK_MID },
  itemSubtitleStyle: { fontSize: 10, color: INK_SOFT, marginBottom: 2 },
  bulletListStyle: { marginTop: 2, marginLeft: 0 },
  bulletItemStyle: { flexDirection: "row", marginBottom: 1 },
  bulletDotStyle: { width: 10, fontSize: 10 },
  bulletTextStyle: { flex: 1, fontSize: 10 },
  bodyStyle: { fontSize: 10 },
  mutedStyle: { fontSize: 9, color: INK_MID },
};

export const DENSE: PdfTheme = {
  id: "dense",
  label: "Dense",
  pageStyle: {
    backgroundColor: "#ffffff",
    paddingTop: PAGE_PADDING_DENSE,
    paddingBottom: PAGE_PADDING_DENSE,
    paddingHorizontal: PAGE_PADDING_DENSE,
    fontFamily: "Inter",
    fontSize: 9.5,
    color: INK,
    lineHeight: 1.3,
  },
  headerStyle: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  nameStyle: {
    fontFamily: "Inter",
    fontWeight: 900,
    fontSize: 18,
    color: INK,
    lineHeight: 1,
    marginBottom: 6,
  },
  contactRowStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 3,
    fontSize: 8.5,
  },
  contactItemStyle: { color: INK_SOFT },
  contactSeparator: "  ·  ",
  sectionStyle: { marginBottom: 8 },
  sectionTitleStyle: {
    fontFamily: "Inter",
    fontSize: 9,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: INK,
    marginBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: HAIRLINE,
    paddingBottom: 1,
  },
  itemHeaderStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  itemTitleStyle: { fontWeight: 900, fontSize: 10 },
  itemDateStyle: { fontSize: 8.5, color: INK_MID },
  itemSubtitleStyle: { fontSize: 9.5, color: INK_SOFT },
  bulletListStyle: { marginTop: 1, marginLeft: 0 },
  bulletItemStyle: { flexDirection: "row", marginBottom: 0 },
  bulletDotStyle: { width: 8, fontSize: 9.5 },
  bulletTextStyle: { flex: 1, fontSize: 9.5 },
  bodyStyle: { fontSize: 9.5 },
  mutedStyle: { fontSize: 8.5, color: INK_MID },
};

export const PDF_THEMES: Record<PdfThemeId, PdfTheme> = {
  harvard: HARVARD,
  faang: FAANG,
  dense: DENSE,
};

export function getPdfTheme(id: PdfThemeId): PdfTheme {
  return PDF_THEMES[id] ?? HARVARD;
}

export type PaperSize = "letter" | "a4";

export const PAPER_SIZES: Record<PaperSize, { label: string; pdfSize: "LETTER" | "A4" }> = {
  letter: { label: "Letter", pdfSize: "LETTER" },
  a4: { label: "A4", pdfSize: "A4" },
};