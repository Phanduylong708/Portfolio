import { useCallback } from "react";
import ClosingCta from "../components/ClosingCta.jsx";
import PageHero from "../components/PageHero.jsx";
import PageShell from "../components/PageShell.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import { IconSearch } from "../components/icons.jsx";
import { projects, projectTags } from "../data/projects.js";
import { useInnerPageMotion } from "../hooks/useInnerPageMotion.js";
import { ALL_TAGS, useProjectFilter } from "../hooks/useProjectFilter.js";
import { useI18n } from "../i18n/useI18n.js";
import { innerStyles } from "../styles/pageStyles.js";

export default function Projects() {
  useInnerPageMotion();
  const { t, pick } = useI18n();
  const getTitle = useCallback((p) => pick(p.content).title, [pick]);
  const { tag, setTag, query, setQuery, results, reset } = useProjectFilter(projects, getTitle);

  return (
    <PageShell title={t("projects.title")} styles={innerStyles}>
      <main id="content">
        <PageHero
          crumb={t("nav.projects")}
          heading={t("projects.heading")}
          headingEm={t("projects.headingEm")}
          lead={t("projects.lead")}
        />

        <section className="section" aria-label={t("nav.projects")}>
          <div className="container">
            <div className="project-controls">
              <form className="search-form" role="search" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="project-query" className="sr-only">
                  {t("projects.searchLabel")}
                </label>
                <IconSearch className="lucide" />
                <input
                  type="search"
                  id="project-query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("projects.searchPlaceholder")}
                  maxLength="100"
                  autoComplete="off"
                />
              </form>
              <div className="filter-bar" role="group" aria-label={t("projects.filterLabel")}>
                {[ALL_TAGS, ...projectTags].map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={tag === value}
                    onClick={() => setTag(value)}
                  >
                    {value === ALL_TAGS ? t("projects.all") : value}
                  </button>
                ))}
              </div>
            </div>

            <p className="result-summary" role="status">
              {t("projects.count", { count: results.length, total: projects.length })}
            </p>

            {results.length > 0 ? (
              <div className="project-grid">
                {results.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h2>{t("projects.emptyTitle")}</h2>
                <p>{t("projects.emptyText")}</p>
                <button type="button" className="btn btn-secondary" onClick={reset}>
                  {t("projects.reset")}
                </button>
              </div>
            )}
          </div>
        </section>

        <ClosingCta />
      </main>
    </PageShell>
  );
}
