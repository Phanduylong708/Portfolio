import ClosingCta from "../components/ClosingCta.jsx";
import PageHero from "../components/PageHero.jsx";
import PageShell from "../components/PageShell.jsx";
import SkillBar from "../components/SkillBar.jsx";
import SplitSection from "../components/SplitSection.jsx";
import { languages, softSkills, technicalSkills } from "../data/skills.js";
import { useInnerPageMotion } from "../hooks/useInnerPageMotion.js";
import { useI18n } from "../i18n/useI18n.js";
import { innerStyles } from "../styles/pageStyles.js";

export default function Skills() {
  useInnerPageMotion();
  const { t, pick } = useI18n();

  return (
    <PageShell title={t("skills.title")} styles={innerStyles}>
      <main id="content">
        <PageHero
          crumb={t("nav.skills")}
          heading={t("skills.heading")}
          headingEm={t("skills.headingEm")}
          lead={t("skills.lead")}
        />

        <SplitSection id="technical" eyebrow={t("skills.technical")} title={t("skills.technicalTitle")}>
          <div className="skill-groups">
            {technicalSkills.map((group) => (
              <section key={group.id} className="skill-group" aria-labelledby={`skills-${group.id}`}>
                <h3 id={`skills-${group.id}`} className="meta">
                  {t(`skills.groups.${group.id}`)}
                </h3>
                <ul className="skill-list">
                  {group.items.map((skill) => (
                    <SkillBar key={skill.name} {...skill} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </SplitSection>

        <SplitSection
          id="soft"
          eyebrow={t("skills.soft")}
          title={t("skills.softTitle")}
        >
          <div className="grid-2 soft-grid">
            {pick(softSkills.content).map((skill, i) => (
              <article key={skill.name} className="feature card-flat">
                <span className="meta">{String(i + 1).padStart(2, "0")}</span>
                <h3>{skill.name}</h3>
                <p>{skill.note}</p>
              </article>
            ))}
          </div>
        </SplitSection>

        <SplitSection id="languages" eyebrow={t("skills.languages")} title={t("skills.languagesTitle")}>
          {languages.map((lang) => {
            const c = pick(lang.content);
            return (
              <article key={lang.id} className="log-row language-row">
                <h3>{c.name}</h3>
                <p>{c.level}</p>
              </article>
            );
          })}
        </SplitSection>

        <ClosingCta index="04" />
      </main>
    </PageShell>
  );
}
