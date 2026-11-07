import { useRef } from "react";
import { useI18n } from "../i18n/useI18n.js";
import { magnet, softIn } from "../lib/softText.js";
import { IconArrowUpRight } from "./icons.jsx";
import SoftText from "./SoftText.jsx";

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

const external = { target: "_blank", rel: "noopener noreferrer" };

export default function ProjectCard({ project, headingLevel = "h2" }) {
  const { t, pick } = useI18n();
  const content = pick(project.content);
  const Heading = headingLevel;
  const titleRef = useRef(null);
  const openRef = useRef(null);
  // Same hover language as the Home work cards: title blurs in, round button follows the pointer.
  const onEnter = (e) => {
    if (e.pointerType !== "touch" && !reducedMotion()) softIn(titleRef.current);
  };
  const onMove = (e) => !reducedMotion() && magnet(openRef.current, e);
  const onLeave = () => (openRef.current.style.translate = "0px 0px");
  return (
    <article className={`project-card tone-${project.tone}`} onPointerEnter={onEnter}>
      {/* Mouse shortcut to the primary link; keyboard users reach the same links below. */}
      <a
        className="project-thumb"
        href={project.demo ?? project.github}
        {...external}
        tabIndex={-1}
        aria-hidden="true"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <img
          src={project.thumbnail}
          alt={content.thumbnailAlt}
          width="800"
          height="500"
          loading="lazy"
          decoding="async"
        />
        <span className="project-open" ref={openRef}>
          <IconArrowUpRight />
        </span>
      </a>
      <div className="project-body">
        <Heading className="project-title" ref={titleRef}>
          <SoftText text={content.title} />
        </Heading>
        <p className="project-summary">{content.summary}</p>
        {content.highlights && (
          <ul className="project-highlights">
            {content.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        <ul className="project-tags" aria-label={t("projects.stack")}>
          {project.tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
        <div className="project-links">
          <a className="btn btn-secondary" href={project.github} {...external}>
            {t("projects.github")} <IconArrowUpRight className="lucide" />
          </a>
          {project.demo ? (
            <a className="btn btn-primary" href={project.demo} {...external}>
              {t("projects.demo")} <IconArrowUpRight className="lucide" />
            </a>
          ) : (
            <span className="tooltip-wrap">
              <button
                type="button"
                className="btn btn-primary"
                aria-disabled="true"
                aria-describedby={`${project.id}-demo-note`}
                onClick={(e) => e.preventDefault()}
              >
                {t("projects.demo")}
              </button>
              <span role="tooltip" id={`${project.id}-demo-note`} className="tooltip">
                {t("projects.notDeployed")}
              </span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
