import { Document, Page, View, Text } from "@react-pdf/renderer";
import { getPdfTheme, PAPER_SIZES, type PaperSize, type PdfThemeId } from "./themes";
import type { CVData } from "@/lib/schema";

type Props = {
  data: CVData;
  themeId: PdfThemeId;
  paperSize: PaperSize;
};

export function CVPdfDocument({ data, themeId, paperSize }: Props) {
  const theme = getPdfTheme(themeId);
  const paper = PAPER_SIZES[paperSize];

  const summary = data.sections.find((s) => s.type === "summary");
  const experience = data.sections.find((s) => s.type === "experience");
  const education = data.sections.find((s) => s.type === "education");
  const skills = data.sections.find((s) => s.type === "skills");

  return (
    <Document
      title={data.personalInfo.fullName ? `${data.personalInfo.fullName} — CV` : "CV"}
      author={data.personalInfo.fullName || undefined}
    >
      <Page size={paper.pdfSize} style={theme.pageStyle}>
        <PersonalHeader data={data.personalInfo} theme={theme} />

        {summary?.type === "summary" && summary.data.text.trim() && (
          <View style={theme.sectionStyle}>
            <Text style={theme.sectionTitleStyle}>Summary</Text>
            <Text style={theme.bodyStyle}>{summary.data.text.trim()}</Text>
          </View>
        )}

        {experience?.type === "experience" && experience.data.items.length > 0 && (
          <ExperienceBlock items={experience.data.items} theme={theme} />
        )}

        {education?.type === "education" && education.data.items.length > 0 && (
          <EducationBlock items={education.data.items} theme={theme} />
        )}

        {skills?.type === "skills" && skills.data.groups.length > 0 && (
          <SkillsBlock groups={skills.data.groups} theme={theme} />
        )}
      </Page>
    </Document>
  );
}

function PersonalHeader({
  data,
  theme,
}: {
  data: CVData["personalInfo"];
  theme: ReturnType<typeof getPdfTheme>;
}) {
  const items = [
    data.email,
    data.phone,
    data.location,
    data.linkedin,
    data.github,
    data.website,
  ].filter((v) => v.trim());

  const contactLine = items.join(theme.contactSeparator);

  return (
    <View style={theme.headerStyle}>
      <Text style={theme.nameStyle}>{data.fullName || "Your Name"}</Text>
      {contactLine && (
        <Text style={[theme.contactRowStyle, theme.contactItemStyle]}>{contactLine}</Text>
      )}
    </View>
  );
}

function ExperienceBlock({
  items,
  theme,
}: {
  items: Array<{
    id: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: Array<{ id: string; text: string }>;
  }>;
  theme: ReturnType<typeof getPdfTheme>;
}) {
  const filtered = items.filter(
    (i) => i.company.trim() || i.role.trim() || i.bullets.some((b) => b.text.trim())
  );
  if (filtered.length === 0) return null;

  return (
    <View style={theme.sectionStyle}>
      {filtered.map((job, index) => {
        const validBullets = job.bullets.filter((b) => b.text.trim());
        const dateRange = formatDateRange(job.startDate, job.endDate, job.current);
        const isFirst = index === 0;
        const entryInner = (
          <>
            <View style={theme.itemHeaderStyle}>
              <Text style={theme.itemTitleStyle}>{job.company || "Company"}</Text>
              {dateRange && <Text style={theme.itemDateStyle}>{dateRange}</Text>}
            </View>
            {job.role && <Text style={theme.itemSubtitleStyle}>{job.role}</Text>}
            {validBullets.length > 0 && (
              <View style={theme.bulletListStyle}>
                {validBullets.map((b) => (
                  <View key={b.id} style={theme.bulletItemStyle}>
                    <Text style={theme.bulletDotStyle}>•</Text>
                    <Text style={theme.bulletTextStyle}>{b.text}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        );
        if (isFirst) {
          return (
            <View key={job.id} style={{ marginBottom: 6 }}>
              <View wrap={false}>
                <Text style={theme.sectionTitleStyle}>Work Experience</Text>
                <View style={theme.itemHeaderStyle}>
                  <Text style={theme.itemTitleStyle}>{job.company || "Company"}</Text>
                  {dateRange && <Text style={theme.itemDateStyle}>{dateRange}</Text>}
                </View>
                {job.role && <Text style={theme.itemSubtitleStyle}>{job.role}</Text>}
              </View>
              {validBullets.length > 0 && (
                <View style={theme.bulletListStyle}>
                  {validBullets.map((b) => (
                    <View key={b.id} style={theme.bulletItemStyle}>
                      <Text style={theme.bulletDotStyle}>•</Text>
                      <Text style={theme.bulletTextStyle}>{b.text}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        }
        return (
          <View key={job.id} style={{ marginBottom: 6 }}>
            {entryInner}
          </View>
        );
      })}
    </View>
  );
}

function EducationBlock({
  items,
  theme,
}: {
  items: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  theme: ReturnType<typeof getPdfTheme>;
}) {
  const filtered = items.filter((i) => i.school.trim() || i.degree.trim());
  if (filtered.length === 0) return null;

  return (
    <View style={theme.sectionStyle}>
      {filtered.map((edu, index) => {
        const degreeLine = [edu.degree, edu.field].filter(Boolean).join(", ");
        const dateRange = formatSimpleDateRange(edu.startDate, edu.endDate);
        const isFirst = index === 0;
        if (isFirst) {
          return (
            <View key={edu.id} style={{ marginBottom: 6 }} wrap={false}>
              <Text style={theme.sectionTitleStyle}>Education</Text>
              <View style={theme.itemHeaderStyle}>
                <Text style={theme.itemTitleStyle}>{edu.school || "School"}</Text>
                {dateRange && <Text style={theme.itemDateStyle}>{dateRange}</Text>}
              </View>
              {degreeLine && <Text style={theme.itemSubtitleStyle}>{degreeLine}</Text>}
              {edu.gpa && <Text style={theme.mutedStyle}>GPA: {edu.gpa}</Text>}
            </View>
          );
        }
        return (
          <View key={edu.id} style={{ marginBottom: 6 }}>
            <View style={theme.itemHeaderStyle}>
              <Text style={theme.itemTitleStyle}>{edu.school || "School"}</Text>
              {dateRange && <Text style={theme.itemDateStyle}>{dateRange}</Text>}
            </View>
            {degreeLine && <Text style={theme.itemSubtitleStyle}>{degreeLine}</Text>}
            {edu.gpa && <Text style={theme.mutedStyle}>GPA: {edu.gpa}</Text>}
          </View>
        );
      })}
    </View>
  );
}

function SkillsBlock({
  groups,
  theme,
}: {
  groups: Array<{ id: string; label: string; items: string[] }>;
  theme: ReturnType<typeof getPdfTheme>;
}) {
  const filtered = groups.filter((g) => g.items.length > 0);
  if (filtered.length === 0) return null;

  return (
    <View style={theme.sectionStyle}>
      <Text style={theme.sectionTitleStyle}>Skills</Text>
      {filtered.map((g) => (
        <View key={g.id} style={{ marginBottom: 1 }} wrap={false}>
          <Text style={theme.bodyStyle}>
            {g.label && <Text style={{ fontWeight: 700 }}>{g.label}: </Text>}
            {g.items.join(", ")}
          </Text>
        </View>
      ))}
    </View>
  );
}

function formatDateRange(start: string, end: string, current: boolean): string {
  const endLabel = current ? "Present" : end;
  if (!start && !endLabel) return "";
  if (!start) return endLabel;
  if (!endLabel) return start;
  return `${start} — ${endLabel}`;
}

function formatSimpleDateRange(start: string, end: string): string {
  if (!start && !end) return "";
  if (!start) return end;
  if (!end) return start;
  return `${start} — ${end}`;
}