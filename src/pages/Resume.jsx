import ClosingCta from "../components/ClosingCta.jsx";
import PageHero from "../components/PageHero.jsx";
import PageShell from "../components/PageShell.jsx";
import SplitSection from "../components/SplitSection.jsx";
import TimelineEntry from "../components/TimelineEntry.jsx";
import { IconDownload } from "../components/icons.jsx";
import { profile } from "../data/profile.js";
import { education, experience } from "../data/resume.js";
import { useInnerPageMotion } from "../hooks/useInnerPageMotion.js";
import { useI18n } from "../i18n/useI18n.js";
import { innerStyles } from "../styles/pageStyles.js";

export default function Resume() {
  useInnerPageMotion();
  const { t, pick } = useI18n();
  const me = pick(profile.content);
  const personal = [
    ...me.personal,
    { label: t("resume.email"), value: profile.contacts.email, href: `mailto:${profile.contacts.email}` },
    { label: t("resume.phone"), value: profile.contacts.phone, href: profile.contacts.phoneHref },
  ];

  return (
    <PageShell title={t("resume.title")} styles={innerStyles}>
      <main id="content">
        <PageHero
          crumb={t("nav.resume")}
          heading={t("resume.heading")}
          headingEm={t("resume.headingEm")}
          lead={t("resume.lead")}
          action={
            <a className="text-link" href={profile.cv} download>
              {t("resume.downloadCv")} <IconDownload />
            </a>
          }
        />

        <SplitSection id="personal" eyebrow={t("resume.personal")} title={t("resume.personalTitle")}>
          <dl className="info-list">
            {personal.map(({ label, value, href }) => (
              <div key={label}>
                <dt className="meta">{label}</dt>
                <dd>
                  {href ? <a href={href}>{value}</a> : value}
                </dd>
              </div>
            ))}
          </dl>
        </SplitSection>

        <SplitSection
          id="objective"
          eyebrow={t("resume.objective")}
          title={t("resume.objectiveTitle")}
        >
          <div className="prose">
            {me.objective.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </SplitSection>

        <SplitSection id="education" eyebrow={t("resume.education")} title={t("resume.educationTitle")}>
          {education.map((item) => {
            const c = pick(item.content);
            return (
              <TimelineEntry
                key={item.id}
                start={item.start}
                end={item.end}
                title={c.school}
                subtitle={`${c.major} · ${t("resume.gpa")} ${item.gpa}`}
              />
            );
          })}
        </SplitSection>

        <SplitSection id="experience" eyebrow={t("resume.experience")} title={t("resume.experienceTitle")}>
          {experience.map((item) => {
            const c = pick(item.content);
            return (
              <TimelineEntry
                key={item.id}
                start={item.start}
                end={item.end}
                title={c.company}
                subtitle={`${c.role} · ${c.location}`}
              >
                <ul className="bullet-list">
                  {c.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </TimelineEntry>
            );
          })}
        </SplitSection>

        <ClosingCta index="05" />
      </main>
    </PageShell>
  );
}
